import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@video-processing-ai/frontend/src/components/ui/card"
import { VideoUpload } from "@video-processing-ai/frontend/src/components/video-upload"
import { VideoPreview } from "@video-processing-ai/frontend/src/components/video-preview"
import { ChatMessages, type Message } from "@video-processing-ai/frontend/src/components/chat-messages"
import { ChatInput } from "@video-processing-ai/frontend/src/components/chat-input"
import { createSession, sendMessage } from "@video-processing-ai/frontend/src/services/api"
import { processVideo } from "@video-processing-ai/frontend/src/services/video"

export function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setError(null)
    setIsUploading(true)

    try {
      setStatus("Processing video...")
      const { frames } = await processVideo(file)

      setStatus("Creating session...")
      const response = await createSession(frames)

      setSessionId(response.sessionId)
      setVideoUrl(URL.createObjectURL(file))
      setStatus(null)

      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "The video is uploaded. You can now ask questions about it.",
      }
      setMessages([welcomeMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setStatus(null)
    } finally {
      setIsUploading(false)
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
    setIsChatLoading(true)

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
      setIsChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
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
              <VideoUpload onUpload={handleUpload} disabled={isUploading} />
            )}
            {isUploading && status && (
              <p className="text-muted-foreground text-sm mt-2">{status}</p>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col min-h-[400px]">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <ChatMessages messages={messages} isLoading={isChatLoading} />
          <ChatInput onSend={handleSend} disabled={!sessionId || isChatLoading} />
        </Card>
      </div>
    </div>
  )
}
