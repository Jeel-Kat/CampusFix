import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

const quotes = [
  "Good things come to those who refresh — almost there!",
  "One small wait for you, one giant leap for campus fixes.",
  "Re-routing the complaints to their proper place — hang tight!",
  "Loading insights... great admin things take a moment.",
  "Collecting campus vibes and analytics — almost done!",
];

const FullPageLoader = ({ className = '' }) => {
  const [quote, setQuote] = useState('Loading...');

  useEffect(() => {
    // Pick a random quote on mount
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 p-4 ${className}`}>
      <div className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <Loader className="animate-spin text-red-600" size={36} />
        </div>
        <p className="text-sm text-gray-600 mb-2">{quote}</p>
        <p className="text-xs text-gray-400">This may take a few seconds.</p>
      </div>
    </div>
  );
};

export default FullPageLoader;
