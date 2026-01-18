interface VideoInfo {
  duration: number
  frames: string[]
}

async function loadVideo(file: File): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.preload = "auto"
    video.muted = true
    video.playsInline = true

    video.onloadeddata = () => {
      resolve(video)
    }

    video.onerror = () => {
      reject(new Error("Failed to load video"))
    }

    video.src = URL.createObjectURL(file)
    video.load()
  })
}

async function extractFrameAtTime(video: HTMLVideoElement, time: number): Promise<string> {
  return new Promise((resolve) => {
    const captureFrame = () => {
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      }

      const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
      resolve(dataUrl)
    }

    if (Math.abs(video.currentTime - time) < 0.1) {
      captureFrame()
    } else {
      video.onseeked = captureFrame
      video.currentTime = time
    }
  })
}

async function processVideo(file: File): Promise<VideoInfo> {
  const video = await loadVideo(file)
  const duration = video.duration

  if (duration > 20) {
    throw new Error("Video must be 20 seconds or less")
  }

  const frames: string[] = []
  const frameCount = Math.min(Math.ceil(duration), 10)
  const interval = duration / frameCount

  for (let i = 0; i < frameCount; i++) {
    const time = i * interval
    const frame = await extractFrameAtTime(video, time)
    frames.push(frame)
  }

  URL.revokeObjectURL(video.src)

  return { duration, frames }
}

export { processVideo }
export type { VideoInfo }
