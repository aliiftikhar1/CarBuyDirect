"use client"

import { useState, useEffect } from "react"
import { Loader } from "lucide-react"
import { toast } from "sonner"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AuctionCard from "./AuctionCard"
import AuctionSkeletonList from "../components/AuctionSkeletonList"

export default function Auction() {
  const [loading, setloading] = useState(false)
  const [auctionItems, setAuctionItems] = useState([])
  const [watch, setwatch] = useState([])
  const [categories, setCategories] = useState(["SuperCar", "LuxuryCar"])
  const [bodyTypes, setBodyTypes] = useState(["Metal", "Plastic"])
  const [transmissions, setTransmissions] = useState(["Self", "Manual"])
  const [engineCapacities, setEngineCapacities] = useState(["1200", "1000"])
  const [fuelTypes, setFuelTypes] = useState(["Gas", "Petrol"])
  const [exteriorColors, setExteriorColors] = useState(["Red", "Yellow"])
  const [conditions, setConditions] = useState(["Used", "New"])
  const [brands, setBrands] = useState(["Make"])
  const [loadingAction, setloadingAction] = useState("default")
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    brandIds: [],
    categories: [],
    bodyTypes: [],
    transmissions: [],
    engineCapacities: [],
    fuelTypes: [],
    exteriorColors: [],
    conditions: [],
    sortBy: "relevant",
  })
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false)
  const [filteredItems, setFilteredItems] = useState([])

  function changeLoadingAction(value) {
    setloadingAction(value)
  }
  const fetchBrands = async () => {
    try {
      // setloading(true)

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
      ]

      // Fetch all data concurrently
      const responses = await Promise.all(endpoints.map((endpoint) => fetch(endpoint)))

      // Parse all responses as JSON
      const data = await Promise.all(responses.map((response) => response.json()))

      // Update the state with the fetched data
      setBrands(data[0].vehicleMakes)
      setBodyTypes(data[1].bodyType)
      setCategories(data[2].vehiclecategory)
      setConditions(data[3].vehiclecondition)
      setEngineCapacities(data[4].vehicleengineCapacity)
      setExteriorColors(data[5].vehicleexteriorColor)
      setFuelTypes(data[6].vehiclefuelType)
      setTransmissions(data[7].vehicletransmission)

      setloading(false)
    } catch (error) {
      setloading(false)
      toast.error("Failed to fetch brands")
    }
  }

  async function GetAuctions() {
    try {
      setloading(true)
      const response = await fetch(`/api/user/FetchAuctions/all/1`)
      const data = await response.json()
      setAuctionItems(data.data)
      fetchWatch()
      setloading(false)
    } catch (error) {
      toast.error("Failed to fetch auctions")
    }
  }

  async function fetchWatch() {
    try {
      setloading(true)
      const response = await fetch(`/api/user/watch/all/1`)
      const data = await response.json()
      setwatch(data.data)
      setloading(false)
    } catch (error) {
      toast.error("Failed to fetch auctions")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await GetAuctions()
      await fetchBrands()
    }
    fetchData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [auctionItems, filters])

  const applyFilters = () => {
    const filtered = auctionItems.filter((item) => {
      const price = Number.parseFloat(item.CarSubmission.price)
      if (filters.minPrice && price < Number.parseFloat(filters.minPrice)) return false
      if (filters.maxPrice && price > Number.parseFloat(filters.maxPrice)) return false
      if (
        filters.brandIds.length > 0 &&
        item.CarSubmission.Brand &&
        !filters.brandIds.includes(item.CarSubmission.vehicleMake)
      )
        return false
      if (filters.categories.length > 0 && !filters.categories.includes(item.CarSubmission.category)) return false
      if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(item.CarSubmission.bodyType)) return false
      if (filters.transmissions.length > 0 && !filters.transmissions.includes(item.CarSubmission.transmission))
        return false
      if (filters.engineCapacities.length > 0 && !filters.engineCapacities.includes(item.CarSubmission.engineCapacity))
        return false
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(item.CarSubmission.fuelType)) return false
      if (filters.exteriorColors.length > 0 && !filters.exteriorColors.includes(item.CarSubmission.exteriorColor))
        return false
      if (filters.conditions.length > 0 && !filters.conditions.includes(item.CarSubmission.condition)) return false
      return true
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case "ending-soon":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        case "price-low":
          return Number.parseFloat(a.CarSubmission.price) - Number.parseFloat(b.CarSubmission.price)
        case "price-high":
          return Number.parseFloat(b.CarSubmission.price) - Number.parseFloat(a.CarSubmission.price)
        default:
          return 0
      }
    })

    setFilteredItems(sorted)
  }

  const handleBrandFilter = (brandId) => {
    setFilters((prev) => ({
      ...prev,
      brandIds: prev.brandIds.includes(brandId)
        ? prev.brandIds.filter((id) => id !== brandId)
        : [...prev.brandIds, brandId],
    }))
  }

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }))
  }

  const handlePriceChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const displayedItems = filteredItems.length > 0 ? filteredItems : auctionItems

  return (
    <div className="px-4 md:px-6 py-16 md:py-20 flex flex-col lg:flex-row gap-6">
      <div className="lg:hidden ">
        <Button onClick={() => setMobileFiltersVisible(!mobileFiltersVisible)}>
          {mobileFiltersVisible ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>
      {/* Filters Sidebar */}
      <div className={`${mobileFiltersVisible ? "block" : "hidden"} lg:flex lg:flex-col w-full lg:w-64 space-y-4`}>
        <Accordion type="single" collapsible className="w-full" defaultValue="">
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="min-price">Min Price</Label>
                  <Input
                    id="min-price"
                    placeholder="$0"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max-price">Max Price</Label>
                  <Input
                    id="max-price"
                    placeholder="$1000"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="brands">
            <AccordionTrigger>Brands</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`brand-${brand}`}
                      checked={filters.brandIds.includes(brand)}
                      onChange={() => handleBrandFilter(brand)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`brand-${brand}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onChange={() => handleFilterChange("categories", category)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="bodyTypes">
            <AccordionTrigger>Body Types</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {bodyTypes.map((bodyType) => (
                  <div key={bodyType} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`bodyType-${bodyType}`}
                      checked={filters.bodyTypes.includes(bodyType)}
                      onChange={() => handleFilterChange("bodyTypes", bodyType)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`bodyType-${bodyType}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {bodyType}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="transmissions">
            <AccordionTrigger>Transmissions</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {transmissions.map((transmission) => (
                  <div key={transmission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`transmission-${transmission}`}
                      checked={filters.transmissions.includes(transmission)}
                      onChange={() => handleFilterChange("transmissions", transmission)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`transmission-${transmission}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {transmission}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="engineCapacities">
            <AccordionTrigger>Engine Capacities</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {engineCapacities.map((engineCapacity) => (
                  <div key={engineCapacity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`engineCapacity-${engineCapacity}`}
                      checked={filters.engineCapacities.includes(engineCapacity)}
                      onChange={() => handleFilterChange("engineCapacities", engineCapacity)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`engineCapacity-${engineCapacity}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {engineCapacity}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="fuelTypes">
            <AccordionTrigger>Fuel Types</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {fuelTypes.map((fuelType) => (
                  <div key={fuelType} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`fuelType-${fuelType}`}
                      checked={filters.fuelTypes.includes(fuelType)}
                      onChange={() => handleFilterChange("fuelTypes", fuelType)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`fuelType-${fuelType}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {fuelType}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="exteriorColors">
            <AccordionTrigger>Exterior Colors</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {exteriorColors.map((exteriorColor) => (
                  <div key={exteriorColor} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`exteriorColor-${exteriorColor}`}
                      checked={filters.exteriorColors.includes(exteriorColor)}
                      onChange={() => handleFilterChange("exteriorColors", exteriorColor)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`exteriorColor-${exteriorColor}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {exteriorColor}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="conditions">
            <AccordionTrigger>Conditions</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {conditions.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`condition-${condition}`}
                      checked={filters.conditions.includes(condition)}
                      onChange={() => handleFilterChange("conditions", condition)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`condition-${condition}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            setFilters({
              minPrice: "",
              maxPrice: "",
              brandIds: [],
              categories: [],
              bodyTypes: [],
              transmissions: [],
              engineCapacities: [],
              fuelTypes: [],
              exteriorColors: [],
              conditions: [],
              sortBy: "relevant",
            })
          }
        >
          Clear Filters
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-4 ">
        <div className="flex items-center justify-between mb-6 bg-white z-30 py-4">
          <p className="text-sm text-muted-foreground">{displayedItems.filter((item)=>item.status==='Live').length} results found</p>
          <Select value={filters.sortBy} onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevant">Most Relevant</SelectItem>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
              <SelectItem value="price-low">Lowest Price</SelectItem>
              <SelectItem value="price-high">Highest Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 relative">
          {loading && loadingAction === "default" && <AuctionSkeletonList/>}
          {displayedItems.filter((item)=>item.status==='Live').map((item) => (
            <AuctionCard
              key={item.id}
              item={item}
              watchdata={watch}
              OnWatch={GetAuctions}
              setloadingAction={changeLoadingAction}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

