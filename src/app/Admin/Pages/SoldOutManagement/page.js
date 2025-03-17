"use client"

import { useState, useEffect } from "react"
import { Eye, Loader } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const fetchSoldItems = async () => {
  const response = await fetch("/api/admin/soldoutManagement")
  if (!response.ok) {
    throw new Error("Failed to fetch sold items")
  }
  const data = await response.json()
  console.log("Sold Items Data", data.data)
  return data.data
}

export default function SoldOutTable() {
  const [soldItems, setSoldItems] = useState([])
  const [filteredSoldItems, setFilteredSoldItems] = useState([])
  const [filter, setFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [auctions, setAuctions] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedAuction, setSelectedAuction] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchSoldItems()
        setSoldItems(data)
        setFilteredSoldItems(data)

        // Extract unique users and auctions
        const uniqueUsers = Array.from(new Set(data.map((item) => item.User.id)))
          .map((id) => data.find((item) => item.User.id === id)?.User)
          .filter((user) => user !== undefined)

        const uniqueAuctions = Array.from(new Set(data.map((item) => item.Auction.id)))
          .map((id) => data.find((item) => item.Auction.id === id)?.Auction)
          .filter((auction)=> auction !== undefined)

        setUsers(uniqueUsers)
        setAuctions(uniqueAuctions)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const filterSoldItems = () => {
      let filtered = soldItems

      if (selectedUser && selectedUser !== "0") {
        filtered = filtered.filter((item) => item.User.id.toString() === selectedUser)
      }

      if (selectedAuction && selectedAuction !== "0") {
        filtered = filtered.filter((item) => item.Auction.id.toString() === selectedAuction)
      }

      if (filter) {
        const lowercasedFilter = filter.toLowerCase()
        filtered = filtered.filter(
          (item) =>
            item.User.name.toLowerCase().includes(lowercasedFilter) ||
            item.price.toString().includes(lowercasedFilter) ||
            item.Auction.CarSubmission.vehicleMake.toLowerCase().includes(lowercasedFilter) ||
            item.Auction.CarSubmission.vehicleModel.toLowerCase().includes(lowercasedFilter),
        )
      }

      setFilteredSoldItems(filtered)
    }

    filterSoldItems()
  }, [selectedUser, selectedAuction, filter, soldItems])

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
        <Select value={selectedAuction} onValueChange={setSelectedAuction}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select Auction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Auctions</SelectItem>
            {auctions.map((auction) => (
              <SelectItem key={auction.id} value={auction.id.toString()}>
                {new Date(auction.startDate).toLocaleDateString()} - {auction.location}
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
          {filteredSoldItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.User.name}</TableCell>
              <TableCell>{`${item.Auction.CarSubmission.vehicleYear} ${item.Auction.CarSubmission.vehicleMake} ${item.Auction.CarSubmission.vehicleModel}`}</TableCell>
              <TableCell>
                {item.currency} {item.price.toLocaleString()}
              </TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Sold Item Details</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <h3 className="text-lg font-semibold">User Information</h3>
                        <p>Name: {item.User.name}</p>
                        <p>Email: {item.User.email}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Auction Information</h3>
                        <p>Start Date: {new Date(item.Auction.startDate).toLocaleString()}</p>
                        <p>End Date: {new Date(item.Auction.endDate).toLocaleString()}</p>
                        <p>Location: {item.Auction.location}</p>
                        <p>Status: {item.Auction.status}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Car Information</h3>
                        <p>Make: {item.Auction.CarSubmission.vehicleMake}</p>
                        <p>Model: {item.Auction.CarSubmission.vehicleModel}</p>
                        <p>Year: {item.Auction.CarSubmission.vehicleYear}</p>
                        <h4 className="font-medium mt-2">Image:</h4>
                        {item.Auction.CarSubmission.SubmissionImages.find((img) => img.label === "horizontal") && (
                          <img
                            src={
                              item.Auction.CarSubmission.SubmissionImages.find((img) => img.label === "horizontal")
                                ?.data || "/placeholder.svg"
                            }
                            alt={`${item.Auction.CarSubmission.vehicleYear} ${item.Auction.CarSubmission.vehicleMake} ${item.Auction.CarSubmission.vehicleModel}`}
                            className="mt-2 max-w-full h-auto"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Sale Information</h3>
                        <p>
                          Price: {item.currency} {item.price.toLocaleString()}
                        </p>
                        <p>Sold At: {new Date(item.createdAt).toLocaleString()}</p>
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

