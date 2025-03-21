"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MainNav({ children, isOpen, onOpenChange }) {
  const [serviceOpen, setServiceOpen] = React.useState(false)

  const toggleService = (e) => {
    e.preventDefault()
    setServiceOpen(!serviceOpen)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 "></div>
          <nav className="flex-1 px-2 overflow-y-auto">
            <div className=" py-4">
              <NavLink href="/Auction" onOpenChange={onOpenChange}>
                Auctions
              </NavLink>
              <NavLink href="/Preview" onOpenChange={onOpenChange}>
                Preview
              </NavLink>
              <NavLink href="/Results" onOpenChange={onOpenChange}>
                Results
              </NavLink>
              <NavLink href="/Sell" onOpenChange={onOpenChange}>
                Sell Your Vehicle
              </NavLink>
              <NavLink href="/About" onOpenChange={onOpenChange}>
                About Us
              </NavLink>
              <NavLink href="/Team" onOpenChange={onOpenChange}>
                Team
              </NavLink>
              <NavLink href="/Careers" onOpenChange={onOpenChange}>
                Careers
              </NavLink>
              <NavLink href="/contact" onOpenChange={onOpenChange}>
                Contact Us
              </NavLink>
              <NavLink href="/Terms-Of-Service" onOpenChange={onOpenChange}>
                Terms Of Service
              </NavLink>
              <NavLink href="/Privacy-Policy" onOpenChange={onOpenChange}>
                Privacy & Policy
              </NavLink>
              <div className="relative">
                <button
                  onClick={toggleService}
                  className="flex items-center justify-between w-full px-4 py-2 text-lg hover:bg-gray-100 rounded-md transition-colors"
                >
                  <span>Service</span>
                  <ChevronRight className={`h-5 w-5 transition-transform ${serviceOpen ? "rotate-90" : ""}`} />
                </button>
                {serviceOpen && (
                  <div className="pl-4 mt-1 border-l-2 border-gray-200 ml-4">
                    <NavLink href="/Car-Loan" onOpenChange={onOpenChange}>
                      Car Loan
                    </NavLink>
                    <NavLink href="/Car-Insurance" onOpenChange={onOpenChange}>
                      Car Insurance
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function NavLink({ href, children, onOpenChange }) {
  const handleClick = () => {
    if (onOpenChange) {
      onOpenChange(false) // Close the sidebar
    }
  }

  return (
    <Link
      href={href}
      className="block px-4 py-2 text-lg hover:bg-gray-100 rounded-md transition-colors"
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}

