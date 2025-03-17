"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const contentData = {
  SERVICE: {
    title: "Service - at Wholesale rate",
    description:
      "We have partnered with multiple Mechanic shops and details shops so you can manage your car without breaking your bank.",
    image: "/sections/section (1).png",
  },
  TRANSPORT: {
    title: "Transport - Convenient & Safe",
    description: "Door-to-door car transport service with real-time tracking and insurance coverage for peace of mind.",
    image: "/sections/section (2).png",
  },
  WARRANTY: {
    title: "Warranty - Complete Protection",
    description:
      "Comprehensive warranty coverage for your vehicle with flexible plans and nationwide service network support.",
    image: "/sections/section (3).png",
  },
}

export default function CarServiceSection() {
  const [activeContent, setActiveContent] = useState("SERVICE")

  const handleContentChange = (type) => {
    setActiveContent(type)
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-600 to-violet-600 px-4 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 max-w-3xl mx-auto leading-tight">
            Everything you need to make your car ownership hassle free
          </h1>

          <div className="flex flex-wrap justify-center gap-4">
            {["SERVICE", "TRANSPORT", "WARRANTY"].map((type) => (
              <Button
                key={type}
                onClick={() => handleContentChange(type)}
                className={`min-w-[120px] ${
                  activeContent === type
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "text-white border-white hover:bg-white/10"
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mt-16">
          <div className="relative">
            <div className="absolute -right-1/4 top-1/4 w-full h-full bg-red-600 transform -rotate-12 -z-10" />

            <div className="relative z-10 transition-opacity duration-300">
              <img
                src={contentData[activeContent].image || "/placeholder.svg"}
                alt={`${activeContent.toLowerCase()} interface`}
                width={500}
                height={900}
                className="w-full max-w-md mx-auto"
              />
            </div>
          </div>

          <div className="text-white transition-opacity duration-300">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{contentData[activeContent].title}</h2>
            <p className="text-lg mb-8">{contentData[activeContent].description}</p>
            <Button className="bg-cyan-400 hover:bg-cyan-500 text-gray-800 font-semibold px-8 py-2">LEARN MORE!</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

