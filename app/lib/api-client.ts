import { DetectionResult } from "./types";

export const detectSign = async (imageUri: string): Promise<DetectionResult> => {
  const result = () => {}; // Call Backend API
  
  // return result as DetectionResult;
  return {
    success: true,
    sign: "A",
    confidence: 0.8,
  }
}