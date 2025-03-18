import { FileText, FileCheck, Smartphone } from "lucide-react"

export default function InsuranceSteps() {
  const steps = [
    {
      number: "1",
      title: "Get an Instant Quotation",
      description:
        "Tell us about your car, and we will work on generating instant quotations from various insurance providers, tailored to your details.",
      icon: FileText,
    },
    {
      number: "2",
      title: "Choose an Insurance Provider",
      description:
        "Compare quotations easily from our wide selection of insurers and decide on any add-ons, such as road tax renewal, that you may need.",
      icon: FileCheck,
    },
    {
      number: "3",
      title: "Confirm Your Details & Make Payment",
      description:
        "Review your overall quotation and make payment with either credit or debit card, online banking, e-wallet, or by cash.",
      icon: Smartphone,
    },
  ]

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Insured in 3 Easy Steps</h2>
          <div className="w-12 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative bg-white rounded-lg p-6 shadow-lg">
                {/* Number Tag */}
                <div className="absolute -top-3 right-6 bg-yellow-400 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-gray-700" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

