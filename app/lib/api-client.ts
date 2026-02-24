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

    // Send to backend - do NOT set Content-Type manually, React Native sets it with boundary
    console.log("Fetching:", `${API_URL}/detect-hand`);
    const apiResponse = await fetch(`${API_URL}/detect-hand`, {
      method: "POST",
      body: formData,
    });
    console.log("Response status:", apiResponse.status);

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
