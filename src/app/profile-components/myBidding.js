'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateUserDetails } from "../Actions"
import { toast } from "sonner"

export default function MyBiddingSection() {
  const [formdata, setFormData] = useState({
    id:'',
    address: "",
    city: "",
    country: "",
    province: "",
    zipcode: "",
  })
  const data = useSelector((state) => state.CarUser?.userDetails)
  const dispatch = useDispatch()

  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id||'',
        address: data.address || "",
        city: data.city || "",
        country: data.country || "",
        province: data.province || "",
        zipcode: data.zipcode || "",
      })
    }
  }, [data])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await updateUserDetails(formdata, dispatch)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
    }
  }

  return (
    <div className="w-full mt-8">
      <h2 className="text-3xl font-semibold mb-2">
        My <span className="text-[#B08968]">Bidding</span> Details
      </h2>
      <p className="text-muted-foreground mb-8">Manage your bidding details from here</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <Input
            id="address"
            value={formdata.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className="w-full"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              City
            </label>
            <Input
              id="city"
              value={formdata.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">
              Country
            </label>
            <Select
              value={formdata.country||data?.country}
              onValueChange={(value) => handleSelectChange("country", value)}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="province" className="text-sm font-medium">
              State / Province
            </label>
            <Input
              id="province"
              value={formdata.province}
              onChange={handleChange}
              placeholder="Enter state or province"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="zipcode" className="text-sm font-medium">
              Postal / Zip code
            </label>
            <Input
              id="zipcode"
              value={formdata.zipcode}
              onChange={handleChange}
              placeholder="Enter postal or zip code"
              className="w-full"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="secondary"
          className="bg-muted/60 hover:bg-muted"
        >
          Save changes
        </Button>
      </form>
    </div>
  )
}
