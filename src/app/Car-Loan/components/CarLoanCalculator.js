"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Info } from "lucide-react"

export default function LoanCalculator() {
  const [carPrice, setCarPrice] = useState(100000)
  const [downPayment, setDownPayment] = useState(10000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(10)
  const [interestRate, setInterestRate] = useState(3.5)
  const [loanTenure, setLoanTenure] = useState(5)
  const [monthlyPayment, setMonthlyPayment] = useState(0)

  // Calculate monthly payment
  useEffect(() => {
    const principal = carPrice - downPayment
    const monthlyInterest = interestRate / 100 / 12
    const numberOfPayments = loanTenure * 12

    const monthly = principal * monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments)
    const denominator = Math.pow(1 + monthlyInterest, numberOfPayments) - 1
    const payment = monthly / denominator

    setMonthlyPayment(payment)
  }, [carPrice, downPayment, interestRate, loanTenure])

  // Handle down payment percentage change
  const handleDownPaymentPercentChange = (value) => {
    const percent = Number.parseFloat(value) || 0
    setDownPaymentPercent(percent)
    setDownPayment((carPrice * percent) / 100)
  }

  // Handle down payment amount change
  const handleDownPaymentChange = (value) => {
    const amount = Number.parseFloat(value) || 0
    setDownPayment(amount)
    setDownPaymentPercent((amount / carPrice) * 100)
  }

  // Reset form
  const handleReset = () => {
    setCarPrice(100000)
    setDownPayment(10000)
    setDownPaymentPercent(10)
    setInterestRate(3.5)
    setLoanTenure(5)
  }

  return (
    <section className="py-16 mt-4 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Finance Your Dream Car</h2>
        <p className="text-gray-600">
          We make it easy for you to own the car you want. Let us help you secure a loan from paperwork submission to
          getting fast loan approval.
        </p>
      </div>

      <div className="max-w-6xl mx-auto bg-[#1a365d] rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="grid md:grid-cols-[1fr_300px] gap-8">
          {/* Calculator Form */}
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-white hover:text-white hover:bg-white/10"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-white">Car Price (RM)</label>
                </div>
                <Input
                  type="number"
                  value={carPrice}
                  onChange={(e) => setCarPrice(Number.parseFloat(e.target.value) || 0)}
                  className="bg-white"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-white">Down Payment</label>
                  <Info className="w-4 h-4 text-blue-300" />
                </div>
                <div className="grid grid-cols-[1fr_100px] gap-2">
                  <Input
                    type="number"
                    value={downPayment}
                    onChange={(e) => handleDownPaymentChange(e.target.value)}
                    className="bg-white"
                  />
                  <Input
                    type="number"
                    value={downPaymentPercent.toFixed(2)}
                    onChange={(e) => handleDownPaymentPercentChange(e.target.value)}
                    className="bg-white"
                    suffix="%"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-white">Interest Rate (%)</label>
                  <Info className="w-4 h-4 text-blue-300" />
                </div>
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number.parseFloat(e.target.value) || 0)}
                  className="bg-white"
                  step="0.1"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-white">Loan Tenure</label>
                </div>
                <div className="grid grid-cols-[1fr_80px] gap-4 items-center">
                  <Slider
                    value={[loanTenure]}
                    onValueChange={(value) => setLoanTenure(value[0])}
                    max={9}
                    min={1}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number.parseInt(e.target.value) || 1)}
                      className="bg-white text-black w-12"
                      min={1}
                      max={9}
                    />
                    <span className="text-white">Years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-gray-300 mb-1">Your Estimated Monthly Payment:</div>
              <div className="text-3xl font-bold text-white mb-4">
                <span className="text-sm text-yellow-400">RM</span> {monthlyPayment.toFixed(2)}
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900">
                  Find Cars within Budget
                </Button>
                <Button variant="outline" className="w-full text-black border-white hover:bg-white/90">
                  Get Pre-approved Now
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Disclaimer: All interest rates and calculated amounts are estimations only. Actual amounts may differ
              based on your individual credit profile.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

