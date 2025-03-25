"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Car, Smartphone, Wrench, BarChart, RotateCw, FileText, Sparkles, Truck, Users } from "lucide-react"

export default function ServiceDetails() {
  const router = useRouter()
  const { serviceId } = useParams()

  // Map service IDs to Lucide icons
  const serviceIcons = {
    "car-service": Car,
    "mobile-service": Smartphone,
    "car-repair": Wrench,
    "car-evaluation": BarChart,
    "car-renewal": RotateCw,
    "service-contract": FileText,
    "car-detailing": Sparkles,
    "roadside-assistance": Truck,
    "courtesy-car": Users,
  }

  // Service details data - in a real app, you would fetch this from an API
  const serviceDetails = {
    "car-service": {
      title: "Car Service",
      description:
        "Our comprehensive car service includes oil change, filter replacement, brake inspection, and a thorough check of all essential systems to keep your vehicle running smoothly.",
      price: "249 AED",
      originalPrice: "499 AED",
      features: [
        "Complete engine diagnostics",
        "Oil and filter change",
        "Brake system inspection",
        "Air conditioning check",
        "Fluid levels top-up",
        "Battery health check",
      ],
    },
    "mobile-service": {
      title: "Mobile Service",
      description:
        "Our mobile service brings professional car maintenance to your doorstep. Save time and enjoy the convenience of having your car serviced at your home or office.",
      price: "299 AED",
      originalPrice: "549 AED",
      features: [
        "Service at your location",
        "No extra transportation costs",
        "Same quality as workshop service",
        "Flexible scheduling",
        "Professional technicians",
        "All necessary equipment included",
      ],
    },
    "car-repair": {
      title: "Car Repair",
      description:
        "Our expert technicians can diagnose and fix any issues with your vehicle, from minor repairs to major overhauls.",
      price: "Varies",
      features: [
        "Engine repairs",
        "Transmission service",
        "Electrical system repairs",
        "Suspension and steering",
        "Exhaust system repairs",
        "Cooling system service",
      ],
    },
    "car-evaluation": {
      title: "Car Evaluation",
      description:
        "Get a comprehensive evaluation of your vehicle's condition and value with our detailed inspection service.",
      price: "149 AED",
      features: [
        "Complete vehicle inspection",
        "Market value assessment",
        "Detailed condition report",
        "Maintenance recommendations",
        "Future value projection",
        "Digital report delivery",
      ],
    },
    "car-renewal": {
      title: "Car Renewal",
      description:
        "We handle all the paperwork and inspections needed to renew your vehicle registration quickly and efficiently.",
      price: "199 AED",
      features: [
        "Registration renewal processing",
        "Required inspections",
        "Document preparation",
        "Fast turnaround time",
        "Delivery of new registration",
        "SMS notifications",
      ],
    },
    "service-contract": {
      title: "Service Contract",
      description:
        "Our service contracts provide peace of mind with regular maintenance and priority service for your vehicle.",
      price: "From 999 AED/year",
      features: [
        "Regular scheduled maintenance",
        "Priority booking",
        "Discounted repair services",
        "Free roadside assistance",
        "Transferable contract",
        "Inflation-proof pricing",
      ],
    },
    "car-detailing": {
      title: "Car Detailing",
      description:
        "Our premium detailing service will restore your car's appearance to showroom condition, inside and out.",
      price: "349 AED",
      features: [
        "Exterior hand wash and wax",
        "Interior deep cleaning",
        "Leather conditioning",
        "Engine bay cleaning",
        "Paint protection",
        "Odor elimination",
      ],
    },
    "roadside-assistance": {
      title: "Roadside Assistance",
      description:
        "Our 24/7 roadside assistance ensures you're never stranded with prompt help for breakdowns, flat tires, and more.",
      price: "99 AED/month",
      features: [
        "24/7 emergency response",
        "Battery jump-start service",
        "Flat tire assistance",
        "Fuel delivery",
        "Lockout service",
        "Towing service",
      ],
    },
    "courtesy-car": {
      title: "Courtesy Car",
      description: "Keep moving with our courtesy car service while your vehicle is being serviced or repaired.",
      price: "99 AED/day",
      features: [
        "Well-maintained vehicles",
        "Flexible pickup and return",
        "Insurance included",
        "Fuel policy options",
        "Various vehicle classes",
        "Seamless handover process",
      ],
    },
  }

  const service = serviceDetails[serviceId]
  const ServiceIcon = serviceIcons[serviceId]

  if (!service || !ServiceIcon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Green line at the top */}
      <div className="h-1 bg-green-500 w-full"></div>

      <div className="container mx-auto px-4 py-8">
        <button onClick={() => router.push("/")} className="mb-6 flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2" size={16} />
          Back to services
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Service icon and title */}
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="bg-gray-100 p-8 rounded-full mb-4 text-green-500">
                  <ServiceIcon size={100} strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-bold text-center mb-4">{service.title}</h1>

                <div className="text-center mb-6">
                  <p className="text-2xl font-bold text-green-500">{service.price}</p>
                  {service.originalPrice && <p className="text-gray-500 line-through">{service.originalPrice}</p>}
                </div>

                <button className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 transition-colors w-full md:w-auto">
                  BOOK NOW
                </button>
              </div>

              {/* Service details */}
              <div className="md:w-2/3">
                <h2 className="text-xl font-semibold mb-4">Service Description</h2>
                <p className="text-gray-700 mb-6">{service.description}</p>

                <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="text-green-500 mr-2">✓</div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                  <p className="font-medium">Need more information?</p>
                  <p className="text-gray-600">
                    Contact our customer service at <span className="text-green-500">800-CAR-SERVICE</span> or email us
                    at <span className="text-green-500">info@carservice.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

