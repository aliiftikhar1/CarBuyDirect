"use client"

import * as React from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MainNav({ children, isOpen, onOpenChange }) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b"></div>
          <nav className="flex-1 px-2">
            <div className="space-y-2 py-4">
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
              <NavLink href="/team" onOpenChange={onOpenChange}>
                Team
              </NavLink>
              <NavLink href="/press" onOpenChange={onOpenChange}>
                Press
              </NavLink>
              <NavLink href="/careers" onOpenChange={onOpenChange}>
                Careers
              </NavLink>
              <NavLink href="/contact" onOpenChange={onOpenChange}>
                Contact Us
              </NavLink>
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
