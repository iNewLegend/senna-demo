import type { FastifyInstance } from "fastify"
import { randomUUID } from "crypto"

import type { Session, SessionRequest, SessionResponse } from "@senna-demo/backend/src/types"

const sessions = new Map<string, Session>()

async function sessionRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: SessionRequest; Reply: SessionResponse }>("/api/session", async (request, reply) => {
    const { frames } = request.body

    if (!frames || frames.length === 0) {
      return reply.status(400).send({ error: "No frames provided" } as never)
    }

    if (frames.length > 10) {
      return reply.status(400).send({ error: "Video exceeds 20 second limit (max 10 frames at 1fps)" } as never)
    }

    const sessionId = randomUUID()

    sessions.set(sessionId, {
      id: sessionId,
      frames,
    })

    return { sessionId }
  })
}

function getSession(sessionId: string): Session | undefined {
  return sessions.get(sessionId)
}

export { sessionRoutes, getSession }
