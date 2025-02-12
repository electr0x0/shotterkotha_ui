"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconBrain, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AIImageDescription({ imageUrl, description, isUpload = false, onDescriptionGenerated }) {
  const [aiDescription, setAiDescription] = useState(description || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const getDescription = async () => {
    if (aiDescription) {
      setIsOpen(true)
      return
    }

    setLoading(true)
    setError(null)
    try {
      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newDescription = "AI generated description for the uploaded image..."
      setAiDescription(newDescription)
      if (onDescriptionGenerated) {
        onDescriptionGenerated(newDescription)
      }
      setIsOpen(true)
    } catch (err) {
      setError("Failed to generate description")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {isUpload ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={getDescription}
          disabled={loading}
        >
          <IconBrain className="h-4 w-4" />
          {loading ? "Generating..." : "Generate AI Description"}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-accent"
          onClick={getDescription}
        >
          <IconBrain className="h-4 w-4" />
        </Button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "absolute z-50 mt-2 p-4 rounded-lg border bg-card shadow-lg",
              isUpload ? "w-full" : "right-0 w-80"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <IconBrain className="h-4 w-4 text-primary" />
                <span className="font-medium">AI Description</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              >
                <IconX className="h-3 w-3" />
              </Button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
              </div>
            ) : error ? (
              <div className="text-sm text-destructive">{error}</div>
            ) : aiDescription ? (
              <p className="text-sm text-muted-foreground">{aiDescription}</p>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 