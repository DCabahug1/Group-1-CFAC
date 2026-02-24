import { supabase } from "../../lib/supabase";

// Generate AI-powered letter recommendations via Supabase Edge Function
export const generateLetterRecommendations = async (
  attempts: any[],
): Promise<string> => {
  try {
    if (!attempts || attempts.length === 0) {
      return "Start practicing ASL letters to get personalized recommendations!";
    }

    const { data, error } = await supabase.functions.invoke("ai-insights", {
      body: { attempts },
    });

    if (error) {
      console.error("Edge function error:", error);
      return "Keep practicing! Focus on the letters you find most challenging.";
    }

    return data?.insight || "Keep up the great work! Practice makes perfect.";
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    return "Keep practicing! Small steps lead to big progress.";
  }
};
