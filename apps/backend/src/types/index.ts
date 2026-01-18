interface Session {
  id: string
  frames: string[]
}

interface SessionRequest {
  frames: string[]
}

interface SessionResponse {
  sessionId: string
}

interface ChatRequest {
  sessionId: string
  message: string
}

interface ChatResponse {
  message: string
}

export type { Session, SessionRequest, SessionResponse, ChatRequest, ChatResponse }
