import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@senna-demo/frontend/src/components/ui/card"
import { VideoUpload } from "@senna-demo/frontend/src/components/video-upload"
import { VideoPreview } from "@senna-demo/frontend/src/components/video-preview"
import { ChatMessages, type Message } from "@senna-demo/frontend/src/components/chat-messages"
import { ChatInput } from "@senna-demo/frontend/src/components/chat-input"
import { createSession, sendMessage } from "@senna-demo/frontend/src/services/api"
import { processVideo } from "@senna-demo/frontend/src/services/video"

export function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setError(null)
    setIsLoading(true)

    try {
      setStatus("Processing video...")
      const { frames } = await processVideo(file)

      setStatus("Creating session...")
      const response = await createSession(frames)

      setSessionId(response.sessionId)
      setVideoUrl(URL.createObjectURL(file))
      setStatus(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setStatus(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async (content: string) => {
    if (!sessionId) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await sendMessage(sessionId, content)
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.message,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Video</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="text-destructive text-sm mb-4">{error}</p>
            )}
            {videoUrl ? (
              <VideoPreview src={videoUrl} />
            ) : (
              <VideoUpload onUpload={handleUpload} disabled={isLoading} />
            )}
            {isLoading && !videoUrl && status && (
              <p className="text-muted-foreground text-sm mt-2">{status}</p>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[500px]">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <ChatMessages messages={messages} />
          <ChatInput onSend={handleSend} disabled={!sessionId || isLoading} />
        </Card>
      </div>
    </div>
  )
}
