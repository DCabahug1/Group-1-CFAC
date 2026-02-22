export interface DetectionResult {
  // Backend response format
  success: boolean;
  sign: string;
  confidence: number;
  landmarks?: string; // Hand landmark coordinates for AI verification
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  speaker: "deaf" | "blind";
}
