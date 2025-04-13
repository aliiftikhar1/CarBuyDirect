"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload, ImageIcon } from 'lucide-react'
import Image from "next/image"
import { uploadfiletoserver } from "@/app/Actions"
import { toast } from "sonner"

export function ImageUploadDialog({ files, setFiles, maxFiles = 10 }) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [uploadedImages, setUploadedImages] = useState([])
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)

      if (files.length + selectedFiles.length > maxFiles) {
        toast.error(`You can only upload a maximum of ${maxFiles} images`)
        return
      }

      // Create previews for the selected files
      const newUploadedImages = selectedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploaded: false,
        url: null // Will store the server URL after upload
      }))

      setUploadedImages((prev) => [...prev, ...newUploadedImages])
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)

    if (files.length + droppedFiles.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} images`)
      return
    }

    // Create previews for the dropped files
    const newUploadedImages = droppedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
      url: null
    }))

    setUploadedImages((prev) => [...prev, ...newUploadedImages])
  }

  const removeImage = (index) => {
    setUploadedImages((prev) => {
      const newImages = [...prev]
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const uploadImages = async () => {
    if (uploadedImages.length === 0) {
      toast.error("Please select at least one image to upload")
      return
    }

    setUploading(true)
    const totalImages = uploadedImages.filter(img => !img.uploaded).length
    let uploadedCount = 0

    try {
      const newFiles = [...files]

      for (let i = 0; i < uploadedImages.length; i++) {
        if (uploadedImages[i].uploaded) continue

        // Update progress
        setCurrentProgress(Math.round((uploadedCount / totalImages) * 100))

        // Upload the file and get the URL
        const url = await uploadfiletoserver(uploadedImages[i].file)

        // Mark as uploaded and store the URL
        setUploadedImages((prev) => {
          const updated = [...prev]
          updated[i] = { 
            ...updated[i], 
            uploaded: true,
            url: url
          }
          return updated
        })

        // Add URL to files array (not the file object)
        newFiles.push({
          name: uploadedImages[i].file.name,
          url: url,
          type: uploadedImages[i].file.type,
          size: uploadedImages[i].file.size
        })

        uploadedCount++
      }

      // Update the parent component's files state with URLs
      setFiles(newFiles)

      setCurrentProgress(100)
      toast.success("Images uploaded successfully")

      // Close the dialog after a short delay
      setTimeout(() => {
        setOpen(false)
        // Clear the uploaded images after closing
        setUploadedImages([])
      }, 1000)
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("Failed to upload images")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setOpen(true)}>
          <ImageIcon className="h-4 w-4" />
          Upload Images ({files.length}/{maxFiles})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Vehicle Images</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Drag & drop files or click to browse</p>
            <p className="text-xs text-muted-foreground">Supported formats: JPEG, PNG, GIF, WEBP</p>
            <p className="text-xs font-medium mt-2">
              {uploadedImages.length} selected / {files.length} already uploaded / {maxFiles} maximum
            </p>
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative rounded-md overflow-hidden border">
                    <Image
                      src={image.preview || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover"
                    />
                    {image.uploaded && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <span className="text-xs font-medium text-white bg-green-500 px-2 py-1 rounded">Uploaded</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Uploading...</span>
                <span>{currentProgress}%</span>
              </div>
              <Progress value={currentProgress} className="h-2" />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={uploadImages} disabled={uploading || uploadedImages.length === 0}>
              {uploading ? "Uploading..." : "Upload Images"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}