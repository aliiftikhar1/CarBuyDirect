'use client'

import { Button } from "@/components/ui/button"
import { Shield, Info } from 'lucide-react'
import { useEffect, useState } from "react"

export default function BiddingSource({data}) {
  const [formdata, setformdata]=useState(null)
    useEffect(()=>{
      setformdata(data)
    },[data])
   
  return (
    <div className="w-full mt-8">
      <h2 className="text-3xl font-semibold mb-2">
        <span className="text-[#B08968]">Bidding</span> Source
      </h2>
      <p className="text-muted-foreground mb-8">
        Manage your payment methods from here
      </p>

      <div className="border rounded-lg p-8 space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            No payment source was found
          </h3>
          <p className="text-muted-foreground">
            We require a valid credit card on file before you can bid.
          </p>
          <Button 
            variant="secondary" 
            className="bg-muted/60 hover:bg-muted"
          >
            Add card & start bidding
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Payments are secured</span>
        </div>

        <div className="flex items-start gap-2 pt-4 border-t">
          <Info className="h-5 w-5 text-[#B08968] mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Winning bidders pay a 5% buyer's fee on top of the winning amount.
          </p>
        </div>
      </div>
    </div>
  )
}

