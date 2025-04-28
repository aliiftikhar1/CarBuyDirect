"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
})
import { Eye, Loader, Pencil, Trash } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import { AutocompleteInput } from "./AutoCompleteInput"
import { YearAutocompleteInput } from "./AutocompleteYear"
import { CarApiAutocompleteInput } from "./AutocompleteBrands"
import { uploadfiletoserver } from "@/app/Actions"

export default function AdminCarSubmissions() {
  const [buy, setBuy] = useState("False")
  const [models, setModels] = useState([])
  const [years, setYears] = useState([])
  const [categories, setCategories] = useState(["SuperCar", "LuxuryCar"])
  const [bodyTypes, setBodyTypes] = useState(["Metal", "Plastic"])
  const [transmissions, setTransmissions] = useState(["Self", "Manual"])
  const [engineCapacities, setEngineCapacities] = useState(["1200", "1000"])
  const [fuelTypes, setFuelTypes] = useState(["Gas", "Petrol"])
  const [exteriorColors, setExteriorColors] = useState(["Red", "Yellow"])
  const [conditions, setConditions] = useState(["Used", "New"])
  const [brands, setBrands] = useState(["Make"])
  const [carSubmissions, setCarSubmissions] = useState([])
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [filter, setFilter] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [review, setReview] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTitleChecked, setIsTitleChecked] = useState(false)
  const [isOdoChecked, setIsOdoChecked] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [file, setfile] = useState("")

  async function handlePdfUpload(e) {
    if (e.target.files?.[0]) {
      setIsUploading(true)
      try {
        const response = await uploadfiletoserver(e.target.files[0])
        const data = await response
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

  const handleTitleCheckboxChange = (e) => {
    setIsTitleChecked(e.target.checked)
    setFormData((prev) => ({ ...prev, titles: e.target.checked }))
  }

  const handleOdoCheckboxChange = (e) => {
    setIsOdoChecked(e.target.checked)
    setFormData((prev) => ({ ...prev, odo: e.target.checked }))
  }

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vin: "",
    mileage: "",
    mileageUnit: "mi",
    price: "",
    currency: "USD",
    country: "",
    postal: "",
    description: "",
    highlights: "",
    notes: "",
    brand: "",
    category: "",
    bodyType: "",
    transmission: "",
    engineCapacity: "",
    fuelType: "",
    exteriorColor: "",
    condition: "",
    reserved: "",
    reservedPrice: "",
    webSlug: "",
    buy: "False",
    buyPrice: "",
    score: "",
    owners: "",
    acdnt: "",
    titles: false,
    odo: false,
  })

  const [imageLabels, setImageLabels] = useState({})
  const [loading, setloading] = useState(true)

  useEffect(() => {
    if (formData.buy === "True") {
      // Handle buy price logic if needed
    }
  }, [formData])

  async function fetchSubmissions() {
    fetch(`/api/admin/carsubmissions/all/1`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Fetched car submissions:", data.data)
          setCarSubmissions(data.data)
          setloading(false)
        }
      })
      .catch((error) => console.error("Error fetching car submissions:", error))
  }

  const fetchBrands = async () => {
    try {
      setloading(true)
      const endpoints2 = [`/api/CarApi/getMakes`, `/api/CarApi/getModels`, `/api/CarApi/getYears`]
      const responses2 = await Promise.all(endpoints2.map((endpoint) => fetch(endpoint)))
      const data2 = await Promise.all(responses2.map((response) => response.json()))

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

      const responses = await Promise.all(endpoints.map((endpoint) => fetch(endpoint)))
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
    fetchSubmissions()
    fetchBrands()
  }, [])

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase()
    setFilter(value)
    const filtered = carSubmissions.filter(
      (submission) =>
        submission.vehicleMake.toLowerCase().includes(value) ||
        submission.vehicleModel.toLowerCase().includes(value) ||
        submission.status.toLowerCase().includes(value) ||
        submission.vin.toLowerCase().includes(value),
    )
    setFilteredSubmissions(filtered)
  }

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission)
    setIsViewDialogOpen(true)
  }

  const handleCloseViewDialog = () => {
    setSelectedSubmission(null)
    setIsViewDialogOpen(false)
  }

  const handleOpenUpdateDialog = (submission) => {
    setSelectedSubmission(submission)
    setReview(submission.review || "")
    setIsTitleChecked(submission.titles === true)
    setIsOdoChecked(submission.odo === true)
    setfile(submission.pdfUrl || "")
    // Initialize image labels
    const initialLabels = {}
    submission.SubmissionImages.forEach((image) => {
      initialLabels[image.id] = image.label || "other"
    })
    setImageLabels(initialLabels)
    setFormData({
      firstname: submission.firstname || "",
      lastname: submission.lastname || "",
      email: submission.email || "",
      phone: submission.phone || "",
      vehicleMake: submission.vehicleMake || "",
      vehicleModel: submission.vehicleModel || "",
      vehicleYear: submission.vehicleYear || "",
      vin: submission.vin || "",
      mileage: submission.mileage || "",
      mileageUnit: submission.mileageUnit || "mi",
      price: submission.price || "",
      currency: submission.currency || "USD",
      country: submission.country || "",
      postal: submission.postal || "",
      description: submission.description || "",
      highlights: submission.highlights || "",
      notes: submission.notes || "",
      brand: submission.brand || "",
      category: submission.category || "",
      bodyType: submission.bodyType || "",
      transmission: submission.transmission || "",
      engineCapacity: submission.engineCapacity || "",
      fuelType: submission.fuelType || "",
      exteriorColor: submission.exteriorColor || "",
      condition: submission.condition || "",
      reserved: submission.reserved === true ? "True" : "False" || "",
      reservedPrice: submission.reservedPrice || "",
      webSlug: submission.webSlug || "",
      buy: submission.buy === true ? "True" : "False" || "False",
      buyPrice: submission.buyPrice || "",
      score: submission.score || "",
      owners: submission.owners || "",
      acdnt: submission.acdnt || "",
      titles: submission.titles || false,
      odo: submission.odo || false,
      pdfUrl: submission.pdfUrl || "",
    })
    setIsUpdateDialogOpen(true)
  }

  const handleCloseUpdateDialog = () => {
    setSelectedSubmission(null)
    setReview("")
    setImageLabels({})
    setIsUpdateDialogOpen(false)
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageLabelChange = (imageId, label) => {
    // Check existing labels to enforce one portrait and one horizontal
    const currentLabels = { ...imageLabels }
    const portraitCount = Object.values(currentLabels).filter((l) => l === "portrait").length
    const horizontalCount = Object.values(currentLabels).filter((l) => l === "horizontal").length

    if (label === "portrait" && portraitCount >= 1 && currentLabels[imageId] !== "portrait") {
      toast.error("Only one image can be labeled as Portrait")
      return
    }
    if (label === "horizontal" && horizontalCount >= 1 && currentLabels[imageId] !== "horizontal") {
      toast.error("Only one image can be labeled as Horizontal")
      return
    }

    setImageLabels((prev) => ({
      ...prev,
      [imageId]: label,
    }))
  }

  const handledelete = async (submission) => {
    if (!submission) return
    try {
      const response = await fetch(`/api/admin/carsubmissions/${submission.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Submission deleted successfully`)
        fetchSubmissions()
        handleCloseUpdateDialog()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  const handleUpdateSubmission = async (action) => {
    if (!selectedSubmission || isUploading) return

    try {
      const response = await fetch(`/api/admin/carsubmissions/${selectedSubmission.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action === "approve" ? "Approved" : "Rejected",
          review,
          ...formData,
          pdfUrl: file,
          imageLabels,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Submission ${action}d successfully`)
        fetchSubmissions()
        handleCloseUpdateDialog()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Error updating submission:", error)
      toast.error("Failed to update submission")
    }
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Car Submissions </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Vehicle Make</TableHead>
            <TableHead>Vehicle Model</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>VIN</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carSubmissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>{submission.id}</TableCell>
              <TableCell>{submission.vehicleMake}</TableCell>
              <TableCell>{submission.vehicleModel}</TableCell>
              <TableCell>{submission.vehicleYear}</TableCell>
              <TableCell>{submission.vin}</TableCell>
              <TableCell>{submission.status}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleViewDetails(submission)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleOpenUpdateDialog(submission)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handledelete(submission)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for Viewing Submission Details */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4 max-h-[80vh] overflow-auto">
              <div>
                <h2 className="text-xl font-semibold mb-2">Vehicle Details</h2>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Make</TableCell>
                      <TableCell>{selectedSubmission.vehicleMake}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Model</TableCell>
                      <TableCell>{selectedSubmission.vehicleModel}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Year</TableCell>
                      <TableCell>{selectedSubmission.vehicleYear}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">VIN</TableCell>
                      <TableCell>{selectedSubmission.vin}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Status</TableCell>
                      <TableCell>{selectedSubmission.status}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Price</TableCell>
                      <TableCell>
                        {selectedSubmission.price} {selectedSubmission.currency}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Mileage</TableCell>
                      <TableCell>
                        {selectedSubmission.mileage} {selectedSubmission.mileageUnit}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Seller Details</h2>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Name</TableCell>
                      <TableCell>
                        {selectedSubmission.firstname} {selectedSubmission.lastname}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Email</TableCell>
                      <TableCell>{selectedSubmission.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Phone</TableCell>
                      <TableCell>{selectedSubmission.phone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Country</TableCell>
                      <TableCell>{selectedSubmission.country}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Zipcode</TableCell>
                      <TableCell>{selectedSubmission.postal}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Images</h2>
                <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-auto">
                  {selectedSubmission.SubmissionImages.map((image) => (
                    <div key={image.id} className="relative">
                      <Image
                        src={image.data || "/placeholder.svg"}
                        alt={image.name || "Car Image"}
                        width={300}
                        height={200}
                        className="w-full h-auto rounded-lg shadow-md object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        {imageLabels[image.id] || image.label || "Other"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <div
                  id="description"
                  className="mt-1 p-2 border rounded-md"
                  dangerouslySetInnerHTML={{ __html: selectedSubmission.description }}
                />
              </div>

              <div>
                <Label htmlFor="highlights">Highlights</Label>
                <div
                  id="highlights"
                  className="mt-1 p-2 border rounded-md"
                  dangerouslySetInnerHTML={{ __html: selectedSubmission.highlights }}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <div
                  id="notes"
                  className="mt-1 p-2 border rounded-md"
                  dangerouslySetInnerHTML={{ __html: selectedSubmission.notes }}
                />
              </div>

              {selectedSubmission.review && (
                <div>
                  <Label htmlFor="review">Admin Review</Label>
                  <div id="review" className="mt-1 p-2 border rounded-md">
                    {selectedSubmission.review}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleCloseViewDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Submission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    value={formData.firstname}
                    onChange={(e) => handleFormChange("firstname", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    value={formData.lastname}
                    onChange={(e) => handleFormChange("lastname", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <CarApiAutocompleteInput
                  options={brands}
                  value={formData.vehicleMake}
                  onChange={(e) => handleFormChange("vehicleMake", e.target.value)}
                  name="vehicleMake"
                />
                <CarApiAutocompleteInput
                  options={models}
                  value={formData.vehicleModel}
                  onChange={(e) => handleFormChange("vehicleModel", e.target.value)}
                  name="vehicleModel"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="reserved" className="text-sm font-medium">
                    Reserved Price*
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="reservedPrice"
                      value={formData.reservedPrice}
                      onChange={(e) => handleFormChange("reservedPrice", e.target.value)}
                      placeholder="Enter Amount"
                      name="reservedPrice"
                      required
                      className="flex-1"
                    />
                    <Select
                      name="reserved"
                      defaultValue={formData.reserved === "True" ? "True" : "False"}
                      onValueChange={(value) => handleFormChange("reserved", value)}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="No" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="True">Yes</SelectItem>
                        <SelectItem value="False">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="webSlug" className="text-sm font-medium">
                    Web Slug
                  </label>
                  <Input
                    id="webSlug"
                    name="webSlug"
                    value={formData.webSlug}
                    onChange={(e) => handleFormChange("webSlug", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <YearAutocompleteInput
                  options={years}
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={(e) => handleFormChange("vehicleYear", e.target.value)}
                />
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN or Chassis No.</Label>
                  <Input id="vin" value={formData.vin} onChange={(e) => handleFormChange("vin", e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <AutocompleteInput
                  options={categories}
                  setFormData={setFormData}
                  value={formData.category}
                  name="category"
                  label="Category"
                  required
                />
                <AutocompleteInput
                  options={bodyTypes}
                  setFormData={setFormData}
                  value={formData.bodyType}
                  name="bodyType"
                  label="Body Type"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <AutocompleteInput
                  options={transmissions}
                  setFormData={setFormData}
                  value={formData.transmission}
                  name="transmission"
                  label="Transmission"
                  required
                />
                <AutocompleteInput
                  options={engineCapacities}
                  setFormData={setFormData}
                  value={formData.engineCapacity}
                  name="engineCapacity"
                  label="Engine Capacity"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <AutocompleteInput
                  options={fuelTypes}
                  setFormData={setFormData}
                  value={formData.fuelType}
                  name="fuelType"
                  label="Fuel Type"
                  required
                />
                <AutocompleteInput
                  options={exteriorColors}
                  setFormData={setFormData}
                  value={formData.exteriorColor}
                  name="exteriorColor"
                  label="Exterior Color"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <AutocompleteInput
                  options={conditions}
                  setFormData={setFormData}
                  value={formData.condition}
                  name="condition"
                  label="Condition"
                  required
                />
                <div className="space-y-2">
                  <label htmlFor="buy" className="text-sm font-medium">
                    Buy*
                  </label>
                  <div className="flex gap-2">
                    <Select
                      name="buy"
                      value={formData.buy}
                      defaultValue={formData.buy}
                      onValueChange={(value) => handleFormChange("buy", value)}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="No" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="True">Yes</SelectItem>
                        <SelectItem value="False">No</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.buy === "True" && (
                      <Input
                        id="buyPrice"
                        placeholder="Enter Amount"
                        name="buyPrice"
                        value={formData.buyPrice}
                        onChange={(e) => handleFormChange("buyPrice", e.target.value)}
                        required
                        className="flex-1"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mileage">Estimated Mileage</Label>
                  <div className="flex gap-2">
                    <Input
                      id="mileage"
                      value={formData.mileage}
                      onChange={(e) => handleFormChange("mileage", e.target.value)}
                      className="flex-1"
                    />
                    <Select
                      value={formData.mileageUnit}
                      onValueChange={(value) => handleFormChange("mileageUnit", value)}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mi">mi</SelectItem>
                        <SelectItem value="km">km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Bid Start Price</Label>
                  <div className="flex gap-2">
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleFormChange("price", e.target.value)}
                      className="flex-1"
                    />
                    <Select value={formData.currency} onValueChange={(value) => handleFormChange("currency", value)}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country">Where is the car located?</Label>
                  <Select value={formData.country} onValueChange={(value) => handleFormChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal">Postal / Zip Code</Label>
                  <Input
                    id="postal"
                    value={formData.postal}
                    onChange={(e) => handleFormChange("postal", e.target.value)}
                  />
                </div>
              </div>

              {["description", "highlights", "notes"].map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <JoditEditor
                    value={formData[field]}
                    onBlur={(newContent) => handleFormChange(field, newContent)}
                    onChange={() => {}}
                  />
                </div>
              ))}

              <div className="grid md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label htmlFor="score" className="text-sm font-medium">
                    Score
                  </label>
                  <Input
                    id="score"
                    name="score"
                    type="number"
                    value={formData.score}
                    onChange={(e) => handleFormChange("score", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="owners" className="text-sm font-medium">
                    Owners
                  </label>
                  <Input
                    id="owners"
                    name="owners"
                    type="number"
                    value={formData.owners}
                    onChange={(e) => handleFormChange("owners", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="acdnt" className="text-sm font-medium">
                    Acdnt
                  </label>
                  <Input
                    id="acdnt"
                    name="acdnt"
                    type="number"
                    value={formData.acdnt}
                    onChange={(e) => handleFormChange("acdnt", e.target.value)}
                    required
                  />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="report_pdf">Vehicle Report PDF</Label>
                <div className="flex flex-col gap-3">
                  {(selectedSubmission.pdfUrl || file) && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 w-fit"
                      onClick={() => window.open(selectedSubmission.pdfUrl || file, "_blank")}
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
                  <div className="flex items-center gap-2">
                    <Input
                      id="report_pdf"
                      name="report_pdf"
                      type="file"
                      accept=".pdf"
                      disabled={isUploading}
                      onChange={(e) => handlePdfUpload(e)}
                    />
                    {isUploading && <Loader className="animate-spin h-5 w-5" />}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review">Admin Review</Label>
                <Textarea id="review" value={review} onChange={(e) => setReview(e.target.value)} rows={4} />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Images</h2>{selectedSubmission.SubmissionImages.length}
                <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-auto">
                  {selectedSubmission.SubmissionImages.map((image) => (
                    <div key={image.id} className="space-y-2 relative">
                      <Image
                        src={image.data || "/placeholder.svg"}
                        alt={image.name || "Car Image"}
                        width={300}
                        height={200}
                        className="w-full h-auto rounded-lg shadow-md object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                      <Select
                        value={imageLabels[image.id] || "other"}
                        onValueChange={(value) => handleImageLabelChange(image.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select label" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">Portrait</SelectItem>
                          <SelectItem value="horizontal">Horizontal</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button onClick={() => handleUpdateSubmission("reject")} variant="destructive" disabled={isUploading}>
                  Reject
                </Button>
                <Button onClick={() => handleUpdateSubmission("approve")} variant="default" disabled={isUploading}>
                  Approve
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleCloseUpdateDialog} variant="outline" disabled={isUploading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}