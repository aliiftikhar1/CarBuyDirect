import { DollarSign, CreditCard, Tag, Car } from "lucide-react"
import Image from "next/image"

export default function LoanPreApproval() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Set Your Budget Beforehand",
      description: "Find out the maximum amount you can borrow and pick a car that you can afford within your budget.",
    },
    {
      icon: CreditCard,
      title: "Stay in Control",
      description: "Find out your credit health and plan your finances properly.",
    },
    {
      icon: Tag,
      title: "Fast & Free Application",
      description:
        "Get a CarBuyDirect Pre-approval Certificate with just your Identification Card (IC) and monthly income details. It's completely free.",
    },
    {
      icon: Car,
      title: "Collect Your Car Easily",
      description:
        "Secure the CarBuyDirect Certified car you want by showing your CarBuyDirect Pre-approval Certificate and collect your car in 1 working day*.",
    },
  ]

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Your Car Loan Pre-approved</h2>
              <p className="text-gray-600">
                Worried about loan rejection? Avoid the wait and get a CarBuyDirect Pre-approval Certificate before you shop
                for your dream CarBuyDirect Certified car!
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image src="https://www.carsome.my/_nuxt/img/img-per-loan.f0b1756.png" alt="Happy customer with car keys" fill className="object-cover" priority />
          </div>
        </div>
      </div>
    </section>
  )
}

