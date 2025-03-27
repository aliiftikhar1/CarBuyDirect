"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Car, Smartphone, Wrench, BarChart, RotateCw, FileText, Sparkles, Truck, Users } from "lucide-react"

export default function ServicePage() {
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 2,
    minutes: 28,
    seconds: 3,
  })

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        } else {
          clearInterval(timer)
          return prev
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Service cards data with Lucide icons
  const services = [
    {
      id: "car-service",
      title: "Car Service",
      icon: Car,
      tag: "Special Offer",
      tagColor: "bg-red-600",
    },
    {
      id: "mobile-service",
      title: "Mobile Service",
      icon: Smartphone,
      tag: "Frequently Used",
      tagColor: "bg-red-600",
    },
    {
      id: "car-repair",
      title: "Car Repair",
      icon: Wrench,
    },
    {
      id: "car-evaluation",
      title: "Car Evaluation",
      icon: BarChart,
      tag: "New Service",
      tagColor: "bg-red-600",
    },
    {
      id: "car-renewal",
      title: "Car Renewal",
      icon: RotateCw,
    },
    {
      id: "service-contract",
      title: "Service Contract",
      icon: FileText,
      tag: "Top Selling",
      tagColor: "bg-red-600",
    },
    {
      id: "car-detailing",
      title: "Car Detailing",
      icon: Sparkles,
    },
    {
      id: "roadside-assistance",
      title: "Road Assistance",
      icon: Truck,
    },
    {
      id: "courtesy-car",
      title: "Courtesy Car",
      icon: Users,
      tag: "New Service",
      tagColor: "bg-red-600",
    },
  ]

  return (
    <div className="md:px-16 md:py-16 pt-10 ">
      <div className="mx-auto md:px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left section */}
          <div className="lg:w-1/2 flex flex-col items-center space-y-6">
            {/* Customer badge */}
            <div className="relative w-32 h-32 flex items-center justify-center bg-blue-500 rounded-full">
              <div className="bg-black rounded-full w-24 h-24 flex flex-col items-center justify-center text-white">
                <span className="text-2xl font-bold">93K+</span>
                <span className="md:text-xs text-[0.6rem]">CUSTOMERS</span>
              </div>
            </div>

            {/* Book Now heading */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">BOOK NOW</h1>
              <h2 className="text-4xl font-bold text-blue-500">PAY ON DELIVERY</h2>
            </div>

            {/* Pricing info */}
            <div className="text-center">
              <p className="text-xl">
                Major Service 249 USD <span className="line-through">was 499 USD</span>
              </p>
              <div className="border border-dashed border-gray-400 inline-block px-4 py-2 mt-2">
                <p>
                  Use Code <span className="text-blue-500 font-bold">EID2025</span>
                </p>
              </div>
            </div>

            <p className="text-lg">Free car pickup & delivery</p>

            {/* Countdown timer */}
            <div className="flex justify-center space-x-2 md:space-x-4 w-full">
              <div className="bg-black text-white md:p-4 md:w-20 p-2 w-16 text-center">
                <p className="text-3xl font-bold">{timeLeft.days}</p>
                <p className="md:text-xs text-[0.6rem]">DAYS</p>
              </div>
              <div className="text-3xl font-bold self-center">:</div>
              <div className="bg-blue-500 text-white md:p-4 md:w-20 p-2 w-16 text-center">
                <p className="text-3xl font-bold">{timeLeft.hours}</p>
                <p className="md:text-xs text-[0.6rem]">HOURS</p>
              </div>
              <div className="text-3xl font-bold self-center">:</div>
              <div className="bg-blue-500 text-white md:p-4 md:w-20 p-2 w-16 text-center">
                <p className="text-3xl font-bold">{timeLeft.minutes}</p>
                <p className="md:text-xs text-[0.6rem]">MINUTES</p>
              </div>
              <div className="text-3xl font-bold self-center">:</div>
              <div className="bg-blue-500 text-white md:p-4 md:w-20 p-2 w-16 text-center">
                <p className="text-3xl font-bold">{timeLeft.seconds}</p>
                <p className="md:text-xs text-[0.6rem]">SECONDS</p>
              </div>
            </div>

            {/* Book Now button */}
            <button className="bg-blue-500 text-white font-bold py-4 px-12 rounded-full text-xl hover:bg-blue-600 transition-colors">
              BOOK NOW
            </button>
          </div>

          {/* Right section - Service cards */}
          <div className="lg:w-1/2 md:mt-0 mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 md:px-8  px-2">
              {services.map((service) => (
                <Link href={`/Car-Service/${service.id}`} key={service.id} className="block group  hover:scale-[1.1] transition-all duration-500">
                  <div className="card-container ">
                    <div className="bg-blue-500 telative rounded-lg shadow-md px-4 py-8 flex flex-col items-center justify-center h-full relative hover:shadow-lg transition-shadow overflow-hidden shine-effect">
                    <div className="size-5 absolute bg-gradient-to-br from-blue-500 blur-xs  to-red-500 rounded-full -top-5 -left-5 group-hover:top-10 group-hover:left-10 group-hover:scale-[19] transition-all duration-1000 ease-in-out"></div>
                      <div className="mt-2 mb-1 z-10 text-white size-16 rounded-full flex justify-center items-center">
                        <service.icon size={50} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg z-10 font-bold text-white text-center">{service.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for shine effect */}
      <style jsx global>{`
        .shine-effect {
          position: relative;
          overflow: hidden;
        }
        
        .shine-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right, 
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          transition: none;
        }
        
        .shine-effect:hover::before {
          left: 150%;
          transition: all 1s ease;
        }
      `}</style>
    </div>
  )
}

