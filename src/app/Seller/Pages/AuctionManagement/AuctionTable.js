"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AuctionDetailsDialog from "./AuctionDetailsDialog"
import { formatDate } from "@/utils/formatdate"
import UpdateCarSubmissionDialog from "./UpdateCarSubmissionDialog"

export default function AuctionTable({initialAuctions }) {
  const [auctions, setAuctions] = useState(initialAuctions)
  const [filter, setFilter] = useState("")
  const [selectedAuction, setSelectedAuction] = useState(null)

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase()
    setFilter(value)
    const filtered = initialAuctions.filter(
      (auction) =>
        auction?.CarSubmission?.vehicleMake.toLowerCase().includes(value) ||
        auction?.CarSubmission?.vehicleModel.toLowerCase().includes(value) ||
        auction?.CarSubmission?.User.name.toLowerCase().includes(value) ||
        auction?.status?.toLowerCase().includes(value),
    )
    setAuctions(filtered)
  }
  useEffect(() => {
    setAuctions(initialAuctions)
  }, [initialAuctions])

  const handleAuctionUpdate = (updatedAuction) => {
    setAuctions((prevAuctions) =>
      prevAuctions.map((auction) => (auction.id === updatedAuction.id ? updatedAuction : auction)),
    )
  }

  return (
    <div>
      <Input type="text" placeholder="Search auctions..." value={filter} onChange={handleFilter} className="mb-4" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Car</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auctions?.map((auction) => (
            <TableRow key={auction.id}>
              <TableCell>
                {auction.CarSubmission?.vehicleMake} {auction.CarSubmission?.vehicleModel}
              </TableCell>
              <TableCell>{auction.CarSubmission?.User.name}</TableCell>
              <TableCell>{formatDate(auction.startDate)}</TableCell>
              <TableCell>{formatDate(auction.endDate)}</TableCell>
              <TableCell>{auction.status}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAuction(auction)}>
                  <Eye className="h-4 w-4" />
                </Button>
                {/* <UpdateCarSubmissionDialog auction={auction} onUpdate={handleAuctionUpdate} /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedAuction && <AuctionDetailsDialog auction={selectedAuction} onClose={() => setSelectedAuction(null)} />}
    </div>
  )
}

