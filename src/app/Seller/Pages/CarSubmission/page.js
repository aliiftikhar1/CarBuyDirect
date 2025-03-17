"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});
import { Eye, Loader, Pencil, PlusIcon, Trash } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import { AutocompleteInput } from "./AutoCompleteInput"
import ContactForm from "@/app/Sell/Form/page"
import Link from "next/link"
import { useSelector } from "react-redux"

export default function AdminCarSubmissions() {
  const user = useSelector((data)=>data.CarUser.userDetails)
  const [categories, setCategories] = useState(["SuperCar", "LuxuryCar"]);
  const [bodyTypes, setBodyTypes] = useState(["Metal", "Plastic"]);
  const [transmissions, setTransmissions] = useState(["Self", "Manual"]);
  const [engineCapacities, setEngineCapacities] = useState(["1200", "1000"]);
  const [fuelTypes, setFuelTypes] = useState(["Gas", "Petrol"]);
  const [exteriorColors, setExteriorColors] = useState(["Red", "Yellow"]);
  const [conditions, setConditions] = useState(["Used", "New"]);
  const [brands, setBrands] = useState(["Make"]);
  const [carSubmissions, setCarSubmissions] = useState([])
  const [isModalOpenSubmission, setIsModalOpenSubmission]=useState(false)
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [filter, setFilter] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [review, setReview] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
    brand: '',
    category: '',
    bodyType: '',
    transmission: '',
    engineCapacity: '',
    fuelType: '',
    exteriorColor: '',
    condition: '',
    reserved:'',
    reservedPrice:''
  })
  const [imageLabels, setImageLabels] = useState({})
  const [loading, setloading] = useState(true)
  async function fetchSubmissions() {

    fetch(`/api/user/carsubmission/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCarSubmissions(data.data)
          // setFilteredSubmissions(data.data)
          setloading(false)
        }
      })
      .catch((error) => console.error("Error fetching car submissions:", error))
  }
  const fetchBrands = async () => {
    try {
      setloading(true);
  
      // Define the API endpoints
      const endpoints = [
        `/api/user/FetchLists/Makes`,
        `/api/user/FetchLists/BodyTypes`,
        `/api/user/FetchLists/Categories`,
        `/api/user/FetchLists/Conditions`,
        `/api/user/FetchLists/EngineCapacity`,
        `/api/user/FetchLists/ExteriorColor`,
        `/api/user/FetchLists/FuelType`,
        `/api/user/FetchLists/Transmissions`,
      ];
  
      // Fetch all data concurrently
      const responses = await Promise.all(endpoints.map((endpoint) => fetch(endpoint)));
  
      // Parse all responses as JSON
      const data = await Promise.all(responses.map((response) => response.json()));
  
      // Update the state with the fetched data
      setBrands(data[0].vehicleMakes);
      setBodyTypes(data[1].bodyType);
      setCategories(data[2].vehiclecategory);
      setConditions(data[3].vehiclecondition);
      setEngineCapacities(data[4].vehicleengineCapacity);
      setExteriorColors(data[5].vehicleexteriorColor);
      setFuelTypes(data[6].vehiclefuelType);
      setTransmissions(data[7].vehicletransmission);
  
      setloading(false);
    } catch (error) {
      setloading(false);
      toast.error('Failed to fetch brands');
    }
  };
  
  useEffect(() => {
    fetchSubmissions();
    fetchBrands();
  }, []);
  

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
      category: submission.category || '',
      bodyType: submission.bodyType || '',
      transmission: submission.transmission || '',
      engineCapacity: submission.engineCapacity || '',
      fuelType: submission.fuelType || '',
      exteriorColor: submission.exteriorColor || '',
      condition: submission.condition || '',
      reserved:submission.reserved || '',
    reservedPrice:submission.reservedPrice || ''
    })
    setIsUpdateDialogOpen(true)
  }

  const handleCloseUpdateDialog = () => {
    setSelectedSubmission(null)
    setReview("")
    setIsUpdateDialogOpen(false)
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageLabelChange = (imageId, label) => {
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
      // console.error('Error updating submission:', error)
      toast.error("Failed to delete")
    }
  }

  const handleUpdateSubmission = async (action) => {
    if (!selectedSubmission) return

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
    return <div className="w-full h-screen flex justify-center items-center"><Loader className="animate-spin" /></div>
  }
  return (
    <div className="p-4">
      <div className="flex justify-between">
      <h1 className="text-2xl font-bold mb-4">Car Submissions </h1>
      <Link href='/Seller/Pages/AddCarSubmission' className="w-24 flex text-white justify-center items-center text-lg font-bold bg-blue-500 rounded-lg">
      Add Car
      </Link>
      </div>
      
      {/* <Input placeholder="Filter Submissions" value={filter} onChange={handleFilterChange} className="mb-4" /> */}
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
                {/* <Button variant="ghost" size="icon" onClick={() => handleOpenUpdateDialog(submission)}>
                  <Pencil className="h-4 w-4" />
                </Button> */}
                {/* <Button variant="ghost" size="icon" onClick={() => handledelete(submission)}>
                  <Trash className="h-4 w-4" />
                </Button> */}
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
                    <Image
                      key={image.id}
                      src={image.data || "/placeholder.svg"}
                      alt={image.name}
                      width={1200}
                      height={1200}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
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
              <AutocompleteInput options={brands} setFormData={setFormData} value={formData.vehicleMake} name="vehicleMake" label="Vehicle Make" required />
              
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Vehicle model</Label>
                  <Input
                    id="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={(e) => handleFormChange("vehicleModel", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label htmlFor="reserved" className="text-sm font-medium">
              Reserved Price*
            </label>
            <div className="flex gap-2">
              <Input id="reservedPrice" value={formData.reservedPrice} onChange={(e) => handleFormChange("reservedPrice", e.target.value)} placeholder='Enter Amount' name="reservedPrice" required className="flex-1" />
              <Select name="reserved" defaultValue={formData.reserved==true?'True':'False'} onChange={(e) => handleFormChange("reserved", e.target.value)}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='True'>Yes</SelectItem>
                  <SelectItem value='False'>No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* <div className="space-y-2">
            <label htmlFor="vin" className="text-sm font-medium">
              Reserved Price
            </label>
            <Input id="reservedPrice" name="reservedPrice" />
          </div> */}
        </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear">Vehicle year</Label>
                  <Input
                    id="vehicleYear"
                    value={formData.vehicleYear}
                    onChange={(e) => handleFormChange("vehicleYear", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN or Chassis No.</Label>
                  <Input id="vin" value={formData.vin} onChange={(e) => handleFormChange("vin", e.target.value)} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <AutocompleteInput options={categories} setFormData={setFormData} value={formData.category} name="category" label="Category" required />
                <AutocompleteInput options={bodyTypes} setFormData={setFormData} value={formData.bodyType} name="bodyType" label="Body Type" required />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <AutocompleteInput options={transmissions} setFormData={setFormData} value={formData.transmission} name="transmission" label="Transmission" required />
                <AutocompleteInput options={engineCapacities} setFormData={setFormData} value={formData.engineCapacity} name="engineCapacity" label="Engine Capacity" required />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <AutocompleteInput options={fuelTypes} setFormData={setFormData} value={formData.fuelType} name="fuelType" label="Fuel Type" required />
                <AutocompleteInput options={exteriorColors} setFormData={setFormData} value={formData.exteriorColor} name="exteriorColor" label="Exterior Color" required />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <AutocompleteInput options={conditions} setFormData={setFormData} value={formData.condition} name="condition" label="Condition" required />
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
                  <Label htmlFor="price">Expected Price</Label>
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
                    onChange={() => { }}
                  />
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="review">Admin Review</Label>
                <Textarea id="review" value={review} onChange={(e) => setReview(e.target.value)} rows={4} />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Images</h2>
                <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-auto">
                  {selectedSubmission.SubmissionImages.map((image) => (
                    <div key={image.id} className="space-y-2">
                      <Image
                        src={image.data || "/placeholder.svg"}
                        alt={image.name}
                        width={1200}
                        height={1200}
                        className="w-full h-auto rounded-lg shadow-md"
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
                <Button onClick={() => handleUpdateSubmission("reject")} variant="destructive">
                  Reject
                </Button>
                <Button onClick={() => handleUpdateSubmission("approve")} variant="default">
                  Approve
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleCloseUpdateDialog} variant="outline">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

