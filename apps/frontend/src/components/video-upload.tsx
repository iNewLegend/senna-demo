import { useRef } from "react"
import { Upload } from "lucide-react"

import { Button } from "@senna-demo/frontend/src/components/ui/button"

interface VideoUploadProps {
  onUpload: (file: File) => void
  disabled?: boolean
}

export function VideoUpload({ onUpload, disabled }: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg">
      <Upload className="size-12 text-muted-foreground" />
      <p className="text-muted-foreground">Upload a video (max 20 seconds)</p>
      <Button onClick={handleClick} disabled={disabled}>
        Select Video
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
