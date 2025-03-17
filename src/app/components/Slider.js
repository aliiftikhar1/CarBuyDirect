'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
// import { Button } from "@/components/ui/button"

const Carousel = ({ items, autoplayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }, [items.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    const intervalId = setInterval(nextSlide, autoplayInterval)
    return () => clearInterval(intervalId)
  }, [nextSlide, autoplayInterval])

  return (
    <div className='md:px-20 md:py-[60px] pt-12]'>
    <div className="relative w-full md:h-[600px] h-[320px] mt-[0px] overflow-hidden">
      {items.map((item, index) => (
        <div
          key={index}
          className={`absolute md:px-0 px-2 w-full h-full transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={index !== currentIndex}
        >
          <img
            src={item.image}
            alt={`${item.year} ${item.make} ${item.model}`}
            // fill
            className="object-contain md:object-cover w-full h-full"
            // priority={index === 0}
          />
          {/* Gradient Overlay */}
          <div className="absolute hidden md:flex inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          {/* Content */}
          <div className="absolute hidden md:flex md:flex-col bottom-20 left-4 md:left-12 text-white">
            <div className="text-xl md:text-5xl font-bold mb-2">{item.year}</div>
            <div className="text-4xl md:text-7xl font-bold tracking-tight mb-3">{item.make}</div>
            <div className="text-lg md:text-2xl font-light tracking-wider">{item.model}</div>
          </div>

          <div className="absolute px-2 md:hidden w-full bg-white flex flex-col bottom-0 left-0 md:left-12 text-black">
            <div className="text-lg md:text-5xl  font-bold">{item.year}</div>
            <div className="text-2xl md:text-7xl font-bold tracking-tight ">{item.make}</div>
            <div className="text-base md:text-2xl font-light tracking-wider">{item.model}</div>
          </div>

          {/* Preview Button */}
          <a href={item.link}>
          <Button
            variant="secondary"
            className="absolute bottom-4 md:bottom-8 right-8 px-4 md:px-8 py-3 md:py-6 text-sm md:text-lg border font-medium tracking-wider"
          >
            PREVIEW
          </Button>
          </a>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute p-0 bg-black/20 rounded left-0 md:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-12 h-12" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute p-0 bg-black/20 rounded right-0 md:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-12 h-12" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-6 md:w-12 h-1 rounded-sm transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>
    </div>
    </div>
  )
}

export default Carousel

