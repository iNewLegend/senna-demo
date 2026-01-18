import type { FastifyInstance } from "fastify"

import { analyzeVideo } from "@senna-demo/backend/src/services/openai"
import { getSession } from "@senna-demo/backend/src/routes/upload"
import type { ChatRequest, ChatResponse } from "@senna-demo/backend/src/types"

async function chatRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: ChatRequest; Reply: ChatResponse }>("/api/chat", async (request, reply) => {
    const { sessionId, message } = request.body

    const session = getSession(sessionId)

    if (!session) {
      return reply.status(404).send({ error: "Session not found" } as never)
    }

    const response = await analyzeVideo(session.frames, message)

    return { message: response }
  })
}

export { chatRoutes }
