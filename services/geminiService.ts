
import { GoogleGenAI, Type } from "@google/genai";
import { Step } from "../types";

export async function decomposeGoal(userGoal: string): Promise<Step[]> {
  // 每次调用时重新实例化以确保获取最新 API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `请将用户 2026 年的目标 "${userGoal}" 拆解为 5-8 个极具冲击力的科学执行步骤。
    
    文案风格要求：
    1. 大标题要震撼（如：原子级重构、神经元链接、神级闭环）。
    2. 副标题要精准。
    3. 每个步骤必须包含：标题、副标题、核心方法名、执行说明、科学原文出处。
    4. 执行说明：约 30-50 字，必须是实操性极强的落地建议。
    5. 科学出处：必须提及具体作者及书籍或论文名称。
    6. 绘图 Prompt：提供一个用于 AI 绘图的英文 Prompt，风格定位：Cinematic, High-tech, 3D render, dark aesthetic.`,
    config: {
      thinkingConfig: { thinkingBudget: 4000 },
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
                description: { type: Type.STRING },
                source: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
                color: { type: Type.STRING, description: "如: from-blue-600 to-indigo-900" },
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
    throw new Error("AI 智算核心解析失败，请检查网络或重试");
  }
}

export async function generateStepImage(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `${prompt}, dramatic lighting, 8k resolution, glowing elements, tech noir aesthetic` }],
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data");
  } catch (error: any) {
    console.error("Image generation error:", error);
    return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/400/400`;
  }
}
