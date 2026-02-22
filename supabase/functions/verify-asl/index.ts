import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  image_base64: string;
  landmarks: string;
  predicted_letter: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { image_base64, landmarks, predicted_letter }: VerifyRequest =
      await req.json();

    console.log(`Verifying ASL sign - Model predicted: ${predicted_letter}`);

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    // Call OpenAI Vision API
    const prompt = `You are an expert in American Sign Language (ASL). Analyze this image of a hand sign.

Our computer vision model detected: Letter ${predicted_letter}
Hand landmark positions: ${landmarks}

Your task: Identify which ASL letter (A-Z) is being signed in this image.

Respond ONLY with a single letter (A-Z). Be confident and specific.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${image_base64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 10,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const aiLetter = data.choices[0]?.message?.content?.trim().toUpperCase();

    console.log(`OpenAI verification result: ${aiLetter}`);

    // Extract just the letter
    let finalLetter = "";
    if (aiLetter && aiLetter.length === 1 && /[A-Z]/.test(aiLetter)) {
      finalLetter = aiLetter;
    } else {
      // Try to extract first letter
      for (const char of aiLetter || "") {
        if (/[A-Z]/.test(char)) {
          finalLetter = char;
          break;
        }
      }
    }

    if (!finalLetter) {
      throw new Error(`Invalid response from OpenAI: ${aiLetter}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        letter: finalLetter,
        confidence: 0.95,
        agreed_with_model: finalLetter === predicted_letter,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in verify-asl function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
