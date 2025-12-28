
export interface Step {
  id: number;
  title: string;
  subtitle: string;
  method: string;
  description: string;
  source: string;
  sourceUrl?: string;
  imagePrompt: string;
  color: string;
}

export interface ApiResponse {
  imageUrl?: string;
  text?: string;
  loading: boolean;
  error?: string;
}
