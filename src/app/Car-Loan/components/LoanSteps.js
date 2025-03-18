"use client"

import { useState } from "react"
import { FileCheck, Car, CheckCircle, Search, FileText, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoanSteps() {
  const [loanType, setLoanType] = useState("pre-approved")

  const preApprovedSteps = [
    {
      number: "1",
      title: "Get a CARSOME Pre-approval Certificate",
      description:
        "Submit your Identification Card (IC) and monthly income details to us. A CARSOME Pre-approval Certificate will be generated with your maximum loan amount, repayment period, and interest rate.",
      icon: FileCheck,
    },
    {
      number: "2",
      title: "Choose a CARSOME Certified Car",
      description:
        "Find the car you want on our website. Book a test drive and once you make your decision, show your CARSOME Pre-approval Certificate to get your purchase finalized.",
      icon: Car,
    },
    {
      number: "3",
      title: "Collect Your Car Instantly",
      description:
        "Bring your car home! We can arrange for collection at a CARSOME Experience Center, or deliver it straight to your doorstep.",
      icon: CheckCircle,
    },
  ]

  const conventionalSteps = [
    {
      number: "1",
      title: "Find Your Dream Car",
      description:
        "Browse our wide selection of CARSOME Certified cars on our website. Book a test drive and choose the perfect car for you.",
      icon: Search,
    },
    {
      number: "2",
      title: "Apply for a Car Loan",
      description:
        "Submit your loan application along with the required documents. Our team will assist you in finding the best loan options from our partner banks.",
      icon: FileText,
    },
    {
      number: "3",
      title: "Wait for Loan Approval",
      description:
        "The bank will process your application. This may take a few days. Once approved, we'll finalize your purchase and arrange for car collection or delivery.",
      icon: Clock,
    },
  ]

  const steps = loanType === "pre-approved" ? preApprovedSteps : conventionalSteps

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get a Car Loan in 3 Easy Steps</h2>
          <div className="w-12 h-1 bg-yellow-400 mx-auto mb-8"></div>

          {/* Loan Type Toggle */}
          <div className="inline-flex rounded-full p-1 bg-gray-100">
            <button
              onClick={() => setLoanType("pre-approved")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                loanType === "pre-approved" ? "bg-[#1a365d] text-yellow-400" : "text-gray-600 hover:text-gray-900",
              )}
            >
              Pre-approved Car Loan
            </button>
            <button
              onClick={() => setLoanType("conventional")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                loanType === "conventional" ? "bg-[#1a365d] text-yellow-400" : "text-gray-600 hover:text-gray-900",
              )}
            >
              Conventional Car Loan
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative bg-white rounded-lg p-6 shadow-lg">
                {/* Number Tag */}
                <div className="absolute -top-3 right-6 bg-yellow-400 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-[#1a365d]" />
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

