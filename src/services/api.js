const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const classifyTicket = async (description, photoBase64) => {
    try {
        const response = await fetch(`${API_URL}/api/classify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, photo: photoBase64 }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        // Fallback or re-throw
        throw error;
    }
};
