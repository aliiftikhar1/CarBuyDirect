"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactSection() {
  const [message, setMessage] = useState("")
  const maxLength = 500

  const handleMessageChange = (e) => {
    if (e.target.value.length <= maxLength) {
      setMessage(e.target.value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted")
  }

  return (
    <section className="py-16 px-4 mt-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          <span className="text-[#b19b61]">Contact</span> Us
        </h2>
        <p className="text-gray-700 max-w-3xl">Have a question or a comment?</p>
        <p className="text-gray-700 max-w-3xl">
          Please use the form below to get in touch with us. We'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-2 border-0 md:border border-gray-200 rounded-md p-2 md:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  Name
                </label>
                <Input id="name" type="text" required className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email
                </label>
                <Input id="email" type="email" required className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="phone" className="block mb-2 font-medium">
                  Phone number
                </label>
                <div className="flex">
                  <div className="w-20 mr-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="+1" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+44">+44</SelectItem>
                        <SelectItem value="+971">+971</SelectItem>
                        <SelectItem value="+61">+61</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block mb-2 font-medium">
                  Subject
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 font-medium">
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={handleMessageChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md min-h-[150px]"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {message.length}/{maxLength}
              </div>
            </div>

            <Button
              type="submit"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition-colors"
            >
              Send Message
            </Button>
          </form>
        </div>

        {/* Support Information */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>US +1 323-407-8523</li>
              <li>UK +44 20 4525 8014</li>
              <li>UAE +971 4 876 1764</li>
              <li className="pt-2">
                <a href="mailto:support@carbuydirect.com" className="text-[#b19b61] hover:underline">
                  support@carbuydirect.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Mailing Address</h3>
            <address className="not-italic">
              <p>SB Media USA Inc.</p>
              <p>611 Wilshire Blvd, Suite 900 #1074</p>
              <p>Los Angeles, CA 90017, USA</p>
            </address>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Need Answers?</h3>
            <p className="mb-4">Check our FAQ section to find answers to all your questions about the platform</p>
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
              onClick={() => (window.location.href = "/FAQ")}
            >
              Go to FAQ section
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

