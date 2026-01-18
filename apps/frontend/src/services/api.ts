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

interface UploadResponse {
  sessionId: string
  duration: number
}

interface ChatResponse {
  message: string
}

async function uploadVideo(file: File): Promise<UploadResponse> {
  const apiUrl = await getApi()
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${apiUrl}/api/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Upload failed")
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

export { uploadVideo, sendMessage }
export type { UploadResponse, ChatResponse }
