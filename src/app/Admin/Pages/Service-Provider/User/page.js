"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
// Add a new import for Select component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ServiceProviderPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    zipcode: "",
    location: "",
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/serviceProvider/allUser")
      const data = await response.json()
      setUsers(data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users. Please try again.",
      })
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setFormData({
      zipcode: user.zipcode || "",
      location: user.address || "",
    })
    setOpen(true)
  }

  // Update the handleSubmit function to validate that a user is selected
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedUser) {
      toast("Please select a user")
      return
    }

    try {
      const response = await fetch("/api/admin/serviceProvider/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          zipcode: selectedUser.zipcode || formData.zipcode,
          location: selectedUser.address || formData.location,
        }),
      })

      if (response.ok) {
        toast(`${selectedUser.name} is now a service provider.`)
        setOpen(false)
        setFormData({ zipcode: "", location: "" })
        setSelectedUser(null)
        // Refresh the user list to show updated status
        fetchUsers()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to create service provider")
      }
    } catch (error) {
      toast(error.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className=" mx-auto py-2">
      <Card className="border-0">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Service Provider Management</CardTitle>
              <CardDescription>View all users and convert them to service providers</CardDescription>
            </div>
            {/* <Button
              onClick={() => {
                setSelectedUser(null)
                setFormData({ zipcode: "", location: "" })
                setOpen(true)
              }}
            >
              Add Service Provider
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <p>Loading users...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.serviceProvider ? "Service Provider" : "User"}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUserSelect(user)}
                          disabled={user.serviceProvider !== null}
                        >
                          {user.serviceProvider ? "Already a Provider" : "Make Provider"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Service Provider</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `Convert ${selectedUser.name} to a service provider using their profile information.`
                : "Select a user first"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {!selectedUser && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user" className="text-right">
                    User
                  </Label>
                  <div className="col-span-3">
                    <Select
                      onValueChange={(value) => {
                        const user = users.find((u) => u.id === Number.parseInt(value))
                        setSelectedUser(user)
                        setFormData({
                          zipcode: user.zipcode || "",
                          location: user.address || "",
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.length > 0 &&
                          users
                            .filter((user) => !user.serviceProvider)
                            .map((user) => (
                              <SelectItem key={user.id} value={user.id.toString()}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="zipcode" className="text-right">
                  Zipcode
                </Label>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="zipcode"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Using user's zipcode"
                    // readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Using user's address"
                    // readOnly
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedUser}>
                Create Service Provider
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

