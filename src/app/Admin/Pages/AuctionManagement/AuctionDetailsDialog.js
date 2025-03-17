"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { formatDate, formatCurrency } from "@/utils/formatdate"
// import { formatDate, formatCurrency } from "@/lib/utils"
import { getBiddingsForAuction } from "./actions"

export default function AuctionDetailsDialog({ auction, onClose }) {
  const [biddings, setBiddings] = useState([])

  useEffect(() => {
    const fetchBiddings = async () => {
      const result = await getBiddingsForAuction(auction.id)
      setBiddings(result)
    }
    fetchBiddings()
  }, [auction.id])

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Auction Details</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="auction">
          <TabsList>
            <TabsTrigger value="auction">Auction</TabsTrigger>
            <TabsTrigger value="car">Car</TabsTrigger>
            <TabsTrigger value="biddings">Biddings</TabsTrigger>
          </TabsList>
          <TabsContent value="auction">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Start Date</h3>
                <p>{formatDate(auction.startDate)}</p>
              </div>
              <div>
                <h3 className="font-semibold">End Date</h3>
                <p>{formatDate(auction.endDate)}</p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                <p>{auction.status}</p>
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p>{auction.location}</p>
              </div>
              <div>
                <h3 className="font-semibold">Views</h3>
                <p>{auction.views}</p>
              </div>
              <div>
                <h3 className="font-semibold">Watching</h3>
                <p>{auction.watching}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="car">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Make</h3>
                <p>{auction.CarSubmission.vehicleMake}</p>
              </div>
              <div>
                <h3 className="font-semibold">Model</h3>
                <p>{auction.CarSubmission.vehicleModel}</p>
              </div>
              <div>
                <h3 className="font-semibold">Year</h3>
                <p>{auction.CarSubmission.vehicleYear}</p>
              </div>
              <div>
                <h3 className="font-semibold">VIN</h3>
                <p>{auction.CarSubmission.vin}</p>
              </div>
              <div>
                <h3 className="font-semibold">Mileage</h3>
                <p>
                  {auction.CarSubmission.mileage} {auction.CarSubmission.mileageUnit}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Seller</h3>
                <p>{auction.CarSubmission.User.name}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="biddings">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">User</th>
                  <th className="text-left">Price</th>
                  <th className="text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {biddings.map((bid) => (
                  <tr key={bid.id}>
                    <td>{bid.User.name}</td>
                    <td>{formatCurrency(bid.price)}</td>
                    <td>{formatDate(bid.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

