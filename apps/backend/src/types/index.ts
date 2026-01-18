interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface Session {
  id: string
  frames: string[]
  history: ChatMessage[]
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

export type { ChatMessage, Session, SessionRequest, SessionResponse, ChatRequest, ChatResponse }
