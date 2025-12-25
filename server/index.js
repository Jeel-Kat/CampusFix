require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');

const app = express();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['POST']
}));
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/classify', upload.single('photo'), async (req, res) => {
    try {
        const { description } = req.body;
        const photoBase64 = req.body.photo; // Expecting base64 string if not using multer for file

        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set in environment variables');
            return res.status(500).json({ error: 'Server configuration error: Missing API key' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });

        const prompt = `You are CampusFix AI. For this campus complaint: "${description}", classify and return ONLY valid JSON (no markdown, no extra text):
{
  "category": "Electrical",
  "urgency": 7,
  "summary": "Brief title under 60 chars"
}

Valid categories: Electrical, Water, Cleanliness, Infrastructure, Safety, Hostel, Academic, Other
Urgency: 1-10 scale (10 = extreme/safety)`;

        let result;
        if (photoBase64) {
            try {
                const base64Data = photoBase64.includes(',') 
                    ? photoBase64.split(',')[1] 
                    : photoBase64;
                
                const image = {
                    inlineData: {
                        data: base64Data,
                        mimeType: "image/jpeg",
                    },
                };
                result = await model.generateContent([prompt, image]);
            } catch (photoError) {
                console.error('Photo processing error:', photoError.message);
                // Fallback to text-only classification
                result = await model.generateContent(prompt);
            }
        } else {
            result = await model.generateContent(prompt);
        }

        const response = await result.response;
        const text = response.text();

        // Clean up any markdown formatting
        const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Parse and validate
        let data;
        try {
            data = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('JSON parse error:', parseError, 'Raw text:', text);
            return res.status(500).json({ error: 'Invalid AI response format' });
        }

        // Validate required fields
        if (!data.category || !data.urgency || !data.summary) {
            return res.status(500).json({ error: 'AI response missing required fields' });
        }

        // Ensure urgency is numeric
        data.urgency = parseInt(data.urgency, 10);
        if (isNaN(data.urgency) || data.urgency < 1 || data.urgency > 10) {
            data.urgency = 5; // Default middle value
        }

        res.json(data);
    } catch (error) {
        console.error('Classification error:', error.message || error);
        console.error('Error code:', error.code);
        console.error('Full error:', JSON.stringify(error, null, 2));
        
        // More specific error messages
        let statusCode = 500;
        let errorMsg = 'Failed to classify ticket';
        
        if (error.message.includes('API_KEY') || error.message.includes('invalid')) {
            statusCode = 500;
            errorMsg = 'Server configuration error';
        } else if (error.message.includes('network') || error.message.includes('timeout')) {
            statusCode = 503;
            errorMsg = 'Service temporarily unavailable';
        }
        
        res.status(statusCode).json({ error: errorMsg, details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
