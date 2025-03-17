"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { PencilIcon, TrashIcon, PlusIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { uploadfiletoserver } from "@/app/Actions"

export default function SlideManagement() {
  const [slides, setSlides] = useState([])
  const [filteredSlides, setFilteredSlides] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState(null)

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/slidermanagement`)
      if (!response.ok) throw new Error("Failed to fetch slides")
      const data = await response.json()
      setSlides(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setFilteredSlides(
      slides.filter((slide) =>
        [slide.year.toString(), slide.model, slide.make, slide.link].some((field) =>
          field.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      ),
    )
  }, [slides, searchTerm])

  const handleAddSlide = () => {
    setCurrentSlide(null)
    setIsModalOpen(true)
  }

  const handleUpdateSlide = (slide) => {
    setCurrentSlide(slide)
    setIsModalOpen(true)
  }

  const handleDeleteSlide = async (id) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      setLoadingAction(id)
      try {
        const response = await fetch(`/api/admin/slidermanagement/${id}`, {
          method: "DELETE",
        })
        if (!response.ok) throw new Error("Failed to delete slide")
        setSlides(slides.filter((slide) => slide.id !== id))
        toast.success("Slide deleted successfully")
      } catch (err) {
        toast.error(err.message)
      } finally {
        setLoadingAction(null)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    try {
      setLoadingAction("form")

      // Handle image upload
      const imageFile = formData.get("image")
      let imageUrl = currentSlide?.image // Keep the existing image URL if no new file is selected

      if (imageFile && imageFile.size > 0) {
        try {
          imageUrl = await uploadfiletoserver(imageFile)
        } catch (error) {
          console.error("Error uploading image:", error)
          toast.error("Failed to upload image. Please try again.")
          return
        }
      }

      const slideData = {
        year: formData.get("year"),
        model: formData.get("model"),
        make: formData.get("make"),
        image: imageUrl,
        link: formData.get("link"),
      }

      if (currentSlide) {
        // Update existing slide
        const response = await fetch(`/api/admin/slidermanagement/${currentSlide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slideData),
        })
        if (!response.ok) throw new Error("Failed to update slide")
        await response.json()
        fetchSlides()
        toast.success("Slide updated successfully")
      } else {
        // Add new slide
        const response = await fetch(`/api/admin/slidermanagement`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slideData),
        })
        if (!response.ok) throw new Error("Failed to add slide")
        await response.json()
        fetchSlides()
        toast.success("Slide added successfully")
      }

      setIsModalOpen(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search slides..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddSlide} className="">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{currentSlide ? "Update Slide" : "Add Slide"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium mb-1">
                  Year
                </label>
                <Input id="year" name="year" type="number" defaultValue={currentSlide?.year} required />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium mb-1">
                  Model
                </label>
                <Input id="model" name="model" defaultValue={currentSlide?.model} required />
              </div>
              <div>
                <label htmlFor="make" className="block text-sm font-medium mb-1">
                  Make
                </label>
                <Input id="make" name="make" defaultValue={currentSlide?.make} required />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-1">
                  Image
                </label>
                <Input id="image" name="image" type="file" accept="image/*" />
                {currentSlide?.image && (
                  <img
                    src={currentSlide.image || "/placeholder.svg"}
                    alt="Current slide"
                    className="mt-2 w-full h-32 object-cover rounded"
                  />
                )}
              </div>
              <div>
                <label htmlFor="link" className="block text-sm font-medium mb-1">
                  Link
                </label>
                <Input id="link" name="link" type="url" defaultValue={currentSlide?.link} required />
              </div>
              <Button type="submit" className="w-full" disabled={loadingAction === "form"}>
                {loadingAction === "form" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentSlide ? "Update" : "Add"} Slide
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSlides.map((slide) => (
                <TableRow key={slide.id}>
                  <TableCell>
                    <img
                      src={slide.image || "/placeholder.svg"}
                      alt={`${slide.year} ${slide.make} ${slide.model}`}
                      className="h-20 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>{slide.year}</TableCell>
                  <TableCell>{slide.model}</TableCell>
                  <TableCell>{slide.make}</TableCell>
                  <TableCell>
                    <a
                      href={slide.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {slide.link}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleUpdateSlide(slide)} variant="ghost" size="sm" className="mr-2">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteSlide(slide.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      disabled={loadingAction === slide.id}
                    >
                      {loadingAction === slide.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

