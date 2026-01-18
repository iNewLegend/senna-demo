import OpenAI from "openai"

import type { ChatMessage } from "@video-processing-ai/backend/src/types"

const client = new OpenAI()

async function analyzeVideo(
  frames: string[],
  question: string,
  history: ChatMessage[]
): Promise<string> {
  const imageContents: OpenAI.Chat.Completions.ChatCompletionContentPart[] = frames
    .slice(0, 10)
    .map((dataUrl) => ({
      type: "image_url" as const,
      image_url: {
        url: dataUrl,
        detail: "low" as const,
      },
    }))

  const historyMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are analyzing frames from a video. The frames are in chronological order. Answer questions about what happens in the video based on these frames. You have access to the conversation history to maintain context.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Here are the video frames:" },
          ...imageContents,
        ],
      },
      ...historyMessages,
      {
        role: "user",
        content: question,
      },
    ],
    max_tokens: 500,
  })

  return response.choices[0]?.message?.content ?? "Unable to analyze the video."
}

export { analyzeVideo }
