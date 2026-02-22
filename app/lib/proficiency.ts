import { supabase } from "../../lib/supabase";

interface AttemptData {
  userId: number;
  moduleId: number;
  letter: string;
  isCorrect: boolean;
  detectedLetter: string;
  attemptNumber: number;
}

// Send attempt to Supabase database
export const sendAttemptToDB = async ({
  userId,
  moduleId,
  letter,
  isCorrect,
  detectedLetter,
  attemptNumber,
}: AttemptData): Promise<boolean> => {
  try {
    const { error } = await supabase.from("letter_attempts").insert({
      user_id: userId,
      module_id: moduleId,
      letter: letter,
      is_correct: isCorrect,
      attempt_number: attemptNumber,
    });

    if (error) {
      console.error("Error inserting attempt:", error);
      return false;
    }

    console.log("Attempt logged successfully:", {
      userId,
      moduleId,
      letter,
      isCorrect,
    });
    return true;
  } catch (error) {
    console.error("Failed to send attempt to DB:", error);
    return false;
  }
};

// Fetch all attempts for a user
export const fetchUserAttempts = async (userId: number) => {
  try {
    const { data, error } = await supabase
      .from("letter_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching attempts:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Failed to fetch attempts:", error);
    return { data: null, error };
  }
};

interface InsightsData {
  vocabularyPercentage: number;
  vocabularyCount: number;
  avgAccuracy: number;
  totalTries: number;
}

// Calculate insights from attempts data
export const calculateInsights = (attempts: any[]): InsightsData => {
  if (!attempts || attempts.length === 0) {
    console.log("No attempts data to calculate");
    return {
      vocabularyPercentage: 0,
      vocabularyCount: 0,
      avgAccuracy: 0,
      totalTries: 0,
    };
  }

  // Get unique letters attempted
  const uniqueLetters = new Set(attempts.map((a) => a.letter));
  const vocabularyCount = uniqueLetters.size;
  const vocabularyPercentage = Math.round((vocabularyCount / 26) * 100);

  console.log("Unique letters:", Array.from(uniqueLetters));
  console.log(
    "Vocabulary count:",
    vocabularyCount,
    "Percentage:",
    vocabularyPercentage,
  );

  // Calculate accuracy (only count first attempts for each letter)
  const firstAttempts = attempts.filter((a) => a.attempt_number === 1);
  const correctFirstAttempts = firstAttempts.filter((a) => a.is_correct).length;
  const avgAccuracy =
    firstAttempts.length > 0
      ? Math.round((correctFirstAttempts / firstAttempts.length) * 100)
      : 0;

  // Total tries
  const totalTries = attempts.length;

  return {
    vocabularyPercentage,
    vocabularyCount,
    avgAccuracy,
    totalTries,
  };
};
