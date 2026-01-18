interface VideoPreviewProps {
  src: string
}

export function VideoPreview({ src }: VideoPreviewProps) {
  return (
    <div className="rounded-lg overflow-hidden">
      <video
        src={src}
        controls
        className="w-full max-h-64 object-contain bg-black"
      />
    </div>
  )
}
