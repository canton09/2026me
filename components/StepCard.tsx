
import React, { useState, useEffect } from 'react';
import { Step } from '../types';
import { generateStepImage } from '../services/geminiService';
import { Icons } from '../constants';

interface StepCardProps {
  step: Step;
  onResetKey: () => void;
}

const StepCard: React.FC<StepCardProps> = ({ step, onResetKey }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        const url = await generateStepImage(step.imagePrompt);
        setImageUrl(url);
      } catch (err: any) {
        if (err.message === "KEY_RESET_REQUIRED") onResetKey();
      } finally {
        setLoading(false);
      }
    };
    loadImage();
  }, [step.imagePrompt, onResetKey]);

  return (
    <div className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="glass-panel p-5 rounded-3xl border border-white/5 transition-all hover:bg-white/5 hover:border-indigo-500/40 flex items-start gap-5 sm:gap-8 relative overflow-hidden">
        
        {/* Step Badge Background Effect */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${step.color} opacity-5 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
        
        {/* Micro Image Section (1/4 Size) */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
           <div className={`absolute -inset-1 bg-gradient-to-br ${step.color} rounded-2xl blur-md opacity-20 group-hover:opacity-50 transition-opacity`}></div>
           <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                   <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <img src={imageUrl!} alt={step.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
              )}
           </div>
           {/* Step Number Tag */}
           <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-lg font-black shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/20 z-10 transform rotate-3 group-hover:rotate-0 transition-transform`}>
             {step.id}
           </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 py-1">
           <div className="flex items-center gap-3 mb-3">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black text-white bg-gradient-to-r ${step.color} uppercase tracking-[0.15em] shadow-lg`}>
                {step.method}
              </span>
           </div>

           <h2 className="text-xl sm:text-3xl font-black text-white mb-3 tracking-tighter">
             第{step.id}步：{step.title}
           </h2>
           
           {/* 接地气的执行建议 */}
           <div className="relative mb-5">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent rounded-full"></div>
              <p className="pl-4 text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
                <span className="text-indigo-400 font-black mr-1 underline decoration-indigo-500/30 underline-offset-4">实战建议：</span>
                {step.description}
              </p>
           </div>

           <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-white/50 transition-colors">
              <Icons.BookOpen />
              <span className="truncate italic">Source: {step.source}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
