
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './constants';
import { Step } from './types';
import StepCard from './components/StepCard';
import { decomposeGoal } from './services/geminiService';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const DAILY_LIMIT = 2;

const THINKING_MESSAGES = [
  "⚡ 正在建立神经元链接...",
  "🧠 正在调用 2026 全球趋势模型...",
  "🧬 注入原子级自律协议...",
  "🚀 构建跨维度执行蓝图...",
  "✨ 正在重塑你的潜意识边界...",
  "🔮 演习 2026 年度执行障碍..."
];

const NeuralAnimation = () => (
  <svg className="w-64 h-64 md:w-80 md:h-80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow-fx" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.5" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <linearGradient id="energy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    
    <circle cx="100" cy="100" r="85" stroke="url(#energy-grad)" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.3" className="animate-[spin_20s_linear_infinite]" />
    <circle cx="100" cy="100" r="60" stroke="#6366f1" strokeWidth="1" strokeDasharray="100 100" opacity="0.1" className="animate-[spin_10s_linear_infinite_reverse]" />

    <g filter="url(#glow-fx)">
      {[...Array(10)].map((_, i) => {
        const angle = (i * Math.PI * 2) / 10;
        const x = 100 + Math.cos(angle) * 70;
        const y = 100 + Math.sin(angle) * 70;
        return (
          <g key={i}>
            <line x1="100" y1="100" x2={x} y2={y} stroke="#6366f1" strokeWidth="0.5" opacity="0.4">
              <animate attributeName="stroke-dasharray" values="0,150;150,0" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
            </line>
            <circle cx={x} cy={y} r="3" fill="#ec4899">
              <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
            </circle>
            <circle r="2" fill="#fff">
              <animateMotion path={`M100 100 L${x} ${y}`} dur="1.5s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
              <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
      <circle cx="100" cy="100" r="15" fill="url(#energy-grad)" className="animate-pulse" />
    </g>
  </svg>
);

const App: React.FC = () => {
  const [userGoal, setUserGoal] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [remainingUses, setRemainingUses] = useState(DAILY_LIMIT);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const data = localStorage.getItem('v2026_usage');
    if (data) {
      const { date, count } = JSON.parse(data);
      if (date === today) {
        setRemainingUses(Math.max(0, DAILY_LIMIT - count));
      } else {
        localStorage.setItem('v2026_usage', JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      localStorage.setItem('v2026_usage', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  useEffect(() => {
    if (isDecomposing) {
      const interval = setInterval(() => {
        setThinkingIndex((prev) => (prev + 1) % THINKING_MESSAGES.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isDecomposing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGoal.trim() || remainingUses <= 0 || isDecomposing) return;

    setIsDecomposing(true);
    setError(null);
    setSteps([]);

    try {
      const result = await decomposeGoal(userGoal);
      setSteps(result);
      
      const today = new Date().toISOString().split('T')[0];
      const data = JSON.parse(localStorage.getItem('v2026_usage') || '{}');
      const newCount = (data.count || 0) + 1;
      localStorage.setItem('v2026_usage', JSON.stringify({ date: today, count: newCount }));
      setRemainingUses(DAILY_LIMIT - newCount);
      
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 500);
    } catch (err: any) {
      setError(err.message || '连接失败，请重试');
    } finally {
      setIsDecomposing(false);
    }
  };

  const downloadPDF = async () => {
    if (!resultsRef.current) return;
    const canvas = await html2canvas(resultsRef.current, { scale: 2, backgroundColor: '#050505' });
    const imgData = canvas.toDataURL('image/jpeg', 0.8);
    const pdf = new jsPDF('p', 'pt', [595, (canvas.height * 595) / canvas.width]);
    pdf.addImage(imgData, 'JPEG', 0, 0, 595, (canvas.height * 595) / canvas.width);
    pdf.save(`2026-Vision-${userGoal.substring(0, 5)}.pdf`);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className={`flex flex-col items-center justify-center transition-all duration-1000 ${steps.length > 0 ? 'py-12' : 'min-h-[90vh]'} px-4 text-center`}>
        <div className="mb-6 px-4 py-1 rounded-full border border-indigo-500/30 glass-panel animate-pulse">
          <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase">Neural Vision System 3.0</span>
        </div>
        
        <h1 className={`font-black transition-all duration-1000 ${steps.length > 0 ? 'text-5xl mb-8' : 'text-8xl md:text-[14rem] mb-12'} leading-[0.8] tracking-tighter text-white`}>
          2026 <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-glow">极致计划</span>
        </h1>

        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="glass-panel p-2 rounded-[3rem] border border-white/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)] focus-within:border-indigo-500/50 transition-all">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={userGoal}
                  onChange={(e) => setUserGoal(e.target.value)}
                  placeholder={remainingUses > 0 ? "输入你足以重塑一生的野心..." : "今日 2 次拆解额度已耗尽"}
                  disabled={remainingUses <= 0 || isDecomposing}
                  className="flex-1 px-8 py-5 rounded-[2rem] bg-white/5 border-none text-white text-xl outline-none placeholder:text-gray-600 font-bold disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!userGoal.trim() || remainingUses <= 0 || isDecomposing}
                  className="px-10 py-5 bg-indigo-600 text-white font-black text-xl rounded-[2rem] hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-30"
                >
                  {isDecomposing ? "智算中..." : "启动拆解"}
                </button>
              </div>
            </div>
            {error && <p className="mt-4 text-pink-500 font-bold animate-bounce">{error}</p>}
            <p className="mt-4 text-gray-500 text-xs font-black tracking-widest uppercase">
              今日剩余次数: <span className="text-indigo-400">{remainingUses}</span> / {DAILY_LIMIT}
            </p>
          </form>
        </div>
      </header>

      {/* Thinking State */}
      {isDecomposing && (
        <div className="flex flex-col items-center py-20 animate-in fade-in duration-1000">
          <NeuralAnimation />
          <div className="mt-8 text-3xl font-black text-white italic tracking-tighter">
            {THINKING_MESSAGES[thinkingIndex]}
          </div>
          <div className="mt-4 flex gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === thinkingIndex ? 'w-10 bg-indigo-500' : 'w-2 bg-white/10'}`} />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {steps.length > 0 && (
        <main ref={resultsRef} className="max-w-4xl mx-auto px-4 py-12 space-y-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white/40 uppercase tracking-[0.3em]">Blueprint for {userGoal}</h2>
            <div className="h-1 w-24 bg-indigo-500 mx-auto mt-4 rounded-full" />
          </div>
          
          {steps.map((step) => (
            <StepCard key={step.id} step={step} onResetKey={() => {}} />
          ))}

          <div className="pt-12 flex justify-center">
             <button onClick={downloadPDF} className="glass-panel px-12 py-6 rounded-3xl border border-white/20 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all font-black text-white flex items-center gap-4 group">
                <Icons.Download />
                <span>导出全套 2026 演化指南 (PDF)</span>
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
             </button>
          </div>
        </main>
      )}

      <footer className="mt-24 py-12 text-center opacity-20 border-t border-white/5">
        <p className="text-[10px] font-black tracking-[1em] text-white uppercase">Vision 2026 AI Neural Network</p>
      </footer>
    </div>
  );
};

export default App;
