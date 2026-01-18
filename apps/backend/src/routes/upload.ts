import type { FastifyInstance } from "fastify"
import { randomUUID } from "crypto"
import { mkdir, writeFile } from "fs/promises"
import { join } from "path"

import { extractFrames, getVideoDuration } from "@senna-demo/backend/src/services/video"
import type { UploadResponse, VideoSession } from "@senna-demo/backend/src/types"

const UPLOADS_DIR = "./tmp/uploads"
const sessions = new Map<string, VideoSession>()

async function uploadRoutes(fastify: FastifyInstance) {
  await mkdir(UPLOADS_DIR, { recursive: true })

  fastify.post<{ Reply: UploadResponse }>("/api/upload", async (request, reply) => {
    const data = await request.file()

    if (!data) {
      return reply.status(400).send({ error: "No file uploaded" } as never)
    }

    const sessionId = randomUUID()
    const videoPath = join(UPLOADS_DIR, `${sessionId}.mp4`)

    const buffer = await data.toBuffer()
    await writeFile(videoPath, buffer)

    const duration = await getVideoDuration(videoPath)

    if (duration > 20) {
      return reply.status(400).send({ error: "Video must be 20 seconds or less" } as never)
    }

    const frames = await extractFrames(videoPath, sessionId)

    sessions.set(sessionId, {
      id: sessionId,
      videoPath,
      frames,
    })

    return { sessionId, duration }
  })
}

function getSession(sessionId: string): VideoSession | undefined {
  return sessions.get(sessionId)
}

export { uploadRoutes, getSession }
