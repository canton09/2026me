
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './constants';
import { Step } from './types';
import StepCard from './components/StepCard';
import ApiKeySelector from './components/ApiKeySelector';
import { decomposeGoal } from './services/geminiService';
// @ts-ignore
import { jsPDF } from 'jspdf';
// @ts-ignore
import html2canvas from 'html2canvas';

const DAILY_LIMIT = 2;

const THINKING_MESSAGES = [
  "🔥 正在注入顶级自律逻辑...",
  "⚡ 正在计算 2026 最优演化路径...",
  "💎 深度挖掘科学方法论底层资产...",
  "🚀 正在构建你的‘开挂’剧本...",
  "🧬 基因级重塑你的每日行动力...",
  "🔮 正在预演执行障碍并生成反制对策...",
  "✨ 正在将平庸目标转化为神级里程碑...",
  "📡 同步全球顶尖效率专家实战模型...",
  "🧠 神经元网络正在模拟 2026 年底的成功场景..."
];

const LOG_MESSAGES = [
  "[SYSTEM] 初始化愿景解析内核...",
  "[ANALYSIS] 提取用户意图关键词...",
  "[MATH] 正在计算路径复杂度...",
  "[DATABASE] 匹配 WOOP 心理对照模型...",
  "[AI] 正在生成原子级行动指令...",
  "[LOG] 过滤 2026 年度潜在噪音...",
  "[STREAMS] 注入 1080p 视觉引导提示词...",
  "[SUCCESS] 正在封装神级拆解报告..."
];

const NeuralNetworkSVG = () => (
  <svg className="w-48 h-48 md:w-64 md:h-64 opacity-80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="40" stroke="#6366f1" strokeWidth="0.5" className="animate-pulse" />
    <circle cx="100" cy="100" r="60" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="4 4" className="animate-[spin_10s_linear_infinite]" />
    <circle cx="100" cy="100" r="80" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="10 5" className="animate-[spin_20s_linear_infinite_reverse]" />
    
    <g className="nodes">
      {[...Array(8)].map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        const x = 100 + Math.cos(angle) * 70;
        const y = 100 + Math.sin(angle) * 70;
        return (
          <circle key={i} cx={x} cy={y} r="3" fill="#6366f1">
            <animate attributeName="r" values="3;5;3" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.2;1" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </g>

    <path d="M100 100 L135 35 M100 100 L165 100 M100 100 L135 165 M100 100 L65 165 M100 100 L35 100 M100 100 L65 35" stroke="#6366f1" strokeWidth="0.5" opacity="0.3">
      <animate attributeName="stroke-dasharray" values="0,200;200,0" dur="3s" repeatCount="indefinite" />
    </path>
  </svg>
);

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [userGoal, setUserGoal] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [remainingUses, setRemainingUses] = useState(DAILY_LIMIT);
  const [downloading, setDownloading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
    
    const today = new Date().toISOString().split('T')[0];
    const usageData = localStorage.getItem('usage_stats_2026_pro_v3');
    
    if (usageData) {
      const { date, count } = JSON.parse(usageData);
      if (date === today) {
        setRemainingUses(Math.max(0, DAILY_LIMIT - count));
      } else {
        localStorage.setItem('usage_stats_2026_pro_v3', JSON.stringify({ date: today, count: 0 }));
        setRemainingUses(DAILY_LIMIT);
      }
    } else {
      localStorage.setItem('usage_stats_2026_pro_v3', JSON.stringify({ date: today, count: 0 }));
      setRemainingUses(DAILY_LIMIT);
    }
  }, []);

  useEffect(() => {
    let msgInterval: number;
    let logInterval: number;
    if (isDecomposing) {
      msgInterval = window.setInterval(() => {
        setThinkingIndex((prev) => (prev + 1) % THINKING_MESSAGES.length);
      }, 2000);
      logInterval = window.setInterval(() => {
        setLogIndex((prev) => (prev + 1) % LOG_MESSAGES.length);
      }, 800);
    }
    return () => {
      clearInterval(msgInterval);
      clearInterval(logInterval);
    };
  }, [isDecomposing]);

  const handleKeySelected = () => setHasKey(true);
  const handleResetKey = () => setHasKey(false);

  const updateUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const usageData = JSON.parse(localStorage.getItem('usage_stats_2026_pro_v3') || '{}');
    const newCount = (usageData.count || 0) + 1;
    localStorage.setItem('usage_stats_2026_pro_v3', JSON.stringify({ date: today, count: newCount }));
    setRemainingUses(DAILY_LIMIT - newCount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGoal.trim() || remainingUses <= 0) return;

    setIsDecomposing(true);
    setError(null);
    setSteps([]);
    setThinkingIndex(0);
    setLogIndex(0);

    try {
      const result = await decomposeGoal(userGoal);
      setSteps(result);
      updateUsage();
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch (err: any) {
      setError(err.message || '系统负载过高，请重试');
    } finally {
      setIsDecomposing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resultsRef.current || downloading) return;
    setDownloading(true);
    
    try {
      const element = resultsRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#050505',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const pdfWidth = 595.28;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      pdf.save(`2026极致重塑计划_${userGoal.substring(0, 8)}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('PDF 生成失败，请确保所有图片已加载完毕。');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col pb-32">
      {!hasKey && <ApiKeySelector onKeySelected={handleKeySelected} />}

      {/* Hero Section */}
      <header className={`relative flex flex-col items-center justify-center transition-all duration-700 ${steps.length > 0 ? 'py-8' : 'min-h-[80vh] py-20'} px-4 text-center z-10`}>
        <div className="mb-8 flex items-center gap-2 px-6 py-2 rounded-full glass-panel border border-indigo-500/40 animate-pulse">
          <Icons.Sparkles />
          <span className="text-xs font-black tracking-[0.4em] text-indigo-300 uppercase">Vision Engine Pro 2026</span>
        </div>

        <h1 className={`hero-title font-black transition-all duration-700 ${steps.length > 0 ? 'text-4xl mb-6' : 'text-8xl md:text-[12rem] mb-12'} text-white leading-[0.85] tracking-tighter`}>
          2026 <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-glow inline-block py-2">极致重塑</span>
        </h1>

        <p className={`${steps.length > 0 ? 'hidden' : 'block'} max-w-2xl mx-auto text-gray-400 text-xl md:text-2xl font-medium mb-16 leading-relaxed opacity-80`}>
          凡夫俗子看愿望，顶级强者看拆解。<br/>
          注入<span className="text-white font-bold">科学演算法</span>，让 2026 成为你人生的“降维打击”之年。
        </p>

        {/* Input Form */}
        <div className="w-full max-w-2xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex flex-col sm:flex-row gap-3 p-3 glass-panel rounded-[2.5rem] border border-white/10 shadow-[0_0_70px_-10px_rgba(99,102,241,0.6)] focus-within:border-indigo-500/60 transition-all">
              <input
                type="text"
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                placeholder={remainingUses > 0 ? "写下你足以重塑一生的野心..." : "今日 2 次神级拆解额度已用完"}
                className="flex-1 px-8 py-5 rounded-3xl bg-white/5 border-none text-white text-xl outline-none placeholder:text-gray-600 font-bold"
                disabled={isDecomposing || remainingUses <= 0}
              />
              <button
                type="submit"
                disabled={isDecomposing || !userGoal.trim() || remainingUses <= 0}
                className="px-12 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white font-black text-xl rounded-3xl shadow-2xl hover:shadow-indigo-500/40 active:scale-95 transition-all disabled:grayscale disabled:opacity-50"
              >
                {isDecomposing ? '智算中...' : '启动拆解'}
              </button>
            </div>
            {error && <p className="mt-4 text-pink-500 text-sm font-black animate-bounce">{error}</p>}
          </form>
          <div className="mt-6 flex justify-between px-6 opacity-40">
             <span className="text-[12px] font-black tracking-widest uppercase">System: Neural Core v3.1</span>
             <span className="text-[12px] font-black tracking-widest text-indigo-400">今日余量: {remainingUses}/{DAILY_LIMIT}</span>
          </div>
        </div>
      </header>

      {/* Result Section & Thinking State */}
      <main ref={resultsRef} id="results-container" className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12">
        {isDecomposing && (
          <div className="flex flex-col items-center py-20 space-y-12 animate-in fade-in relative overflow-hidden">
             {/* 核心 SVG 动画 */}
             <div className="relative flex items-center justify-center">
                <NeuralNetworkSVG />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center animate-pulse">
                      <Icons.Sparkles />
                   </div>
                </div>
             </div>

             <div className="w-full max-w-md space-y-8 text-center">
                <div className="h-12 flex items-center justify-center overflow-hidden">
                   <p key={thinkingIndex} className="text-3xl font-black text-white italic tracking-tight animate-in slide-in-from-bottom-8 duration-700">
                      {THINKING_MESSAGES[thinkingIndex]}
                   </p>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/50 text-left font-mono overflow-hidden h-32 shadow-inner">
                   <div className="space-y-2">
                      <p className="text-xs text-indigo-300 font-bold animate-pulse">
                        {LOG_MESSAGES[logIndex]}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {LOG_MESSAGES[(logIndex + 1) % LOG_MESSAGES.length]}
                      </p>
                      <p className="text-[10px] text-gray-800 leading-tight italic">
                        &gt; Optimizing success probability vectors...
                      </p>
                      <p className="text-[10px] text-gray-800 leading-tight italic">
                        &gt; Injecting atomic habit protocols...
                      </p>
                   </div>
                </div>

                <div className="flex justify-center gap-3">
                   {THINKING_MESSAGES.map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-700 ${i === thinkingIndex ? 'w-12 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'w-2 bg-white/10'}`}></div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {steps.length > 0 && (
          <div className="space-y-6">
            <div className="text-center mb-16 px-4">
               <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">{userGoal}</h2>
               <div className="flex items-center justify-center gap-4 text-xs font-black tracking-[0.5em] text-indigo-500 uppercase opacity-60">
                  <div className="h-px w-12 bg-indigo-500/30"></div>
                  Blueprint Generated
                  <div className="h-px w-12 bg-indigo-500/30"></div>
               </div>
            </div>
            {steps.map((step) => (
              <StepCard key={step.id} step={step} onResetKey={handleResetKey} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Bar - Download PDF */}
      {steps.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
          <div className="glass-panel p-3 rounded-[3rem] shadow-[0_0_120px_-10px_rgba(99,102,241,1)] border border-white/30">
            <button 
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="w-full py-6 bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-900 text-white font-black text-lg rounded-[2.5rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
            >
              {downloading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Icons.Download />
              )}
              {downloading ? '核心指令封装中...' : '立即下载神级 PDF 计划'}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine" />
            </button>
          </div>
        </div>
      )}

      <footer className="py-24 text-center opacity-30">
         <p className="text-xs font-black tracking-[0.8em] uppercase">Vision 2026 AI Neural Intelligence Network</p>
      </footer>
    </div>
  );
};

export default App;
