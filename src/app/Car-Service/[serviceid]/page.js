"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Car, Smartphone, Wrench, BarChart, RotateCw, FileText, Sparkles, Truck, Users } from "lucide-react"

export default function ServiceDetails() {
  const router = useRouter()
  const { serviceid } = useParams()
  const [formData, setFormData] = useState({
    carCategory: "",
    carType: "",
    buildYear: "",
    carBrand: "",
    carModel: "",
    location: "",
    serviceDate: "",
    serviceTime: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission - in a real app, you would send this data to your backend
    console.log("Form submitted:", formData)
    alert("Booking request submitted successfully!")
  }

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
      price: "249 USD",
      originalPrice: "499 USD",
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
      price: "299 USD",
      originalPrice: "549 USD",
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
      price: "149 USD",
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
      price: "199 USD",
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
      price: "From 999 USD/year",
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
      price: "349 USD",
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
      price: "99 USD/month",
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
      price: "99 USD/day",
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

  const service = serviceDetails[serviceid]
  const ServiceIcon = serviceIcons[serviceid]

  if (!service || !ServiceIcon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to services
          </button>
        </div>
      </div>
    )
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen py-10 md:px-16">
      <div className=" mx-auto md:px-4 md:py-8">
        <div className="bg-white rounded-lg  overflow-hidden">
          <div className="p-6 md:p-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* LEFT SIDE: Service Details */}
              <div className="lg:w-1/2">
                <div className="flex flex-col items-center mb-6">
                  <div className="bg-gray-100 p-6 rounded-full mb-4 text-blue-500">
                    <ServiceIcon size={80} strokeWidth={1.5} />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">{service.title}</h1>

                  <div className="text-center mb-6">
                    <p className="text-2xl font-bold text-blue-500">{service.price}</p>
                    {service.originalPrice && <p className="text-gray-500 line-through">{service.originalPrice}</p>}
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-4">Service Description</h2>
                <p className="text-gray-700 mb-6">{service.description}</p>

                <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="text-blue-500 mr-2">✓</div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="font-medium">Need more information?</p>
                  <p className="text-gray-600">
                    Contact our customer service at <span className="text-blue-500">800-CAR-SERVICE</span> or email us
                    at <span className="text-blue-500">info@carbuydirect.com</span>
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE: Booking Form */}
              <div className="lg:w-1/2 lg:border-l lg:pl-8 md:scale-[0.9]  ">
                <h2 className="text-2xl font-bold mb-3 text-center">Book Your Service</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Vehicle Information */}
                  <div className="space-y-2">
                    <div className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="carCategory" className="block text-sm font-medium text-gray-700 mb-1">
                            Car Category
                          </label>
                          <select
                            id="carCategory"
                            name="carCategory"
                            value={formData.carCategory || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select car category</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="hatchback">Hatchback</option>
                            <option value="truck">Truck</option>
                            <option value="van">Van</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="carType" className="block text-sm font-medium text-gray-700 mb-1">
                            Car Type
                          </label>
                          <select
                            id="carType"
                            name="carType"
                            value={formData.carType || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Car Type</option>
                            <option value="economy">Economy</option>
                            <option value="luxury">Luxury</option>
                            <option value="sports">Sports</option>
                            <option value="electric">Electric</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label htmlFor="buildYear" className="block text-sm font-medium text-gray-700 mb-1">
                          Build Year
                        </label>
                        <select
                          id="buildYear"
                          name="buildYear"
                          value={formData.buildYear || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select build year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-4">
                        <label htmlFor="carBrand" className="block text-sm font-medium text-gray-700 mb-1">
                          Car Brand
                        </label>
                        <select
                          id="carBrand"
                          name="carBrand"
                          value={formData.carBrand || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Car Brand</option>
                          <option value="toyota">Toyota</option>
                          <option value="honda">Honda</option>
                          <option value="ford">Ford</option>
                          <option value="bmw">BMW</option>
                          <option value="mercedes">Mercedes</option>
                          <option value="audi">Audi</option>
                          <option value="tesla">Tesla</option>
                        </select>
                      </div>

                      <div className="mt-4">
                        <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-1">
                          Car Model
                        </label>
                        <select
                          id="carModel"
                          name="carModel"
                          value={formData.carModel || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Car Model</option>
                          {/* Models would be dynamically populated based on selected brand */}
                          <option value="camry">Camry</option>
                          <option value="corolla">Corolla</option>
                          <option value="civic">Civic</option>
                          <option value="accord">Accord</option>
                          <option value="f150">F-150</option>
                          <option value="mustang">Mustang</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        placeholder="Search Your Location"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="mb-4">
                        <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Service Date
                        </label>
                        <input
                          type="date"
                          id="serviceDate"
                          name="serviceDate"
                          value={formData.serviceDate || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="serviceTime" className="block text-sm font-medium text-gray-700 mb-1">
                          Service Time
                        </label>
                        <select
                          id="serviceTime"
                          name="serviceTime"
                          value={formData.serviceTime || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Time</option>
                          <option value="9:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="13:00">1:00 PM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                          <option value="17:00">5:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 transition-colors"
                    >
                      BOOK NOW
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

