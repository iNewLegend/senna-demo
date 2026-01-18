import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@senna-demo/frontend/src/components/ui/card"
import { VideoUpload } from "@senna-demo/frontend/src/components/video-upload"
import { VideoPreview } from "@senna-demo/frontend/src/components/video-preview"
import { ChatMessages, type Message } from "@senna-demo/frontend/src/components/chat-messages"
import { ChatInput } from "@senna-demo/frontend/src/components/chat-input"

export function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
  }

  const handleSend = (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    }
    setMessages((prev) => [...prev, userMessage])
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Video</CardTitle>
          </CardHeader>
          <CardContent>
            {videoUrl ? (
              <VideoPreview src={videoUrl} />
            ) : (
              <VideoUpload onUpload={handleUpload} />
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[500px]">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <ChatMessages messages={messages} />
          <ChatInput onSend={handleSend} disabled={!videoUrl} />
        </Card>
      </div>
    </div>
  )
}
