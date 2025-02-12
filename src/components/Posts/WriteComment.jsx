"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  IconUser,
  IconPhoto,
  IconVideo,
  IconX,
  IconPlayerPlay,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function WriteComment({ onSubmit, onCancel }) {
  const [content, setContent] = useState("")
  const [media, setMedia] = useState(null)
  const [mediaType, setMediaType] = useState(null) // 'photo' or 'video'
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const fileInputRef = useRef(null)

  const handleMediaSelect = (type) => {
    setMediaType(type)
    fileInputRef.current.accept = type === 'photo' ? 'image/*' : 'video/*'
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setMedia({
        url: reader.result,
        type: mediaType,
        file
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!content.trim() || !media) return
    onSubmit({ content, media })
    setContent("")
    setMedia(null)
    setMediaType(null)
  }

  const handleCancel = () => {
    setContent("")
    setMedia(null)
    setMediaType(null)
    onCancel?.()
  }

  return (
    <div className="space-y-4 p-4 rounded-lg border bg-background">
      {/* User Info */}
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <IconUser className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <textarea
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[100px] p-3 rounded-md bg-secondary/50 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Media Selection */}
      <div className="flex items-center gap-4">
        {!media ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleMediaSelect('photo')}
            >
              <IconPhoto className="w-4 h-4" />
              Add Photo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleMediaSelect('video')}
            >
              <IconVideo className="w-4 h-4" />
              Add Video
            </Button>
          </div>
        ) : (
          <div className="relative group">
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {mediaType === 'photo' ? (
                    <>
                      <IconPhoto className="w-4 h-4" />
                      View Photo
                    </>
                  ) : (
                    <>
                      <IconVideo className="w-4 h-4" />
                      View Video
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                {mediaType === 'photo' ? (
                  <img
                    src={media.url}
                    alt="Selected photo"
                    className="w-full rounded-lg"
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    className="w-full rounded-lg"
                  />
                )}
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-10 top-0"
              onClick={() => {
                setMedia(null)
                setMediaType(null)
              }}
            >
              <IconX className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || !media}
        >
          Comment
        </Button>
      </div>
    </div>
  )
} 