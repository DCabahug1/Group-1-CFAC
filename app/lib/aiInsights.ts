// Generate AI-powered letter recommendations using GPT-4
export const generateLetterRecommendations = async (
  attempts: any[],
): Promise<string> => {
  try {
    if (!attempts || attempts.length === 0) {
      return "Start practicing ASL letters to get personalized recommendations!";
    }

    // Prepare attempt data summary for GPT-4
    const attemptSummary = attempts
      .map(
        (a) =>
          `${a.letter}: ${a.is_correct ? "✓" : "✗"} (attempt ${a.attempt_number})`,
      )
      .join(", ");

    const prompt = `You are an encouraging ASL learning coach. Based on this student's ASL practice attempts, write 1-2 short sentences (max 20 words) suggesting which letters to focus on next.

Practice attempts: ${attemptSummary}

Be specific, encouraging, and actionable. Identify patterns and suggest what to practice.`;

    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API key not found");
      return "Keep practicing! Focus on the letters you find most challenging.";
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful ASL learning coach.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 60,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiTip = data.choices[0]?.message?.content?.trim();

    return aiTip || "Keep up the great work! Practice makes perfect.";
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    return "Keep practicing! Small steps lead to big progress.";
  }
};
