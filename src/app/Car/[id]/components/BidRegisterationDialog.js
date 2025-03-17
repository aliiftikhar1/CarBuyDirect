"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { updateUserDetails } from "@/app/Actions";

export default function BidRegistrationForm({setHandler,setIsDialogOpen}) {
  const userdetails = useSelector((data) => data.CarUser.userDetails);
 const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    id : userdetails?.id || "",
    username: userdetails?.username || "",
    cardName: userdetails?.cardName || "",
    phoneNo: userdetails?.phoneNo || "",
    address: userdetails?.address || "",
    city: userdetails?.city || "",
    country: userdetails?.country || "Pakistan",
    province: userdetails?.province || "",
    zipcode: userdetails?.zipcode || "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await updateUserDetails(formData,dispatch);
console.log("Response is",response)
      if (response.status) {
        // const data = await response.json();
        console.log("Form submitted successfully", response);

        toast.success("Form submitted successfully!");
        setHandler((prev) => !prev);
        setIsDialogOpen((prev) => !prev);
      } else {
        console.error("Failed to submit form");
        toast.error("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <Card className="w-full relative border-none shadow-none p-0">
      <CardHeader className="space-y-6 pb-0">
        <div className="text-center ">
          <Image
            src="/logo/1.png"
            alt="SBX Cars"
            width={1200}
            height={1200}
            className="mx-auto w-full h-24 object-cover "
          />
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-xl">Register To Bid</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                className="mt-1.5"
                defaultValue={formData.username}
                onChange={handleInputChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Your username that will be publicly displayed alongside your bids.
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <Input
            id="cardName"
            placeholder="Card Name"
            defaultValue={formData.cardName}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-3 gap-2">
            <Input
              id="cardNumber"
              placeholder="Card Number"
              onChange={handleInputChange}
            />
            <Input
              id="cardExpiry"
              placeholder="MM / YY"
              onChange={handleInputChange}
            />
            <Input id="cardCvc" placeholder="CVC" onChange={handleInputChange} />
          </div>

          <div className="w-full gap-2">
            <Input
              id="phoneNo"
              placeholder="Phone Number"
              defaultValue={formData.phoneNo}
              onChange={handleInputChange}
            />
          </div>

          <Input
            id="address"
            placeholder="Address"
            defaultValue={formData.address}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-[1.5fr_1fr] gap-2">
            <Input
              id="city"
              placeholder="City"
              defaultValue={formData.city}
              onChange={handleInputChange}
            />
            <Select
              defaultValue={formData.country}
              onValueChange={(value) => handleSelectChange("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pakistan">Pakistan</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[1.5fr_1fr] gap-2">
            <Input
              id="province"
              placeholder="State / Province"
              defaultValue={formData.province}
              onChange={handleInputChange}
            />
            <Input
              id="zipcode"
              placeholder="Postal / Zip code"
              defaultValue={formData.zipcode}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={handleSubmit}>
          Register to bid
        </Button>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Guaranteed safe & secure checkout</span>
        </div>
      </CardContent>
    </Card>
  );
}
