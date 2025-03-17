'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function MyInvoicesSection() {
 
  const [Invoices] = useState([]) // Empty array to simulate no Invoices

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-2">
        My <span className="text-[#B08968]">Invoices</span>
      </h2>
      <p className="text-muted-foreground mb-8">Here you will see all your Invoices</p>

      <div className="py-20">
        {Invoices.length === 0 ? (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">No Invoices found</h3>
            <p className="text-muted-foreground">
              You have no Invoices.
            </p>
            <Button 
              variant="secondary" 
              className="mt-4 bg-muted/60 hover:bg-muted"
            >
              Get started, sell now
            </Button>
          </div>
        ) : (
          // Invoices grid would go here when there are items
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Invoices.map((listing) => (
              // Listing card component would go here
              <div key={listing.id}>{/* Listing content */}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
