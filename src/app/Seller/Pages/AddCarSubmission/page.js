"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import dynamic from "next/dynamic"
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
})
import { Label } from "@radix-ui/react-label"
import { uploadfiletoserver } from "@/app/Actions"
import { AutocompleteInput } from "./Autocomplete"
import { useSelector } from "react-redux"
import { CarApiAutocompleteInput } from "./AutocompleteBrands"
import { YearAutocompleteInput } from "./AutocompleteYear"
import { ImageUploadDialog } from "./component/Image-Upload-Dialog"
import { ImageGallery } from "./component/Image-Gallery"

export default function ContactForm() {
  const editor = useRef(null)
  const user = useSelector((data) => data.CarUser.userDetails)
  const fullName = user?.name || "" // e.g., "Ali Iftikhar"
  const [firstName, ...rest] = fullName.trim().split(" ")
  const lastName = rest.join(" ") // in case last name has multiple parts

  console.log("First Name:", firstName)
  console.log("Last Name:", lastName)
  const [isTitleChecked, setIsTitleChecked] = useState(false)
  const [isOdoChecked, setIsOdoChecked] = useState(false)

  const handleTitleCheckboxChange = (e) => {
    setIsTitleChecked(e.target.checked)
  }
  const handleOdoCheckboxChange = (e) => {
    setIsOdoChecked(e.target.checked)
  }
  const [loading, setloading] = useState(true)
  const [reserved, setReserved] = useState("False")
  const [buy, setBuy] = useState("False")
  const [categories, setCategories] = useState(["SuperCar", "LuxuryCar"])
  const [bodyTypes, setBodyTypes] = useState(["Metal", "Plastic"])
  const [transmissions, setTransmissions] = useState(["Self", "Manual"])
  const [engineCapacities, setEngineCapacities] = useState(["1200", "1000"])
  const [fuelTypes, setFuelTypes] = useState(["Gas", "Petrol"])
  const [exteriorColors, setExteriorColors] = useState(["Red", "Yellow"])
  const [conditions, setConditions] = useState(["Used", "New"])
  const [brands, setBrands] = useState(["Make"])
  const [models, setModels] = useState([])
  const [years, setYears] = useState([])
  const [files, setFiles] = useState([])
  const [selectBrand, setSelectedBrand] = useState(null)
  const [selectMake, setSelectedMake] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editorContent, setEditorContent] = useState({
    description: "",
    highlights: "",
    notes: "",
  })
  const [isUploading, setIsUploading] = useState(false)
  const [file, setfile] = useState("")

  async function handlePdfUpload(e) {
    if (e.target.files?.[0]) {
      setIsUploading(true)
      try {
        const response = await uploadfiletoserver(e.target.files[0])
        console.log("Response", response)
        const data = await response
        console.log("json data ", data)
        if (data) {
          setfile(data)
          toast.success("PDF uploaded successfully")
        } else {
          toast.error("Failed to upload PDF")
        }
      } catch (error) {
        console.error("Error uploading PDF:", error)
        toast.error("Failed to upload PDF")
      } finally {
        setIsUploading(false)
      }
    }
  }
  useEffect(() => {
    console.log("Selected Make is ", selectBrand)
    const brandmodels = models.filter((data) => data.make_id == selectBrand)
    setModels(brandmodels)
  }, [selectBrand])
  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])
  }

  const fetchBrands = async () => {
    try {
      setloading(true)
      const endpoints2 = [`/api/CarApi/getMakes`, `/api/CarApi/getModels`, `/api/CarApi/getYears`]

      // Fetch all data concurrently
      const responses2 = await Promise.all(endpoints2.map((endpoint) => fetch(endpoint)))

      // Parse all responses as JSON
      const data2 = await Promise.all(responses2.map((response) => response.json()))
      console.log("Data from car api is : ", data2)

      // Update the state with the fetched data
      setBrands(data2[0].data)
      setModels(data2[1].data)
      setYears(data2[2])

      const endpoints = [
        `/api/user/FetchLists/BodyTypes`,
        `/api/user/FetchLists/Categories`,
        `/api/user/FetchLists/Conditions`,
        `/api/user/FetchLists/EngineCapacity`,
        `/api/user/FetchLists/ExteriorColor`,
        `/api/user/FetchLists/FuelType`,
        `/api/user/FetchLists/Transmissions`,
      ]

      // Fetch all data concurrently
      const responses = await Promise.all(endpoints.map((endpoint) => fetch(endpoint)))

      // Parse all responses as JSON
      const data = await Promise.all(responses.map((response) => response.json()))
      setBodyTypes(data[0].bodyType)
      setCategories(data[1].vehiclecategory)
      setConditions(data[2].vehiclecondition)
      setEngineCapacities(data[3].vehicleengineCapacity)
      setExteriorColors(data[4].vehicleexteriorColor)
      setFuelTypes(data[5].vehiclefuelType)
      setTransmissions(data[6].vehicletransmission)

      setloading(false)
    } catch (error) {
      setloading(false)
      toast.error("Failed to fetch brands")
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])
  const handleFileSelect = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const jsonData = Object.fromEntries(formData.entries())

      // Make sure all checkbox values are properly captured (they don't get included in formData.entries() if unchecked)
      jsonData.titles = document.getElementById("titles").checked
      jsonData.odo = document.getElementById("odo").checked

      // Make sure all select values are properly captured
      jsonData.reserved = reserved
      jsonData.buy = buy

      // Add the selected brand and make IDs
      jsonData.brandId = selectBrand
      jsonData.makeId = selectMake

      // Ensure editor content is included
      jsonData.description = editorContent.description || ""
      jsonData.highlights = editorContent.highlights || ""
      jsonData.notes = editorContent.notes || ""

      // Add validation to check for required fields
      const requiredFields = [
        "vehicleMake",
        "vehicleModel",
        "vehicleYear",
        "category",
        "bodyType",
        "transmission",
        "engineCapacity",
        "fuelType",
        "exteriorColor",
        "condition",
        "mileage",
      ]

      const missingFields = requiredFields.filter((field) => !jsonData[field])

      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`)
        setIsSubmitting(false)
        return
      }

      // Make sure firstName and lastName are properly set from the form values
      // or from the user object if the form fields are disabled
      jsonData.firstName = formData.get("firstName") || firstName || ""
      jsonData.lastName = formData.get("lastName") || lastName || ""
      jsonData.sellerId = user.id
      jsonData.email = user.email
      jsonData.phone = user.phoneNo
      // Handle select fields
      jsonData.phoneCode = formData.get("phoneCode")
      jsonData.mileageUnit = formData.get("mileageUnit")
      jsonData.currency = formData.get("currency")
      jsonData.country = formData.get("country")
      jsonData.report_pdf = file

      // Add new fields
      jsonData.category = formData.get("category")
      jsonData.bodyType = formData.get("bodyType")
      jsonData.transmission = formData.get("transmission")
      jsonData.engineCapacity = formData.get("engineCapacity")
      jsonData.fuelType = formData.get("fuelType")
      jsonData.exteriorColor = formData.get("exteriorColor")
      jsonData.condition = formData.get("condition")

      // Add editor content
      // jsonData.description = editorContent.description
      // jsonData.highlights = editorContent.highlights
      // jsonData.notes = editorContent.notes

      const filePromises = files.map(async (file) => {
        const imageUrl = await uploadfiletoserver(file)
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          data: imageUrl,
        }
      })

      jsonData.files = await Promise.all(filePromises)
      console.log("json Data", jsonData)
      // Add this before the fetch call
      console.log("Submitting form data:", jsonData)
      // // Submit the form
      const response = await fetch(`/api/user/submitform`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Your inquiry has been submitted successfully.")
        setFiles([]) // Reset file input
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error("Failed to submit form. Please try again.")
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-8">
        <span className="text-[#B08968]">Contact</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name *
            </label>
            <Input id="firstName" name="firstName" defaultValue={firstName} disabled required />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name *
            </label>
            <Input id="lastName" name="lastName" defaultValue={lastName} disabled required />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail *
            </label>
            <Input id="email" name="email" value={user.email} type="email" required disabled />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone number *
            </label>
            <div className="flex gap-2">
              <Input id="phone" name="phone" value={user.phoneNo} type="tel" disabled required className="flex-1" />
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-[#B08968] ">Vehicle</h3>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label htmlFor="vehicleMake" className="text-sm font-medium">
              Vehicle make *
            </label>
            <CarApiAutocompleteInput options={brands} setSelectedBrand={setSelectedBrand} name="vehicleMake" />
          </div>
          <div className="space-y-2">
            <label htmlFor="vehicleModel" className="text-sm font-medium">
              Vehicle model *
            </label>
            <CarApiAutocompleteInput options={models} setSelectedBrand={setSelectedMake} name="vehicleModel" />
            {/* <Input id="vehicleModel" name="vehicleModel" required /> */}
          </div>

          <div className="space-y-2 col-span-2">
            <label htmlFor="reserved" className="text-sm font-medium">
              Reserved Price*
            </label>
            <div className="flex gap-2">
              <Select name="reserved" defaultValue="False" onValueChange={(value) => setReserved(value)}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="True">Yes</SelectItem>
                  <SelectItem value="False">No</SelectItem>
                </SelectContent>
              </Select>
              {reserved === "True" && (
                <Input id="reservedPrice" placeholder="Enter Amount" name="reservedPrice" required className="flex-1" />
              )}
            </div>
          </div>
          {/* <div className="space-y-2">
            <label htmlFor="vin" className="text-sm font-medium">
              Reserved Price
            </label>
            <Input id="reservedPrice" name="reservedPrice" />
          </div> */}
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label htmlFor="vehicleYear" className="text-sm font-medium">
              Vehicle year *
            </label>
            <YearAutocompleteInput options={years} name="vehicleYear" />
            {/* <Input id="vehicleYear" name="vehicleYear" required /> */}
          </div>
          <div className="space-y-2">
            <label htmlFor="vin" className="text-sm font-medium">
              VIN or Chassis No.
            </label>
            <Input id="vin" name="vin" />
          </div>

          <AutocompleteInput options={categories} name="category" label="Category" required />
          <AutocompleteInput options={bodyTypes} name="bodyType" label="Body Type" required />
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <AutocompleteInput options={transmissions} name="transmission" label="Transmission" required />
          <AutocompleteInput options={engineCapacities} name="engineCapacity" label="Engine Capacity" required />

          <AutocompleteInput options={fuelTypes} name="fuelType" label="Fuel Type" required />
          <AutocompleteInput options={exteriorColors} name="exteriorColor" label="Exterior Color" required />
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <AutocompleteInput options={conditions} name="condition" label="Condition" required />

          <div className="space-y-2">
            <label htmlFor="mileage" className="text-sm font-medium">
              Estimated Mileage *
            </label>
            <div className="flex gap-2">
              <Input id="mileage" name="mileage" required className="flex-1" />
              <Select name="mileageUnit" defaultValue="mi">
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="mi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mi">mi</SelectItem>
                  <SelectItem value="km">km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Bid Start Price
            </label>
            <div className="flex gap-2">
              <Input id="price" name="price" className="flex-1" />
              <Select name="currency" defaultValue="USD">
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="buy" className="text-sm font-medium">
              Buy*
            </label>
            <div className="flex gap-2">
              <Select name="buy" defaultValue="False" onValueChange={(value) => setBuy(value)}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="True">Yes</SelectItem>
                  <SelectItem value="False">No</SelectItem>
                </SelectContent>
              </Select>
              {buy === "True" && (
                <Input id="buyPrice" placeholder="Enter Amount" name="buyPrice" required className="flex-1" />
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Where is the car located?
            </label>
            <Select name="country">
              <SelectTrigger>
                <SelectValue placeholder="Select Country..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="postal" className="text-sm font-medium">
              Postal / Zip Code
            </label>
            <Input id="postal" name="postal" />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label htmlFor="score" className="text-sm font-medium">
              Score
            </label>
            <Input id="score" name="score" type="number" defaultValue={user.score} required />
          </div>

          <div className="space-y-2">
            <label htmlFor="owners" className="text-sm font-medium">
              Owners
            </label>
            <Input id="owners" name="owners" type="number" defaultValue={user.owners} required />
          </div>

          <div className="space-y-2">
            <label htmlFor="acdnt" className="text-sm font-medium">
              Acdnt
            </label>
            <Input id="acdnt" name="acdnt" type="number" defaultValue={user.acdnt} required />
          </div>

          <div className="space-y-2">
            <label htmlFor="titles" className="text-sm font-medium">
              Titles
            </label>
            <div className="flex items-center gap-2">
              <input
                id="titles"
                name="titles"
                type="checkbox"
                className="w-5 h-5"
                checked={isTitleChecked}
                onChange={handleTitleCheckboxChange}
              />
              <span>{isTitleChecked ? "Yes" : "No"}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="odo" className="text-sm font-medium">
              Odo
            </label>
            <div className="flex items-center gap-2">
              <input
                id="odo"
                name="odo"
                type="checkbox"
                className="w-5 h-5"
                checked={isOdoChecked}
                onChange={handleOdoCheckboxChange}
              />
              <span>{isOdoChecked ? "Yes" : "No"}</span>
            </div>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="report_pdf">Vehicle Report PDF</Label>
            <div className="flex flex-row-reverse justify-end gap-3">
              {file && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-fit"
                  onClick={() => window.open(file, "_blank")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-file-text"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" x2="8" y1="13" y2="13" />
                    <line x1="16" x2="8" y1="17" y2="17" />
                    <line x1="10" x2="8" y1="9" y2="9" />
                  </svg>
                  Download Current PDF
                </Button>
              )}

              <div className="flex items-center gap-2 ">
                <Input
                  id="report_pdf"
                  name="report_pdf"
                  type="file"
                  accept=".pdf"
                  disabled={isUploading}
                  onChange={(e) => handlePdfUpload(e)}
                />
                {isUploading && <Loader2 className="animate-spin h-5 w-5" />}
              </div>
            </div>
          </div>
        </div>

        {["description", "highlights", "notes"].map((field) => (
          <div key={field} className="col-span-4">
            <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>

            <JoditEditor
              ref={editor}
              value={editorContent[field]}
              tabIndex={1}
              onBlur={(newContent) => setEditorContent((prev) => ({ ...prev, [field]: newContent }))}
              onChange={() => {}}
            />
          </div>
        ))}

        {/* Replace the existing image upload section with our new components */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Vehicle Images</Label>
            <ImageUploadDialog files={files} setFiles={setFiles} maxFiles={100} />
          </div>

          <ImageGallery files={files} setFiles={setFiles} />
        </div>

        <Button type="submit" className="bg-[#B08968] hover:bg-[#97775A] text-white" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Inquiry"
          )}
        </Button>
      </form>
    </div>
  )
}
