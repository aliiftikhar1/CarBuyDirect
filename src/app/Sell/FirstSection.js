'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function CarInquiryForm() {
  const [phoneCode, setPhoneCode] = useState("+1")

  return (
    <div className="min-h-screen relative bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage: 'url("/bg/banner-adjusted-3.jpg")'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-12 md:min-h-screen flex items-center">
        <div className="w-full md:flex gap-8">
          {/* Heading Section */}
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl md:text-5xl font-[100] text-white">
              Harnessing <span className="text-[#C5B358]">Supercar Blondie's</span> Vast Reach
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl">
              With an unrivaled automotive audience of 120 million people, 
              we will connect you to buyers all over the world, unlocking the best 
              selling price for your vehicle.
            </p>
            <p className="text-lg text-gray-300">
              Let's discover what we can achieve together.
              Submit your inquiry to get started.
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-6 md:w-1/3">
            <h2 className="text-2xl text-white mb-6 font-[100]">Inquire about selling your vehicle</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm text-gray-300">
                  First Name *
                </label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="bg-white/90 border-0 h-12"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm text-gray-300">
                  Last Name *
                </label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="bg-white/90 border-0 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-gray-300">
                E-mail *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@gmail.com"
                className="bg-white/90 border-0 h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm text-gray-300">
                Phone number *
              </label>
              <div className="flex gap-2">
                <Select value={phoneCode} onValueChange={setPhoneCode}>
                  <SelectTrigger className="w-[100px] bg-white/90 border-0 h-12">
                    <SelectValue placeholder="+1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                    <SelectItem value="+91">+91</SelectItem>
                    <SelectItem value="+81">+81</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  className="bg-white/90 border-0 h-12"
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>

            <Button 
              className="w-full md:w-auto px-8 py-6 text-lg bg-[#C5B358] hover:bg-[#B5A348] text-white"
            >
              CONTINUE
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

