"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSelector } from "react-redux"

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState([])
  const [selectedAuction, setSelectedAuction] = useState(null)
  const user = useSelector((data)=>data.CarUser.userDetails)

  useEffect(() => {
    const fetchAuctions = async () => {
      const response = await fetch(`/api/admin/myAuctions/${user.id}`)
      const data = await response.json()
      setAuctions(data)
    }

    fetchAuctions()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Auctions and Bidding</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Auctions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auctions.map((auction) => (
                  <TableRow key={auction.id}>
                    <TableCell>{auction.CarSubmission.vehicleMake}</TableCell>
                    <TableCell>{auction.CarSubmission.vehicleModel}</TableCell>
                    <TableCell>{auction.CarSubmission.vehicleYear}</TableCell>
                    <TableCell>{auction.status}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => setSelectedAuction(auction)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        View Bids
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bidding Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAuction ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {selectedAuction.CarSubmission.vehicleMake} {selectedAuction.CarSubmission.vehicleModel} (
                  {selectedAuction.CarSubmission.vehicleYear})
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bidder</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedAuction.Bids.map((bid) => (
                      <TableRow key={bid.id}>
                        <TableCell>{bid.User.name}</TableCell>
                        <TableCell>
                          {bid.price} {bid.currency}
                        </TableCell>
                        <TableCell>{new Date(bid.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p>Select an auction to view bidding details.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

