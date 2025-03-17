"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateUserDetails,uploadfiletoserver } from "@/app/Actions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import { User } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    username: "",
    bio: "",
    address: "",
    city: "",
    country: "",
    province: "",
    zipcode: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    password: "",
    type: "",
    status: "",
    verified: false,
    phoneNo: "",
  })

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)

  const dispatch = useDispatch()
  const data = useSelector((state) => state.CarUser.userDetails)

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        password: "", // Don't populate the password field for security reasons
      })
      setSelectedImage(data.image || null)
    }
  }, [data])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const result = await uploadfiletoserver(file)
        setSelectedImage(result)
        setFormData((prev) => ({ ...prev, image: result }))
      } catch (error) {
        console.error("Error uploading image:", error)
        toast.error("Failed to upload image. Please try again.")
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.")
      return
    }

    const updatedData = {
      ...formData,
      password: newPassword || formData.password,
      image: selectedImage || formData.image,
    }

    try {
      const response = await updateUserDetails(updatedData, dispatch)
      if (response.status === true) {
        console.log("Profile updated successfully:", response)
        toast.success("Profile updated successfully!")
      } else {
        toast.error(response.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
    }
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onClick={handleImageClick}
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 size-52 bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors relative overflow-hidden"
            >
              {selectedImage ? (
                <Image src={selectedImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
              ) : (
                <>
                  <User className="w-16 h-16 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload profile picture</p>
                </>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNo">Phone Number</Label>
                <Input id="phoneNo" name="phoneNo" value={formData.phoneNo} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province/State</Label>
                <Input id="province" name="province" value={formData.province} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipcode">Zip Code</Label>
                <Input id="zipcode" name="zipcode" value={formData.zipcode} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" value={formData.country} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" name="cardName" value={formData.cardName} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Expiry Date</Label>
                <Input
                  id="cardExpiry"
                  name="cardExpiry"
                  placeholder="MM/YY"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardCvc">CVC</Label>
              <Input id="cardCvc" name="cardCvc" value={formData.cardCvc} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Account Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Account Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select account status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="verified"
                name="verified"
                checked={formData.verified}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <Label htmlFor="verified">Verified Account</Label>
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  )
}

