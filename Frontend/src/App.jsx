import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// This is the main App component for the AI-Powered Design Studio.
const App = () => {
  // State for the user's prompt.
  const [prompt, setPrompt] = useState('');

  // State to store the URL of the generated image.
  const [imageUrl, setImageUrl] = useState('');

  // State to handle the loading status during image generation.
  const [isLoading, setIsLoading] = useState(false);

  // State to handle any errors that occur during the API call.
  const [error, setError] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Function to handle the form submission and trigger image generation.
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a descriptive prompt to generate art.');
      return;
    }
    setError('');
    setIsLoading(true);
    setImageUrl('');

    try {
      const response = await fetch('http://localhost:5000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate image. Please try again.');
      }
      const data = await response.json();
if (data.image_base64) {
  setImageUrl(`data:image/png;base64,${data.image_base64}`);
} else if (data.imageUrl) {
  setImageUrl(data.imageUrl);
} else {
  throw new Error(data.error || "Failed to generate image.");
}

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An unexpected error occurred. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          AI-Powered <span className="text-purple-400">Design Studio</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Unleash your creativity. Describe your vision, and watch AI bring it to life.(Text to Image)
        </p>
      </motion.div>

      <motion.div
        className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <textarea
            className="flex-1 p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors placeholder-gray-500 resize-none"
            rows="3"
            placeholder="A serene forest with glowing mushrooms, digital art, 4k resolution..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="md:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Generate Art'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              className="text-red-400 text-center mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {error}
            </motion.div>
          )}

          {imageUrl && (
            <motion.div
              key="image"
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={imageUrl}
                alt="AI Generated Art"
                className="rounded-xl shadow-2xl border-2 border-gray-700 max-h-[500px] w-auto object-contain"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/1e293b/d1d5db?text=Image+Load+Error"; }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default App;
