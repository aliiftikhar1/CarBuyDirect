import Image from "next/image"
import { Check } from "lucide-react"

export default function HeroSection() {
  return (
    <div className="relative min-h-[100vh] md:min-h-[90vh] pt-8">
      <div className="absolute inset-0 bg-gradient-to-br from-[#000B2E] via-[#001166] to-[#0026CC]" />

      <div className="relative mx-auto max-w-6xl px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-3xl font-bold">
                <span className="text-red-500">THE ONLY WHOLESALE</span>
                <br />
                <span className="text-red-500">ONLINE CAR</span>
                <span className="text-white"> AUCTION</span>
                <br />
                <span className="text-white">FOR PUBLIC</span>
              </h1>
              <p className="text-white text-xl md:text-xl mt-4">WHY PAY MORE WHEN CAN YOU BUY DIRECT?</p>
            </div>

            <ul className="space-y-1">
              {[
                "Buy it wholesale, save thousands and drive happy",
                "Insure, Finance and Warranty – all in one place",
                "No Hidden Fee, Ever!",
              ].map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-yellow-400" />
                  </div>
                  <span className="text-white text-lg">{benefit}</span>
                </li>
              ))}
            </ul>

            <button className="bg-[#68C5DB] hover:bg-[#5AB1C7] text-white font-semibold px-12 py-3 rounded-full text-lg transition-colors duration-200">
              JOIN NOW
            </button>
          </div>

          <div className="block">
            <img
              src="/bg/banner_car.png"
              alt="Red Volkswagen Car"
              width={1600}
              height={1400}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* Smooth curve at the bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 220" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,144C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  )
}

