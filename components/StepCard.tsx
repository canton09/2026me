
import React, { useState, useEffect } from 'react';
import { Step } from '../types';
import { generateStepImage } from '../services/geminiService';
import { Icons } from '../constants';

interface StepCardProps {
  step: Step;
  onResetKey: () => void;
}

const StepCard: React.FC<StepCardProps> = ({ step }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        const url = await generateStepImage(step.imagePrompt);
        setImageUrl(url);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadImage();
  }, [step.imagePrompt]);

  return (
    <div className="relative group animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="glass-panel p-6 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/40 transition-all overflow-hidden bg-black/40">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Image Container */}
          <div className="relative w-full md:w-48 h-48 flex-shrink-0">
             <div className={`absolute -inset-2 bg-gradient-to-br ${step.color} rounded-[2rem] blur-xl opacity-10 group-hover:opacity-30 transition-opacity`}></div>
             <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                     <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <img src={imageUrl!} alt={step.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                )}
             </div>
             <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-xl font-black shadow-2xl border border-white/20 transform -rotate-6`}>
               {step.id}
             </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
             <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black text-white bg-gradient-to-r ${step.color} uppercase tracking-widest`}>
                  {step.method}
                </span>
             </div>

             <h3 className="text-3xl font-black text-white mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">
               {step.title}
             </h3>
             <p className="text-indigo-400 font-bold mb-4 text-sm tracking-wide">{step.subtitle}</p>
             
             <div className="relative mb-6">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/10 rounded-full"></div>
                <p className="pl-6 text-gray-300 leading-relaxed font-medium italic">
                  “{step.description}”
                </p>
             </div>

             <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                <Icons.BookOpen />
                <span className="truncate">Source: {step.source}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
