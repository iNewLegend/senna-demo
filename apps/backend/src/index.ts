import Fastify from "fastify"
import cors from "@fastify/cors"

import { sessionRoutes } from "@video-processing-ai/backend/src/routes/session"
import { chatRoutes } from "@video-processing-ai/backend/src/routes/chat"

const BACKEND_HOST = process.env.BACKEND_HOST ?? "localhost"
const BACKEND_PORT = Number(process.env.BACKEND_PORT ?? 3000)
const FRONTEND_HOST = process.env.FRONTEND_HOST ?? "localhost"
const FRONTEND_PORT = Number(process.env.FRONTEND_PORT ?? 3020)

const fastify = Fastify({
  logger: true,
  bodyLimit: 50 * 1024 * 1024,
})

await fastify.register(cors, {
  origin: [`http://${FRONTEND_HOST}:${FRONTEND_PORT}`],
})

fastify.get("/health", async () => {
  return { status: "ok" }
})

await fastify.register(sessionRoutes)
await fastify.register(chatRoutes)

const start = async () => {
  try {
    await fastify.listen({ port: BACKEND_PORT, host: "0.0.0.0" })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
