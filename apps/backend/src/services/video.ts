import { spawn } from "child_process"
import { mkdir, rm } from "fs/promises"
import { join } from "path"

const FRAMES_DIR = "./tmp/frames"

async function extractFrames(videoPath: string, sessionId: string): Promise<string[]> {
  const outputDir = join(FRAMES_DIR, sessionId)
  await mkdir(outputDir, { recursive: true })

  const outputPattern = join(outputDir, "frame_%03d.jpg")

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i", videoPath,
      "-vf", "fps=1",
      "-q:v", "2",
      outputPattern,
    ])

    ffmpeg.on("close", async (code) => {
      if (code !== 0) {
        reject(new Error(`ffmpeg exited with code ${code}`))
        return
      }

      const frames: string[] = []
      for (let i = 1; i <= 20; i++) {
        const framePath = join(outputDir, `frame_${String(i).padStart(3, "0")}.jpg`)
        const file = Bun.file(framePath)
        if (await file.exists()) {
          frames.push(framePath)
        }
      }

      resolve(frames)
    })

    ffmpeg.on("error", reject)
  })
}

async function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      videoPath,
    ])

    let output = ""
    ffprobe.stdout.on("data", (data) => {
      output += data.toString()
    })

    ffprobe.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ffprobe exited with code ${code}`))
        return
      }
      resolve(parseFloat(output.trim()))
    })

    ffprobe.on("error", reject)
  })
}

async function cleanupSession(sessionId: string): Promise<void> {
  const dir = join(FRAMES_DIR, sessionId)
  await rm(dir, { recursive: true, force: true })
}

export { extractFrames, getVideoDuration, cleanupSession }
