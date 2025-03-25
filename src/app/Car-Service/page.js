"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Car,
  Smartphone,
  Wrench,
  BarChart,
  RotateCw,
  FileText,
  Sparkles,
  Truck,
  Users,
  ArrowRight,
  Star,
  Check,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ServicesSection() {
  // State for animations
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Animation on mount
  useEffect(() => {
    setIsVisible(true)

    // Auto-rotate featured service with transition handling
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true)
        setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % featuredServices.length)
          setTimeout(() => {
            setIsTransitioning(false)
          }, 50)
        }, 500)
      }
    }, 5000) // Increased interval for smoother experience

    return () => clearInterval(interval)
  }, [isTransitioning])

  // Featured services for the showcase with updated colors
  const featuredServices = [
    {
      id: "car-service",
      title: "Premium Car Service",
      description: "Complete maintenance package with genuine parts and expert technicians",
      icon: Car,
      color: "from-red-500 to-red-600",
      textColor: "text-red-600",
      lightColor: "bg-red-50",
      darkColor: "bg-red-100",
      stats: { rating: 4.9, completed: "12,450+" },
    },
    {
      id: "mobile-service",
      title: "Mobile Service",
      description: "Our technicians come to your location for maximum convenience",
      icon: Smartphone,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      lightColor: "bg-blue-50",
      darkColor: "bg-blue-100",
      stats: { rating: 4.8, completed: "8,320+" },
    },
    {
      id: "car-detailing",
      title: "Premium Detailing",
      description: "Restore your vehicle's appearance with our premium detailing service",
      icon: Sparkles,
      color: "from-blue-400 to-blue-500",
      textColor: "text-blue-600",
      lightColor: "bg-blue-50",
      darkColor: "bg-blue-100",
      stats: { rating: 4.9, completed: "5,780+" },
    },
  ]

  // All services with updated colors
  const services = [
    {
      id: "car-service",
      title: "Car Service",
      description: "Complete maintenance package for your vehicle",
      icon: Car,
      tag: "Special Offer",
      tagColor: "bg-gradient-to-r from-red-500 to-red-600",
      popular: true,
      features: ["Oil change", "Filter replacement", "Multi-point inspection"],
    },
    {
      id: "mobile-service",
      title: "Mobile Service",
      description: "We come to your location for convenience",
      icon: Smartphone,
      tag: "Frequently Used",
      tagColor: "bg-gradient-to-r from-blue-500 to-blue-600",
      features: ["No travel needed", "Same quality service", "Flexible scheduling"],
    },
    {
      id: "car-repair",
      title: "Car Repair",
      description: "Expert diagnostics and repair solutions",
      icon: Wrench,
      features: ["Computer diagnostics", "Genuine parts", "Warranty included"],
    },
    {
      id: "car-evaluation",
      title: "Car Evaluation",
      description: "Professional assessment of your vehicle",
      icon: BarChart,
      tag: "New Service",
      tagColor: "bg-gradient-to-r from-blue-400 to-blue-500",
      features: ["Detailed report", "Value estimation", "Condition assessment"],
    },
    {
      id: "car-renewal",
      title: "Car Renewal",
      description: "Hassle-free vehicle registration renewal",
      icon: RotateCw,
      features: ["Document handling", "Fast processing", "Compliance check"],
    },
    {
      id: "service-contract",
      title: "Service Contract",
      description: "Long-term maintenance plans and packages",
      icon: FileText,
      tag: "Top Selling",
      tagColor: "bg-gradient-to-r from-red-400 to-red-500",
      popular: true,
      features: ["Priority scheduling", "Discounted rates", "Comprehensive coverage"],
    },
    {
      id: "car-detailing",
      title: "Car Detailing",
      description: "Premium cleaning and polishing services",
      icon: Sparkles,
      features: ["Interior deep clean", "Paint correction", "Protective coating"],
    },
    {
      id: "roadside-assistance",
      title: "Roadside Assistance",
      description: "24/7 emergency support when you need it",
      icon: Truck,
      features: ["24/7 availability", "Quick response", "Nationwide coverage"],
    },
    {
      id: "courtesy-car",
      title: "Courtesy Car",
      description: "Temporary vehicle while yours is serviced",
      icon: Users,
      tag: "New Service",
      tagColor: "bg-gradient-to-r from-blue-400 to-blue-500",
      features: ["Various models", "Insurance included", "Flexible duration"],
    },
  ]

  // Handle manual featured service change
  const handleFeatureChange = (index) => {
    if (!isTransitioning && index !== activeIndex) {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveIndex(index)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 300)
    }
  }

  return (
    <div className="py-20 relative px-6 md:px-12 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="z-0 absolute w-full h-screen">
      <div className="fixed-blob top-0 left-0 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="fixed-blob top-0 right-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animation-delay-2000"></div>

      </div>
      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Background decorative elements - using fixed positions and reduced number */}
       
        {/* Section header */}
        <div className="text-center mb-16 relative">
          <Badge className="mb-3 px-4 py-1.5 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white border-none">
            Our Premium Services
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-black">
            Exceptional Automotive Solutions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-lg">
            Experience the finest automotive services tailored to your needs with our expert team and state-of-the-art
            facilities
          </p>

          {/* Decorative line */}
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Featured service showcase - optimized for performance */}
        <div className="mb-20 relative">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-3xl transform -skew-y-2 shadow-lg border-2 border-gray-400"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 items-center">
            {/* Featured service image/visual - optimized with will-change */}
            <div className="lg:col-span-1 flex justify-center">
              <div className="relative w-64 h-64">
                {featuredServices.map((service, index) => (
                  <div
                    key={service.id}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out will-change-transform will-change-opacity ${
                      index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                    style={{
                      transform: index === activeIndex ? "scale(1)" : "scale(0.95)",
                      transition: "opacity 500ms ease, transform 500ms ease",
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full p-1 shadow-lg transform rotate-3 hover:rotate-6 transition-transform"
                      style={{
                        background: `linear-gradient(to bottom right, ${
                          index === 0 ? "rgb(239, 68, 68), rgb(220, 38, 38)" : "rgb(59, 130, 246), rgb(37, 99, 235)"
                        })`,
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-6">
                        <service.icon size={100} className={index === 0 ? "text-red-500" : "text-blue-500"} />
                      </div>
                    </div>

                    {/* Floating badges */}
                    <div className="absolute -top-4 -right-4 bg-white text-gray-900 rounded-full px-3 py-1 text-sm font-bold shadow-md">
                      ★ {service.stats.rating}
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 rounded-full px-3 py-1 text-sm font-bold shadow-md">
                      {service.stats.completed} Jobs
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured service info - optimized with static height container */}
            <div className="lg:col-span-2 relative min-h-[300px]">
              {featuredServices.map((service, index) => (
                <div
                  key={service.id}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                  style={{
                    transform: index === activeIndex ? "translateX(0)" : "translateX(20px)",
                    transition: "opacity 500ms ease, transform 500ms ease",
                  }}
                >
                  <h3 className={`text-3xl font-bold mb-3 ${index === 0 ? "text-red-600" : "text-blue-600"}`}>
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">{service.description}</p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge className={`${index === 0 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                      Premium Service
                    </Badge>
                    <Badge className={`${index === 0 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                      Certified Technicians
                    </Badge>
                    <Badge className={`${index === 0 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                      Satisfaction Guaranteed
                    </Badge>
                  </div>
                  <Link
                    href={`/services/${service.id}`}
                    className="inline-flex items-center px-6 py-3 rounded-full text-white font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                    style={{
                      background: `linear-gradient(to right, ${
                        index === 0 ? "rgb(239, 68, 68), rgb(220, 38, 38)" : "rgb(59, 130, 246), rgb(37, 99, 235)"
                      })`,
                    }}
                  >
                    Explore This Service
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              ))}

              {/* Indicator dots */}
              <div className="absolute bottom-0 flex space-x-2">
                {featuredServices.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleFeatureChange(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === activeIndex ? "bg-gray-800 scale-125" : "bg-gray-300 opacity-50"
                    }`}
                    aria-label={`View featured service ${index + 1}`}
                    disabled={isTransitioning}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* All services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              href={`/services/${service.id}`}
              key={service.id}
              className={`block transform transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${Math.min(index * 50, 500)}ms` }} // Cap the delay to avoid too much staggering
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-full backdrop-blur-sm bg-white/70 rounded-xl  shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                {/* Shine effect on hover - optimized */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"
                  style={{ willChange: "transform, opacity" }}
                ></div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 to-transparent"></div>

                {/* Tag */}
                {service.tag && (
                  <div
                    className={`absolute -top-3 right-4 ${service.tagColor} text-white text-xs font-medium py-1 px-3 rounded-full shadow-md z-10`}
                  >
                    {service.tag}
                  </div>
                )}

                {/* Popular badge */}
                {service.popular && (
                  <div className="absolute top-0 left-4 bg-red-500 text-white text-xs font-medium py-1 px-3 rounded-full shadow-md z-10 flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-white" /> Popular Choice
                  </div>
                )}

                <div className="p-8 relative z-10 h-full flex flex-col">
                  {/* Icon with animated background - optimized */}
                  <div className="relative mb-6">
                    <div
                      className={`absolute inset-0 rounded-full transition-all duration-300 bg-gradient-to-r from-red-100 to-blue-100 ${
                        hoveredCard === service.id ? "scale-110 opacity-100" : "scale-100 opacity-70"
                      }`}
                      style={{ willChange: "transform, opacity" }}
                    ></div>
                    <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
                      <service.icon
                        size={32}
                        className={`transition-transform duration-300 ${
                          hoveredCard === service.id ? "scale-110" : "scale-100"
                        } ${(service.tag && service.tag.includes("Special")) || service.popular ? "text-red-500" : "text-blue-500"}`}
                        style={{ willChange: "transform" }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3
                    className={`text-xl font-bold mb-3 transition-colors ${
                      (service.tag && service.tag.includes("Special")) || service.popular
                        ? "text-gray-900 group-hover:text-red-600"
                        : "text-gray-900 group-hover:text-blue-600"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>

                  {/* Features list */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <Check
                          className={`h-4 w-4 mr-2 flex-shrink-0 ${
                            (service.tag && service.tag.includes("Special")) || service.popular
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Learn more link with animation */}
                  <div className="mt-auto">
                    <span
                      className={`inline-flex items-center font-medium transition-colors ${
                        (service.tag && service.tag.includes("Special")) || service.popular
                          ? "text-red-600 group-hover:text-red-700"
                          : "text-blue-600 group-hover:text-blue-700"
                      }`}
                    >
                      Explore Service
                      <ArrowRight
                        className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                          hoveredCard === service.id ? "translate-x-1" : ""
                        }`}
                        style={{ willChange: "transform" }}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center relative">
          <div className="inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 rounded-full blur-xl opacity-30"></div>
              <Link
                href="/services"
                className="relative inline-flex items-center px-8 py-4 rounded-full bg-black text-white font-bold text-lg shadow-xl hover:shadow-lg transition-all hover:-translate-y-1"
              >
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation styles - optimized */}
      <style jsx>{`
        .fixed-blob {
          position: absolute;
          pointer-events: none;
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.1); }
        }
        
        .fixed-blob {
          animation: blob 15s infinite alternate ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}

