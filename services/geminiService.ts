
import { GoogleGenAI, Type } from "@google/genai";
import { Step } from "../types";

export async function decomposeGoal(userGoal: string): Promise<Step[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请将用户 2026 年的目标 "${userGoal}" 拆解为 5-8 个极具冲击力的科学执行步骤。
    
    文案风格要求：
    1. 使用“爆款风格”：标题要短促、震撼（如：原子级碾压、神级、极致）。
    2. 执行建议要求：每个步骤提供一段约 30-50 字的“接地气”说明，告诉用户具体该怎么做，要实操、直白、不讲虚话。
    3. 必须包含科学方法论：WOOP, SMART, OKR, 原子习惯, 艾森豪威尔矩阵, 深度工作, 反馈环。
    4. 提供：标题、副标题、方法名、执行说明、科学原文出处。
    5. 为每一步提供一个用于 AI 绘图的英文 Prompt，描述一种电影质感(Cinematic)或高科技(Futuristic)的视觉意象。
    6. 颜色渐变参考： "from-indigo-600 to-purple-800", "from-pink-500 to-rose-700"。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                method: { type: Type.STRING },
                description: { type: Type.STRING, description: "30-50字的落地执行建议" },
                source: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
                color: { type: Type.STRING },
              },
              required: ["id", "title", "subtitle", "method", "description", "source", "imagePrompt", "color"],
            },
          },
        },
        required: ["steps"],
      },
    },
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return data.steps || [];
  } catch (e) {
    throw new Error("AI 智算核心过热，请稍后再试");
  }
}

export async function generateStepImage(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `${prompt}, dark cinematic atmosphere, dramatic lighting, cyberpunk aesthetic, high detail` }],
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Empty image");
  } catch (error: any) {
    return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/300/300?blur=2`;
  }
}
