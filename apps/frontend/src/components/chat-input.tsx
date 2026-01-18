import { useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@senna-demo/frontend/src/components/ui/button"
import { Input } from "@senna-demo/frontend/src/components/ui/input"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (value.trim()) {
      onSend(value.trim())
      setValue("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about the video..."
        disabled={disabled}
      />
      <Button type="submit" size="icon" disabled={disabled || !value.trim()}>
        <Send />
      </Button>
    </form>
  )
}
