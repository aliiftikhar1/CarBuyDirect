"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const slides = [
  {
    title: "Buy - at Wholesale Price",
    description: "We work with dozens of wholesalers in NYC and NJ to get you deals EVERY TIME.",
    image: "/banners/Senna banner.jpg",
    buttonText: "SIGN UP",
  },
  {
    title: "Service - When You Need It",
    description: "24/7 support with certified mechanics across the tri-state area.",
    image: "/banners/581A6472-Banner.jpg",
    buttonText: "LEARN MORE",
  },
  {
    title: "Sell - At The Best Price",
    description: "Get the best value for your car with our network of buyers.",
    image: "/banners/Shelby banner.jpg",
    buttonText: "GET QUOTE",
  },
]

export default function CarCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[30vh] md:h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-xl md:text-6xl font-bold text-white mb-6">{slide.title}</h1>
            <p className="text-sm md:text-2xl text-white mb-8 max-w-xs md:max-w-3xl">{slide.description}</p>
            <Button className="bg-cyan-400 hover:bg-cyan-500 text-gray-800 px-4 md:px-8 py-3 md:py-6 text-sm md:text-lg font-semibold">
              {slide.buttonText}
            </Button>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

