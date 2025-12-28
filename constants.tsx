
import React from 'react';
import { Step } from './types';

export const STEPS: Step[] = [
  {
    id: 1,
    title: "第一步：明确心理动机",
    subtitle: "从感性冲动到理性愿景",
    method: "WOOP法 (Wish, Outcome, Obstacle, Plan)",
    description: "通过预想障碍来增强行动力。不仅仅是幻想成功，更要直面阻力。",
    source: "Gabriele Oettingen《重塑愿望：心理对照的科学》",
    imagePrompt: "A serene minimalist landscape with a mountain peak appearing through fog, representing a clear wish and hidden obstacles, pastel soft aesthetic.",
    color: "from-blue-400 to-indigo-500"
  },
  {
    id: 2,
    title: "第二步：设定量化指标",
    subtitle: "让模糊的目标清晰可见",
    method: "SMART原则",
    description: "目标必须是具体的、可衡量的、可实现的、相关的、有明确时限的。",
    source: "George T. Doran (1981)《There's a S.M.A.R.T. way to write management's goals and objectives》",
    imagePrompt: "A futuristic crystalline bullseye target with a single glowing arrow hitting the center, sharp focus, clean lines, high tech aesthetic.",
    color: "from-indigo-400 to-purple-500"
  },
  {
    id: 3,
    title: "第三步：拆解关键结果",
    subtitle: "定义成功的里程碑",
    method: "OKR法 (Objectives and Key Results)",
    description: "目标是你想成就的事，关键结果是达成目标的衡量标准。",
    source: "Andy Grove & John Doerr《衡量什么，什么就得到执行》",
    imagePrompt: "An elegant fractal tree structure with glowing nodes representing key results branching from a central objective, dark background with neon blue accents.",
    color: "from-purple-400 to-pink-500"
  },
  {
    id: 4,
    title: "第四步：建立原子习惯",
    subtitle: "将大愿望化为每日微小行动",
    method: "原子习惯 / 身份认同驱动",
    description: "不要关注你想要达成什么，而要关注你想成为什么样的人。",
    source: "James Clear《原子习惯》",
    imagePrompt: "Microscopic glowing biological cells evolving into a complex structure, representing tiny daily habits building up, warm amber and gold tones.",
    color: "from-pink-400 to-rose-500"
  },
  {
    id: 5,
    title: "第五步：精力权重分配",
    subtitle: "剔除噪音，聚焦核心",
    method: "艾森豪威尔矩阵 (Eisenhower Matrix)",
    description: "区分‘紧急’与‘重要’。将80%的精力放在重要但不紧急的事上。",
    source: "Dwight D. Eisenhower《高效能人士的七个习惯》引证",
    imagePrompt: "A balanced 3D glass quadrant sculpture floating in space, with different light particles sorted into four areas, minimalist surrealism.",
    color: "from-rose-400 to-orange-500"
  },
  {
    id: 6,
    title: "第六步：深度工作保护",
    subtitle: "为愿望争取高质量时间",
    method: "深度工作 (Deep Work)",
    description: "在无干扰状态下进行职业活动，使认知能力达到极限。",
    source: "Cal Newport《深度工作》",
    imagePrompt: "A person meditating inside a crystalline sphere in a quiet deep sea environment, calm, focused, bioluminescent particles.",
    color: "from-orange-400 to-yellow-500"
  },
  {
    id: 7,
    title: "第七步：闭环反馈系统",
    subtitle: "定期复盘，动态调整",
    method: "反馈环 (Feedback Loops)",
    description: "通过‘行动-观察-分析-修正’的闭环，确保持续处于正确航道。",
    source: "Donald Schön《反思实践者》",
    imagePrompt: "A continuous glowing Mobius strip in space, cycling with cosmic energy, representing the infinite feedback loop, vibrant colors.",
    color: "from-teal-400 to-emerald-500"
  }
];

export const Icons = {
  ArrowDown: () => (
    <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
  ),
  BookOpen: () => (
    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Share: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  Download: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
};
