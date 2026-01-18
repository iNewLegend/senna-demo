async function getApiUrl(): Promise<string> {
  try {
    const response = await fetch("/config")
    const config = await response.json()
    return config.apiUrl
  } catch {
    return "http://localhost:3000"
  }
}

let cachedApiUrl: string | null = null

async function getApi(): Promise<string> {
  if (!cachedApiUrl) {
    cachedApiUrl = await getApiUrl()
  }
  return cachedApiUrl
}

interface SessionResponse {
  sessionId: string
}

interface ChatResponse {
  message: string
}

async function createSession(frames: string[]): Promise<SessionResponse> {
  const apiUrl = await getApi()

  const response = await fetch(`${apiUrl}/api/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ frames }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create session")
  }

  return response.json()
}

async function sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
  const apiUrl = await getApi()

  const response = await fetch(`${apiUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, message }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Chat failed")
  }

  return response.json()
}

export { createSession, sendMessage }
export type { SessionResponse, ChatResponse }
