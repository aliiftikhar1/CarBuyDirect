"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

function formatCurrency(amount, currency) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
}



export default function MybidsSection({ bids }) {
  const [activeTab, setActiveTab] = useState("active")

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-2">
        My <span className="text-[#B08968]">Bids</span>
      </h2>
      <p className="text-muted-foreground mb-8">Here you will see all your bids</p>

      <div className="border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("active")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors relative",
              activeTab === "active" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Active bids
            {activeTab === "active" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
          </button>
          <button
            onClick={() => setActiveTab("archived")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors relative",
              activeTab === "archived" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Archived bids
            {activeTab === "archived" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
          </button>
        </div>
      </div>

      <div className="py-20">
        {bids?.length === 0 ? (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">No bids found</h3>
            <p className="text-muted-foreground">You have no {activeTab} bids.</p>
            <Button variant="secondary" className="mt-4 bg-muted/60 hover:bg-muted">
              Get started, sell now
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bids?.map((bid) => (
              <div key={bid.id} className="flex border rounded-lg overflow-hidden shadow-md">
                <div className="w-1/3">
                  <Image
                    src={bid.CarSubmission.SubmissionImages[0]?.data || "/placeholder.svg"}
                    alt={`${bid.CarSubmission.vehicleMake} ${bid.CarSubmission.vehicleModel}`}
                    width={300}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {bid.CarSubmission.vehicleYear} {bid.CarSubmission.vehicleMake} {bid.CarSubmission.vehicleModel}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">Auction ID: {bid.auctionId}</p>
                  <p className="text-sm mb-2">Your bid: {formatCurrency(bid.price, bid.currency)}</p>
                  <p className="text-sm mb-2">Location: {bid.Auction.location}</p>
                  <p className="text-sm">Status: {bid.Auction.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

