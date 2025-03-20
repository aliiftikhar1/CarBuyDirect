"use client"


import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CarInsuranceForm() {
  const router = useRouter()
  const [insuranceType, setInsuranceType] = useState("comprehensive")
  const [carPlateNumber, setCarPlateNumber] = useState("")
  const [residentialPostcode, setResidentialPostcode] = useState("")
  const [isEhailing, setIsEhailing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    // Basic validation
    if (!carPlateNumber.trim()) {
      setError("Car plate number is required")
      setIsSubmitting(false)
      return
    }

    if (!residentialPostcode.trim()) {
      setError("Residential postcode is required")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/user/car-insurance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          insuranceType,
          carPlateNumber,
          residentialPostcode,
          isEhailing,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      // Success
      setSuccess(true)
      setCarPlateNumber("")
      setResidentialPostcode("")

      // Redirect or show success message
      setTimeout(() => {
        router.push("/Car-Insurance/Success")
      }, 2000)
    } catch (err) {
      setError(err.message || "Failed to submit form")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[url('https://b2c-cdn.carsome.my/cdn-cgi/image/format=auto,quality=60,width=1440/Consumer/Whitelist_banner_Desktop_1440x700_EN_2c4ee7d188.jpg')] flex flex-col md:flex-row py-16">
      {/* Left side - Promotional content */}
      <div className="flex-1 flex flex-col"></div>

      {/* Right side - Form */}
      <div className="md:w-[450px] flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg border shadow-lg p-6 w-full max-w-md">
          {success ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h2 className="text-xl font-bold mb-2">Form Submitted Successfully!</h2>
              <p className="text-gray-600">Redirecting you to the next step...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-800">Car Insurance Type</h2>
                  <div className="w-5 h-5 rounded-full bg-gray-500 text-white flex items-center justify-center text-xs">
                    i
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="insuranceType"
                      value="comprehensive"
                      checked={insuranceType === "comprehensive"}
                      onChange={() => setInsuranceType("comprehensive")}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-800">Comprehensive</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="insuranceType"
                      value="thirdParty"
                      checked={insuranceType === "thirdParty"}
                      onChange={() => setInsuranceType("thirdParty")}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-800">Third Party, Fire & Theft</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-800 font-semibold mb-2">Car Plate Number</label>
                <input
                  type="text"
                  placeholder="Enter Car Plate Number"
                  value={carPlateNumber}
                  onChange={(e) => setCarPlateNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-800 font-semibold mb-2">Residential Postcode</label>
                <input
                  type="text"
                  placeholder="Enter Postcode"
                  value={residentialPostcode}
                  onChange={(e) => setResidentialPostcode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isEhailing}
                    onChange={() => setIsEhailing(!isEhailing)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-800">The car is used for e-hailing services</span>
                </label>
              </div>

              {error && <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">{error}</div>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-semibold py-3 rounded-md transition duration-200 ${
                  isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-500"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Continue"}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="font-bold text-gray-800">CarBuyDirect</div>
                <div className="text-gray-500">|</div>
                <div className="font-bold flex items-center">
                  <span className="mr-1">🛡️</span> PolicyStreet
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

