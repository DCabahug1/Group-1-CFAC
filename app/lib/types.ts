export interface DetectionResult {
  // Backend response format
  success: boolean;
  sign: string;
  confidence: number;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  speaker: "deaf" | "blind";
}
