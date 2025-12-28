
import React from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const handleOpenSelectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    onKeySelected();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="mb-6 inline-flex p-4 bg-indigo-100 rounded-full">
          <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">启用 AI 视觉向导</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          我们将使用 <strong>Gemini 3 Pro Image</strong> 为您的愿望拆解生成独有的科学艺术图。
          请选择一个已开通结算（Billing）的 API Key。
        </p>
        <button
          onClick={handleOpenSelectKey}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 mb-4"
        >
          立即选择 API Key
        </button>
        <a
          href="https://ai.google.dev/gemini-api/docs/billing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 text-sm hover:underline"
        >
          查看结算设置指南
        </a>
      </div>
    </div>
  );
};

export default ApiKeySelector;
