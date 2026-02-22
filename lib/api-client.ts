import { supabase } from "../lib/supabase";
import { DetectionResult } from "./types";

// Use your machine's IP address instead of localhost for React Native
// Get this from the Expo Metro output (exp://YOUR_IP:8081)
const API_URL = "http://10.41.163.49:8000";

export const detectSign = async (
  imageUri: string,
): Promise<DetectionResult> => {
  try {
    // Create form data with the image
    const formData = new FormData();

    // For React Native, we need to append the file with proper metadata
    // @ts-ignore - React Native FormData accepts this format
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "hand.jpg",
    });

    // Send to backend
    const apiResponse = await fetch(`${API_URL}/detect-hand`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`API request failed: ${apiResponse.status}`);
    }

    const result: DetectionResult = await apiResponse.json();
    return result;
  } catch (error) {
    console.error("Error detecting sign:", error);
    return {
      success: false,
      sign: "",
      confidence: 0,
    };
  }
};

interface AIVerificationResult {
  success: boolean;
  letter?: string;
  confidence?: number;
  agreed_with_model?: boolean;
  error?: string;
}

export const verifyWithAI = async (
  imageUri: string,
  landmarks: string,
  predictedLetter: string,
): Promise<AIVerificationResult> => {
  try {
    // Convert image to base64
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        resolve(base64data.split(",")[1]);
      };
      reader.readAsDataURL(blob);
    });

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("verify-asl", {
      body: {
        image_base64: base64,
        landmarks: landmarks,
        predicted_letter: predictedLetter,
      },
    });

    if (error) {
      console.error("Edge function error:", error);
      return { success: false, error: error.message };
    }

    return data as AIVerificationResult;
  } catch (error) {
    console.error("Error verifying with AI:", error);
    return { success: false, error: String(error) };
  }
};
