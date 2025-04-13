"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Eye } from 'lucide-react'

export function ImageGallery({ files, setFiles }) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)

  const handleRemoveImage = (index) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const openPreview = (index) => {
    setPreviewIndex(index)
    setPreviewOpen(true)
  }

  const getImagePreview = (file) => {
    return file
  }

  if (files.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Uploaded Images ({files.length})</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {files.map((file, index) => (
          <div key={index} className="relative group aspect-square border rounded-md overflow-hidden">
            <Image
              src={file.url || "/placeholder.svg"}
              alt={`Vehicle image ${index + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <div className="h-8 w-8 bg-white flex justify-center items-center rounded cursor-pointer" onClick={() => openPreview(index)}>
                <Eye className="h-4 w-4" />
              </div>
              <div className="h-8 w-8 bg-red-500 text-white flex justify-center items-center rounded cursor-pointer" onClick={() => handleRemoveImage(index)}>
                <Trash2 className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <div className="relative aspect-video w-full">
            {files[previewIndex] && (
              <Image
                src={files[previewIndex].url || "/placeholder.svg"}
                alt={`Vehicle image preview`}
                fill
                className="object-contain"
              />
            )}
          </div>
          <div className="p-4 flex justify-between">
            <div className=" bg-white flex justify-center items-center rounded cursor-pointer"
              onClick={() => setPreviewIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1))}
              disabled={files.length <= 1}
            >
              Previous
            </div>
            <span className="flex items-center">
              {previewIndex + 1} of {files.length}
            </span>
            <div className="h-8 w-8 bg-white flex justify-center items-center rounded cursor-pointer"
              onClick={() => setPreviewIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0))}
              disabled={files.length <= 1}
            >
              Next
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
