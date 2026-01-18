import OpenAI from "openai"
import { readFileSync } from "fs"

const client = new OpenAI()

async function analyzeVideo(frames: string[], question: string): Promise<string> {
  const imageContents: OpenAI.Chat.Completions.ChatCompletionContentPart[] = frames
    .slice(0, 10)
    .map((framePath) => {
      const base64 = readFileSync(framePath).toString("base64")
      return {
        type: "image_url" as const,
        image_url: {
          url: `data:image/jpeg;base64,${base64}`,
          detail: "low" as const,
        },
      }
    })

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are analyzing frames from a video. The frames are in chronological order, extracted at 1 frame per second. Answer questions about what happens in the video based on these frames.",
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
