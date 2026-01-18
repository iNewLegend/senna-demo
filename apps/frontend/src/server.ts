import index from "../index.html"

const FRONTEND_HOST = process.env.FRONTEND_HOST ?? "localhost"
const FRONTEND_PORT = Number(process.env.FRONTEND_PORT ?? 3020)
const BACKEND_HOST = process.env.BACKEND_HOST ?? "localhost"
const BACKEND_PORT = Number(process.env.BACKEND_PORT ?? 3000)

declare global {
  var API_URL: string
}

globalThis.API_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`

Bun.serve({
  port: FRONTEND_PORT,
  routes: {
    "/": index,
    "/config": () => Response.json({
      apiUrl: `http://${BACKEND_HOST}:${BACKEND_PORT}`,
    }),
  },
  development: {
    hmr: true,
    console: true,
  },
})

console.log(`Frontend running on http://${FRONTEND_HOST}:${FRONTEND_PORT}`)
