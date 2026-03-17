import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Loader2, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { cn } from '../lib/utils';

export const ImageGenerator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [{ text: `Generate a high-end, luxury product photography of: ${prompt}. Cinematic lighting, charcoal background, neon cyan accents.` }],
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: size
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 w-16 h-16 bg-electric-purple text-white rounded-full flex items-center justify-center neon-glow-purple z-40 hover:scale-110 transition-transform"
        aria-label="Open AI Visualizer"
      >
        <ImageIcon size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-off-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <div className="relative w-full max-w-2xl glass rounded-[40px] overflow-hidden shadow-2xl border border-white/10">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-electric-purple/20 rounded-2xl flex items-center justify-center">
                      <Sparkles className="text-electric-purple" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">AI Visualizer</h2>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Powered by Gemini 3 Pro</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Close AI Visualizer"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Your Vision</label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your dream product setup..."
                      className="w-full bg-off-black border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-electric-purple transition-colors h-32 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Resolution</label>
                      <div className="flex gap-2">
                        {(['1K', '2K', '4K'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => setSize(s)}
                            className={cn(
                              "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
                              size === s ? "bg-electric-purple text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={handleGenerate}
                      disabled={isLoading || !prompt.trim()}
                      className="mt-7 px-8 py-3 bg-white text-off-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                      Generate
                    </button>
                  </div>

                  {generatedImage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative rounded-3xl overflow-hidden aspect-square border border-white/10"
                    >
                      <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                          <a 
                            href={generatedImage} 
                            download="jansen-drops-ai.png"
                            className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
                            aria-label="Download generated image"
                          >
                            <Download size={20} />
                          </a>
                      </div>
                    </motion.div>
                  )}

                  {!generatedImage && !isLoading && (
                    <div className="aspect-square rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-white/20">
                      <ImageIcon size={48} className="mb-4" />
                      <p className="text-sm font-medium">Your creation will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
