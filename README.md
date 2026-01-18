# Senna Demo

A simple video analysis chat demo where users can upload a short video and ask questions about it using AI.

## Key Technical Decisions

### Browser-Based Video Processing (No FFmpeg)

We chose to process videos in the browser using native Web APIs instead of relying on FFmpeg binaries:

**Why not FFmpeg?**
- External binary dependency requires system-level installation
- Not portable across different OS/environments
- Complicates deployment and CI/CD pipelines
- Makes the monorepo not self-contained

**Our approach:**
- Use `HTMLVideoElement` for video loading and duration validation
- Use `Canvas API` for frame extraction
- Send base64-encoded frames directly to backend
- Zero external dependencies - works anywhere JavaScript runs

**Trade-offs:**
- Browser must support video codec (most modern browsers do)
- Processing happens client-side (acceptable for short videos up to 20s)
- Larger payload size (base64 frames vs video file)

### Architecture

```
Frontend (React + Tailwind)     Backend (Fastify)
       │                              │
       │ 1. Load video                │
       │ 2. Validate duration         │
       │ 3. Extract frames (canvas)   │
       │                              │
       │──── POST /api/session ──────>│ 4. Store frames in memory
       │<─── sessionId ───────────────│
       │                              │
       │──── POST /api/chat ─────────>│ 5. Send frames to OpenAI
       │<─── AI response ─────────────│ 6. Return analysis
```

## Running Locally

### Prerequisites
- [Bun](https://bun.sh) v1.0+
- OpenAI API key

### Setup

1. Clone and install:
   ```bash
   git clone <repo>
   cd senna-demo
   bun install
   ```

2. Configure environment:
   ```bash
   cp .env-sample .env
   # Edit .env and add your OPENAI_API_KEY
   ```

3. Start both servers:
   ```bash
   bun run backend:dev   # Terminal 1 - runs on :3000
   bun run frontend:dev  # Terminal 2 - runs on :3020
   ```

4. Open http://localhost:3020

### Usage
1. Upload a video (max 20 seconds)
2. Wait for processing
3. Ask questions about the video in the chat

## Project Structure

```
senna-demo/
├── apps/
│   ├── frontend/          # React + Tailwind + shadcn
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   ├── services/    # API and video processing
│   │   │   └── app.tsx      # Main app
│   │   └── index.html
│   └── backend/           # Fastify API
│       └── src/
│           ├── routes/      # API endpoints
│           ├── services/    # OpenAI integration
│           └── types/       # TypeScript types
├── .env-sample            # Environment template
└── package.json           # Monorepo scripts
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | (required) |
| `BACKEND_HOST` | Backend host | localhost |
| `BACKEND_PORT` | Backend port | 3000 |
| `FRONTEND_HOST` | Frontend host | localhost |
| `FRONTEND_PORT` | Frontend port | 3020 |
