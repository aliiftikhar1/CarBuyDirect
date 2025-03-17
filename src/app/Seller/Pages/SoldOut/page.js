"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { makeUseVisualState } from "framer-motion"
import { useSelector } from "react-redux"

export default function EndedAuctionsPage() {
  const [endedAuctions, setEndedAuctions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = useSelector((data)=>data.CarUser.userDetails)

  useEffect(() => {
    const fetchEndedAuctions = async () => {
      try {
        const response = await fetch(`/api/admin/myEndedAuctions/${user.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch ended auctions")
        }
        const data = await response.json()
        setEndedAuctions(data)
      } catch (err) {
        setError("An error occurred while fetching ended auctions")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEndedAuctions()
  }, [])

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ended Auctions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ended Auctions List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Highest Bid</TableHead>
                {/* <TableHead>Closing Price</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {endedAuctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell>{`${auction.CarSubmission.vehicleMake} ${auction.CarSubmission.vehicleModel}`}</TableCell>
                  <TableCell>{auction.CarSubmission.vehicleYear}</TableCell>
                  <TableCell>{`${auction.CarSubmission.mileage} ${auction.CarSubmission.mileageUnit}`}</TableCell>
                  <TableCell>{auction.CarSubmission.condition}</TableCell>
                  <TableCell>{new Date(auction.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {auction.highestBid ? `${auction.highestBid.price} ${auction.highestBid.currency}` : "No bids"}
                  </TableCell>
                  {/* <TableCell>{auction.closingPrice}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

