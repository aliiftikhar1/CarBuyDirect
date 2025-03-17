"use client"

import { useState, useEffect } from "react"
import { Eye, Loader } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fetchBiddings = async () => {
  const response = await fetch("/api/admin/biddingManagement")
  if (!response.ok) {
    throw new Error("Failed to fetch biddings")
  }
  const data = await response.json()
  return data.data
}

const fetchAuctions = async () => {
  const response = await fetch("/api/admin/auctionmanagement")
  if (!response.ok) {
    throw new Error("Failed to fetch auctions")
  }
  const data = await response.json()
  return data.data
}

export default function BiddingsTable() {
  const [biddings, setBiddings] = useState([])
  const [filteredBiddings, setFilteredBiddings] = useState([])
  const [filter, setFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [auctions, setAuctions] = useState([])
  const [filteredAuctions, setFilteredAuctions] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedAuction, setSelectedAuction] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filterBiddings = (biddings, userId, auctionId, status, textFilter) => {
    let filtered = biddings

    if (userId && userId !== "0") {
      filtered = filtered.filter((bidding) => bidding.User.id.toString() === userId)
    }

    if (auctionId && auctionId !== "0") {
      filtered = filtered.filter((bidding) => bidding.Auction.id.toString() === auctionId)
    }

    if (textFilter) {
      const lowercasedFilter = textFilter.toLowerCase()
      filtered = filtered.filter(
        (bidding) =>
          bidding.User.name.toLowerCase().includes(lowercasedFilter) ||
          bidding.price.toString().includes(lowercasedFilter) ||
          bidding.CarSubmission.vehicleMake.toLowerCase().includes(lowercasedFilter) ||
          bidding.CarSubmission.vehicleModel.toLowerCase().includes(lowercasedFilter),
      )
    }

    setFilteredBiddings(filtered)
  }

  const filterAuctions = (status) => {
    if (status && status !== "all") {
      return auctions.filter((auction) => auction.status === status)
    }
    return auctions
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [biddingsData, auctionsData] = await Promise.all([fetchBiddings(), fetchAuctions()])
        setBiddings(biddingsData)
        setAuctions(auctionsData)
        setFilteredAuctions(auctionsData)

        // Extract unique users
        const uniqueUsers = Array.from(new Set(biddingsData.map((b) => b.User.id)))
          .map((id) => biddingsData.find((b) => b.User.id === id)?.User)
          .filter((user) => user !== undefined)

        setUsers(uniqueUsers)
        filterBiddings(biddingsData, selectedUser, selectedAuction, selectedStatus, filter)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    filterBiddings(biddings, selectedUser, selectedAuction, selectedStatus, filter)
  }, [selectedUser, selectedAuction, selectedStatus, filter, biddings])

  useEffect(() => {
    setFilteredAuctions(filterAuctions(selectedStatus))
  }, [selectedStatus, auctions])

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    )
  if (error) return <div className="text-red-500">Error fetching data: {error}</div>

  return (
    <div className="space-y-4 p-2">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Users</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedStatus}
          onValueChange={(value) => {
            setSelectedStatus(value)
            setSelectedAuction("0") // Reset auction selection when status changes
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Coming-Soon">Coming Soon</SelectItem>
            <SelectItem value="Live">Live</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Ended">Ended</SelectItem>
            <SelectItem value="Sold">Sold Out</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedAuction} onValueChange={setSelectedAuction}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select Auction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Auctions</SelectItem>
            {filteredAuctions.map((auction) => (
              <SelectItem key={auction.id} value={auction.id.toString()}>
                {`${auction.CarSubmission.vehicleYear}-${auction.CarSubmission.vehicleMake}-${auction.CarSubmission.vehicleModel}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter by user name, price, or car details"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-[300px]"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Car</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBiddings.map((bidding) => (
            <TableRow key={bidding.id}>
              <TableCell>{bidding.User.name}</TableCell>
              <TableCell>{`${bidding.CarSubmission.vehicleYear} ${bidding.CarSubmission.vehicleMake} ${bidding.CarSubmission.vehicleModel}`}</TableCell>
              <TableCell>
                {bidding.currency} {bidding.price.toLocaleString()}
              </TableCell>
              <TableCell>{new Date(bidding.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Bidding Details</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6 py-4">
                      <div className="space-y-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead colSpan={2} className="text-lg font-semibold">
                                User Information
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Name</TableCell>
                              <TableCell>{bidding.User.name}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Email</TableCell>
                              <TableCell>{bidding.User.email}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Username</TableCell>
                              <TableCell>{bidding.User.username}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Phone</TableCell>
                              <TableCell>{bidding.User.phoneNo}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Type</TableCell>
                              <TableCell>{bidding.User.type}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Status</TableCell>
                              <TableCell>{bidding.User.status}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Verified</TableCell>
                              <TableCell>{bidding.User.verified ? "Yes" : "No"}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead colSpan={2} className="text-lg font-semibold">
                                Additional Details
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Address</TableCell>
                              <TableCell>{bidding.User.address}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">City</TableCell>
                              <TableCell>{bidding.User.city}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Province</TableCell>
                              <TableCell>{bidding.User.province}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Country</TableCell>
                              <TableCell>{bidding.User.country}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Zipcode</TableCell>
                              <TableCell>{bidding.User.zipcode}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead colSpan={2} className="text-lg font-semibold">
                                Card Information
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Card Name</TableCell>
                              <TableCell>{bidding.User.cardName}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Card Number</TableCell>
                              <TableCell>{bidding.User.cardNumber ? bidding.User.cardNumber : "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Card Expiry</TableCell>
                              <TableCell>{bidding.User.cardExpiry}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Card CVC</TableCell>
                              <TableCell>{bidding.User.cardCvc ? bidding.User.cardCvc : "N/A"}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      <div className="space-y-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead colSpan={2} className="text-lg font-semibold">
                                Auction Information
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Start Date</TableCell>
                              <TableCell>{new Date(bidding.Auction.startDate).toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">End Date</TableCell>
                              <TableCell>{new Date(bidding.Auction.endDate).toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Location</TableCell>
                              <TableCell>{bidding.Auction.location}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Status</TableCell>
                              <TableCell>{bidding.Auction.status}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead colSpan={2} className="text-lg font-semibold">
                                Car Information
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Make</TableCell>
                              <TableCell>{bidding.CarSubmission.vehicleMake}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Model</TableCell>
                              <TableCell>{bidding.CarSubmission.vehicleModel}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Year</TableCell>
                              <TableCell>{bidding.CarSubmission.vehicleYear}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        {bidding.CarSubmission.SubmissionImages.find((img) => img.label === "horizontal") && (
                          <div>
                            <h4 className="font-medium mt-2 mb-2">Image:</h4>
                            <img
                              src={
                                bidding.CarSubmission.SubmissionImages.find((img) => img.label === "horizontal").data ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={`${bidding.CarSubmission.vehicleYear} ${bidding.CarSubmission.vehicleMake} ${bidding.CarSubmission.vehicleModel}`}
                              className="max-w-full h-auto"
                            />
                          </div>
                        )}
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead colSpan={2} className="text-lg font-semibold">
                                Bid Information
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Price</TableCell>
                              <TableCell>
                                {bidding.currency} {bidding.price.toLocaleString()}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Created At</TableCell>
                              <TableCell>{new Date(bidding.createdAt).toLocaleString()}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

