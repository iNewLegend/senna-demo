import OpenAI from "openai"

const client = new OpenAI()

async function analyzeVideo(frames: string[], question: string): Promise<string> {
  const imageContents: OpenAI.Chat.Completions.ChatCompletionContentPart[] = frames
    .slice(0, 10)
    .map((dataUrl) => ({
      type: "image_url" as const,
      image_url: {
        url: dataUrl,
        detail: "low" as const,
      },
    }))

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are analyzing frames from a video. The frames are in chronological order. Answer questions about what happens in the video based on these frames.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: question },
          ...imageContents,
        ],
      },
    ],
    max_tokens: 500,
  })

  return response.choices[0]?.message?.content ?? "Unable to analyze the video."
}

export { analyzeVideo }
