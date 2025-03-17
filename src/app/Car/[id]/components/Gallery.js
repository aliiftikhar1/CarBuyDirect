"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Gallery({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = useMemo(() => {
    const filteredImages = data?.CarSubmission?.SubmissionImages?.filter((item) => item.label !== "portrait") || []

    // Sort the images to put "horizontal" labeled images first
    return filteredImages.sort((a, b) => {
      if (a.label === "horizontal") return -1
      if (b.label === "horizontal") return 1
      return 0
    })
  }, [data])

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <div className="px-20 flex max-h-[80vh] w-full gap-4">
      <div className="w-3/4 relative" id="big-image-section">
        <Image
         src={images[currentIndex]?.data  || "/placeholder.svg"}
         width={1200}
         height={1200}
         className="w-full h-full object-contain"
        />
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="w-1/4 grid grid-cols-2 grid-rows-4 overflow-hidden gap-2">
        {images.slice(currentIndex + 1, currentIndex + 9).map((image, index) => (
          <div key={index} className="aspect-square w-full h-full relative">
            <Image
             src={image.data  || "/placeholder.svg"}
             width={1200}
             height={1200}
             className="w-full h-full object-cover"
            />
            {/* {index === 7 && (
              <div className="flex text-white font-bold justify-center items-center absolute top-0 z-20 w-full h-full bg-black/50">
                All Media {images.length}
              </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  )
}

