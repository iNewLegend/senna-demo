interface VideoSession {
  id: string
  videoPath: string
  frames: string[]
}

interface ChatRequest {
  sessionId: string
  message: string
}

interface ChatResponse {
  message: string
}

interface UploadResponse {
  sessionId: string
  duration: number
}

export type { VideoSession, ChatRequest, ChatResponse, UploadResponse }
