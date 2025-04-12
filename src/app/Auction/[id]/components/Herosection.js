"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, ChevronLeft, ChevronRight, Check, CircleMinus, CirclePlus, Info, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistance } from "date-fns"
import { useSelector } from "react-redux"

import OverviewSection from "./OverView"
import TabsSection from "./TabsSection"
import BidRegistrationForm from "./BidRegisterationDialog"
import BidLogin from "@/app/components/BidLogin"
import Comments from "./Comments"
import BidModal from "@/app/components/BidModal"
import { toast } from "sonner"
import BiddingType from "./BiddingType"
import EndAuctionTimerComponent from "@/app/components/EndAuctionCountDownTimer"

export default function HeroSection({ data, triggerfetch, trigger }) {
  const images = data.CarSubmission.SubmissionImages || []
  const [isBidDetailOpen, setIsBidDetailOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0)
  const [visibleThumbnails, setVisibleThumbnails] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [currentBid, setCurrentBid] = useState(
    Number.parseInt(data?.Bids[0]?.price) || Number.parseInt(data?.CarSubmission?.price) || 0,
  )
  const [bidAmount, setBidAmount] = useState(Number.parseInt(currentBid) + 100)
  const [bids, setBids] = useState(data?.Bids?.length || 0)
  const userid = useSelector((state) => state.CarUser.userDetails?.id)
  const userDetails = useSelector((data) => data.CarUser.userDetails)
  const [loading, setLoading] = useState(false)
  const [handler, setHandler] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isBidModal, setIsBidModal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [holdLoading, setHoldLoading] = useState(false)
  const [watching, setWatching] = useState()
  const [isWatching, setIsWatching] = useState(false)
  const [viewingMode, setViewingMode] = useState("ALL")

  const [isDownloading, setIsDownloading] = useState(false)

  // Limit how many thumbnails to show at once
  const THUMBNAILS_TO_SHOW = 6

  // Replace this URL with your actual PDF report URL
  const reportPdfUrl = "/vehicle-report.pdf"
  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true)

      // Create an anchor element and set properties for download
      const link = document.createElement('a')
      link.href = reportPdfUrl
      link.setAttribute('download', 'vehicle-history-report.pdf')

      // Append to the document, click it, and remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading report:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  // Update visible thumbnails when thumbnail navigation changes
  useEffect(() => {
    updateVisibleThumbnails()
  }, [thumbnailStartIndex, images.length])

  // Function to update which thumbnails are visible based on current start index
  const updateVisibleThumbnails = () => {
    if (images.length <= THUMBNAILS_TO_SHOW) {
      // If we have fewer images than slots, show all images
      setVisibleThumbnails(Array.from({ length: images.length }, (_, i) => i))
    } else {
      // Otherwise, show the slice of images starting from thumbnailStartIndex
      setVisibleThumbnails(
        Array.from({ length: THUMBNAILS_TO_SHOW }, (_, i) => (thumbnailStartIndex + i) % images.length)
      )
    }
  }

  // Handler for thumbnail navigation left button
  const handleThumbnailLeft = () => {
    if (images.length <= THUMBNAILS_TO_SHOW) return // No need to scroll if all fit

    setThumbnailStartIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? images.length - THUMBNAILS_TO_SHOW : prevIndex - 1;
      return Math.max(0, newIndex);
    });
  }

  // Handler for thumbnail navigation right button
  const handleThumbnailRight = () => {
    if (images.length <= THUMBNAILS_TO_SHOW) return // No need to scroll if all fit

    setThumbnailStartIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex > images.length - THUMBNAILS_TO_SHOW ? 0 : newIndex;
    });
  }

  useEffect(() => {
    // Initialize `currentImage` with the index of the image whose label is "horizontal"
    const horizontalImageIndex = images.findIndex((image) => image.label === "horizontal")
    if (horizontalImageIndex !== -1) {
      setCurrentImage(horizontalImageIndex)
    }
  }, [images])

  // Update state when data changes
  useEffect(() => {
    setCurrentBid(Number.parseInt(data?.Bids[0]?.price) || Number.parseInt(data?.CarSubmission?.price) || 0)
    setBids(data?.Bids?.length || 0)
    setBidAmount(Number.parseInt(data?.Bids[0]?.price) + 100 || Number.parseInt(data?.CarSubmission?.price) + 100)
  }, [data])

  useEffect(() => {
    if (userid) {
      const fetchUserDetails = async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/user/getUserDetails/${userid}`)
          const result = await response.json()
          setUser(result.user)
          setLoading(false)
        } catch (error) {
          setLoading(false)
          console.error("Error fetching user details:", error)
        }
      }

      fetchUserDetails()
    }
  }, [userid, handler])

  const isEligible = user?.cardName

  const handlePlaceBid = () => {
    if (!user) {
      toast("Please login to place a bid.")
      setIsAccountModalOpen(true)
    } else if (!isEligible) {
      toast("You are not currently registered.")
      setIsBidModal(true)
    } else if (user?.HoldPayments.length > 0) {
      const holddata = user.HoldPayments.filter(
        (hold) => hold.auctionId === data?.id && hold.status === "requires_capture",
      )

      if (holddata.length > 0) {
        setIsBidDialogOpen(true)
        setIsModalOpen(false)
      } else {
        setIsModalOpen(true)
      }
    } else {
      setIsModalOpen(true)
    }
  }

  const confirmBid = async () => {
    if (bidAmount < currentBid + 100) {
      toast(`Bid amount must be at least $${currentBid + 100}.`)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/user/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bidAmount: bidAmount,
          currency: data.CarSubmission.currency,
          auctionId: data.id,
          userId: userid,
          carId: data.CarSubmission.id,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to place bid. Status: ${response.status}`)
      }

      const result = await response.json()

      // Update local state
      setCurrentBid(bidAmount)
      setBidAmount(bidAmount + 100)
      setBids((prevBids) => prevBids + 1)

      // Trigger parent component to refresh auction data
      triggerfetch(!trigger)

      // Close the bid dialog
      setIsBidDialogOpen(false)

      // Show success message
      toast.success("Bid placed successfully!")
    } catch (error) {
      console.error("Error occurred while placing bid:", error)
      toast.error("An error occurred while placing your bid. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initialize `currentImage` with the index of the image whose label is "horizontal"
    const horizontalImageIndex = images.findIndex((image) => image.label === "horizontal")
    if (horizontalImageIndex !== -1) {
      setCurrentImage(horizontalImageIndex)
    }
  }, [images])



  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  function getReserveStatus(currentPrice, reservedPrice) {
    if (currentPrice >= reservedPrice) {
      return "Reserve met"
    } else if (currentPrice >= reservedPrice * 0.9) {
      return "Reserve near"
    } else {
      return "Reserve not met"
    }
  }

  const currentPrice =
    data?.Bids.length > 0 ? Number.parseFloat(data?.Bids[0]?.price) : Number.parseFloat(data.CarSubmission.price)

  const reserveStatus = data.CarSubmission?.reserved
    ? getReserveStatus(currentPrice, Number.parseFloat(data.CarSubmission.reservedPrice))
    : null

  const handleConfirm = async () => {
    setHoldLoading(true)

    try {
      const res = await fetch("/api/stripe/hold-amount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userid, auctionId: data?.id }),
      })
      const data2 = await res.json()

      if (data2.success) {
        toast.success("$500 Hold Successful! You can now bid.")
        setIsBidDialogOpen(true)
        setIsModalOpen(false)
        setHandler(!handler)
      } else {
        toast.error(`Error: ${data2.message}`)
        setIsModalOpen(false)
      }
    } catch (error) {
      setIsModalOpen(false)
      console.log("ERROR FROM SERVER SIDE", error.message)
      toast.error("Failed to hold amount. Please try again.")
    }

    setHoldLoading(false)
  }

  async function fetchWatching() {
    try {
      const response = await fetch(`/api/user/watch/${userid}`)
      const result = await response.json()
      setWatching(result.data)

      // Check if current auction is in the user's watch list
      const isCurrentAuctionWatched = result.data?.some((item) => item.auctionId === data.id)
      setIsWatching(isCurrentAuctionWatched)
    } catch (error) {
      console.error("Error fetching watch status:", error)
    }
  }

  function handleWatch() {
    if (!userid) {
      toast.message("Login to watch auction!!")
      return
    }

    const endpoint = `/api/user/watch`

    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        auctionId: data.id,
        userId: userid,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setIsWatching(!isWatching)
          toast.success(isWatching ? "Removed from watch list" : "Added to watch list")
        } else {
          toast.error("Failed to update watch status")
        }
      })
      .catch((error) => {
        console.error("Error updating watch status:", error)
        toast.error("An error occurred")
      })
  }

  useEffect(() => {
    if (userid) {
      fetchWatching()
    }
  }, [userid])

  // Component for right sidebar that will be placed in different positions based on screen size
  const RightSidebar = () => (
    <div className="w-full p-2 md:p-4 md:bg-gray-100">
      <div className="flex items-center mb-4">
        <div className="flex items-center gap-1">
          <h3 className="text-lg font-bold">Auction</h3>
          <Info className="h-4 w-4 text-blue-500" />
        </div>
        <div className="ml-auto text-sm">
          {data.views || 66} Views • {data.searches || 37478} Searches
        </div>
      </div>

      <div className="bg-white p-4 rounded-md border shadow-sm mb-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-gray-500 text-sm">Status</div>
            <div className="font-medium">{data.status === "Live" ? "On Sale" : data.status}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Adj MMR</div>
            <div className="font-bold text-blue-600 text-xl">${data.CarSubmission.mmr || "17,450"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Time Left</div>
            <div className="font-medium">
              {data.status === "Live" ? (
                <EndAuctionTimerComponent className="gap-1" endDate={data.endDate} />
              ) : (
                "Ends in 1d 23h 18m"
              )}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Starts</div>
            <div className="font-medium">
              {new Date(data.startDate).toLocaleDateString()} -{" "}
              {new Date(data.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Pickup</div>
            <div className="font-medium">{data.location || "NC - CONCORD"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Vehicle Location</div>
            <div className="font-medium">At Dealership</div>
          </div>
          <div className="col-span-2">
            <div className="text-gray-500 text-sm">Seller</div>
            <div className="font-medium text-blue-600">{data.Seller?.name || "PRESTIGE MOTORWORKS LLC"}</div>
          </div>
        </div>

        {/* Action buttons */}
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 mb-2">
          BUY NOW ${data.CarSubmission.buyNowPrice || "25,500"}
        </Button>

        <Button
          variant="outline"
          className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3 mb-2"
        >
          MAKE OFFER
        </Button>

        {/* <div className="text-right">
          <a href="#" className="text-blue-600 hover:underline">
            View Fees
          </a>
        </div> */}
      </div>

      {/* Bidding section for Live auctions */}
      {data.status === "Live" && (
        <div className="bg-white p-2 rounded-md mt-4">
          <div className="mb-4">
            <div className="text-gray-500 text-sm">Current Bid</div>
            <div className="text-3xl font-bold">
              {data?.CarSubmission.currency}{" "}
              {data?.Bids.length > 0
                ? Number.parseInt(data.Bids[0].price).toLocaleString()
                : Number.parseInt(data?.CarSubmission?.price).toLocaleString()}
            </div>
            <div
              className="text-sm text-blue-600 cursor-pointer hover:underline"
              onClick={() => setIsBidDetailOpen(true)}
            >
              {bids} bids
            </div>

            {data.CarSubmission?.reserved === false ? (
              <div className="flex gap-1 items-center text-sm text-green-600 mt-2">
                <Check className="size-4 bg-green-500 rounded-full text-white p-[1px]" /> No Reserve
              </div>
            ) : (
              <>
                {reserveStatus && (
                  <p
                    className={`text-xs flex gap-1 items-center md:text-sm mt-2 ${reserveStatus === "Reserve met"
                      ? "text-green-500"
                      : reserveStatus === "Reserve near"
                        ? "text-yellow-500"
                        : "text-red-500"
                      }`}
                  >
                    {reserveStatus === "Reserve met" ? (
                      <Check className="size-4 bg-green-500 rounded-full text-white p-[1px]" />
                    ) : reserveStatus === "Reserve near" ? (
                      <CircleMinus className="size-5 rounded-full text-yellow-500 p-[1px]" />
                    ) : (
                      <CirclePlus className="size-5 rotate-45 rounded-full text-red-500 p-[1px]" />
                    )}
                    {reserveStatus}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="space-y-3 mb-4">
            <div className="font-medium">
              Bid {data?.CarSubmission.currency}{" "}
              {Number.parseInt(data?.Bids[0]?.price) + 100 || Number.parseInt(data.CarSubmission.price) + 100} or
              more
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                min={Number.parseInt(data?.Bids[0]?.price) + 100 || Number.parseInt(data.CarSubmission.price) + 100}
                className="text-lg"
              />

              <BiddingType userId={userid} auctionId={data.id} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="solid"
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={handlePlaceBid}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Place A Bid"
              )}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleWatch}
              className={`w-full ${isWatching ? "bg-red-50" : "bg-gray-50"}`}
            >
              <Heart className={`h-4 w-4 mr-2 ${isWatching ? "fill-red-500 text-red-500" : ""}`} />
              {isWatching ? "Watching" : "Watch"}
            </Button>
          </div>
        </div>
      )}

      <div className="w-full mx-auto">
        <h2 className="text-teal-700 font-semibold text-lg mb-2 border-b pb-2">Vehicle History</h2>

        <div className="bg-white py-4 rounded-md shadow-sm mt-4">
          <div className="flex flex-col space-y-3">
            {/* Top section with AutoCheck logo and vehicle data */}
            <div className="flex flex-nowrap md:flex-wrap items-center justify-between md:gap-y-4">
              <div className="flex border border-red-500 w-full">
                <div className="w-16 md:w-28">
                  <Image
                    src="/logo/autocheck_logo1.jpg"
                    alt="AutoCheck"
                    width={80}
                    height={35}
                    className="object-contain"
                  />
                </div>

                {/* Vehicle data in a responsive grid */}
                <div className="grid grid-cols-4 w-full gap-2 sm:gap-8 flex-grow text-center">
                  <div className="flex flex-col justify-center items-center">
                    <div className="text-gray-500 text-xs">Owners</div>
                    <div className="font-medium">{data?.CarSubmission.owners}</div>
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    <div className="text-gray-500 text-xs">ACDNT</div>
                    <div className="font-medium">{data?.CarSubmission.acdnt}</div>
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    <div className="text-gray-500 text-xs">Titles</div>
                    {data?.CarSubmission.titles ?
                      <div className="text-green-600">
                        <Check className="h-4 w-4" />
                      </div> :
                      <div className="text-red-600">
                        <X className="h-4 w-4" />
                      </div>
                    }
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    <div className="text-gray-500 text-xs">ODO</div>
                    {data?.CarSubmission.odo ?
                      <div className="text-green-600">
                        <Check className="h-4 w-4" />
                      </div> :
                      <div className="text-red-600">
                        <X className="h-4 w-4" />
                      </div>
                    }
                  </div>
                </div>
              </div>
              {/* Action buttons - more consistent with site styling */}
              <div className="flex border border-green-500 flex-nowrap md:flex-wrap items-center gap-2 ml-auto">
                <button
                  className="text-xs h-8 px-3 bg-white border border-blue-400 text-blue-700 rounded hover:bg-blue-50 transition-colors"
                  onClick={() => window.open(data?.CarSubmission.pdfUrl || file, "_blank")}
                >
                  VIEW REPORT
                </button>

                <button
                  className="h-8 w-28 bg-white  rounded hover:bg-gray-50 transition-colors"
                  onClick={() => window.open("https://www.carfax.com", "_blank")}
                >
                  <Image
                    src="/logo/carfax.svg"
                    alt="Carfax Logo"
                    width={75}
                    height={20}
                    className="object-contain w-full h-full"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full xl:px-16 mx-auto">
      {/* Header with vehicle title and details */}
      <div className="px-4 md:px-6 py-4 border-b">
        <h1 className="text-2xl md:text-3xl font-bold">
          {data.CarSubmission.vehicleYear} {data.CarSubmission.vehicleMake} {data.CarSubmission.vehicleModel}
        </h1>
        <p className="text-gray-500 mt-1">
          Provided: {data.CarSubmission.vehicleYear} {data.CarSubmission.vehicleMake} {data.CarSubmission.vehicleModel}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
          <span className="font-mono">{data.CarSubmission.vin || "VIN N/A"}</span>
          <span>•</span>
          <span>
            {data.CarSubmission.mileage} {data.CarSubmission.mileageUnit}
          </span>
          <span>•</span>
          <span>{data.CarSubmission.transmission}</span>
          <span>•</span>
          <span>{data.CarSubmission.engineCapacity}</span>
          <span>•</span>
          <span>{data.CarSubmission.fuelType}</span>

          <div className="ml-auto flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base">
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
              SD
            </Badge>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1">
                <span className="font-medium whitespace-nowrap">STRUCTURAL DAMAGE:</span>
                <span className="font-bold">{data.CarSubmission.structuralDamage ? "Yes" : "No"}</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-medium whitespace-nowrap">PRIOR PAINT:</span>
                <span className="font-bold">{data.CarSubmission.priorPaint ? "Yes" : "No"}</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-medium whitespace-nowrap">DRIVABLE:</span>
                <span className="font-bold">{data.CarSubmission.drivable ? "Yes" : "Not Specified"}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left side - Image gallery and content that stays in the left column on desktop */}
        <div className="lg:w-3/5 p-4">
          {/* Seller info banner */}
          <div className="bg-gray-800 text-white p-3 flex items-center justify-between mb-2">
            <div className="flex items-center">
              <h3 className="text-sm md:text-xl font-bold">{data.Seller?.name || "Prestige Motorworks"}</h3>
              <span className="mx-2 hidden md:block">•</span>
              <a href="#" className="text-blue-300 hidden md:flex hover:underline">
                www.carbuydirect.com
              </a>
            </div>
            <div className="text-sm md:text-xl font-bold">{data.Seller?.phoneNo || "(704) 723-4883"}</div>
          </div>

          {/* Main image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-none bg-gray-100 border border-blue-500">
            {images.length > 0 ? (
              <Image
                src={images[currentImage]?.data || "/placeholder.svg"}
                alt={`${data.CarSubmission.vehicleMake} ${data.CarSubmission.vehicleModel}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image available</div>
            )}

            {/* Navigation Buttons */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded text-white">
              image {currentImage + 1} of {images.length}
            </div>

            {/* Fullscreen button */}
            <button className="absolute bottom-4 left-4 bg-black/70 p-2 rounded text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 14H6V18H10V20H4V14Z" fill="currentColor" />
                <path d="M4 4H10V6H6V10H4V4Z" fill="currentColor" />
                <path d="M14 20H20V14H18V18H14V20Z" fill="currentColor" />
                <path d="M18 6H14V4H20V10H18V6Z" fill="currentColor" />
              </svg>
            </button>
          </div>

          {/* Thumbnails */}
          {/* Thumbnails */}
          <div className="mt-2 border-t border-b py-4">
            <div className="flex items-center mb-2">
              <button
                className={`px-4 py-1 font-bold ${viewingMode === "ALL" ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"}`}
                onClick={() => setViewingMode("ALL")}
              >
                ALL <span className="ml-1 text-xs bg-gray-600 text-white px-1 rounded">{images.length}</span>
              </button>
              <div className="ml-auto">
                <button
                  id="thumbnail_left"
                  onClick={handleThumbnailLeft}
                  className="bg-gray-200 p-1 rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="mx-1">VIEWING</span>
                <button
                  id="thumbnail_right"
                  onClick={handleThumbnailRight}
                  className="bg-gray-200 p-1 rounded-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {visibleThumbnails.map((index) => (
                <button
                  key={images[index]?.id || index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative aspect-[4/3] overflow-hidden ${currentImage === index ? "ring-2 ring-blue-500" : "border border-gray-300"
                    }`}
                >
                  <Image
                    src={images[index]?.data || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Right sidebar appears here on mobile/tablet screens - IMPORTANT CHANGE */}
          <div className="block lg:hidden">
            <RightSidebar />
          </div>

          {/* Comment section */}
          <div className="mt-4">
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Enter comments here (Max characters 250)"
              rows={3}
            ></textarea>
            <div className="flex justify-between mt-2">
              <span>Note saved</span>
              <span>250 Characters Remaining</span>
            </div>
            <button className="mt-2 bg-gray-200 px-4 py-1 rounded flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
                  fill="currentColor"
                />
              </svg>
              DELETE
            </button>
          </div>

          {/* Overview Section */}
          <div className="mt-8">
            <OverviewSection data={data} />
          </div>

          {/* Tabs Section */}
          <div className="mt-4">
            <TabsSection data={data} />
          </div>

          {/* Comments Section */}
          {user && (
            <div className="mt-4">
              <Comments data={data} />
            </div>
          )}
        </div>

        {/* Right side - Auction details */}
        <div className="lg:w-2/5 p-4 bg-gray-100">
          <div className="flex items-center mb-4">
            <div className="flex items-center gap-1">
              <h3 className="text-lg font-bold">Auction</h3>
              <Info className="h-4 w-4 text-blue-500" />
            </div>
            <div className="ml-auto text-sm">
              {data.views || 66} Views • {data.searches || 37478} Searches • {data.offers || 0} Offers
            </div>
          </div>

          <div className="bg-white p-4 rounded-md shadow-sm mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-gray-500 text-sm">Status</div>
                <div className="font-medium">{data.status === "Live" ? "On Sale" : data.status}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Adj MMR</div>
                <div className="font-bold text-blue-600 text-xl">${data.CarSubmission.mmr || "17,450"}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Time Left</div>
                <div className="font-medium">
                  {data.status === "Live" ? (
                    <EndAuctionTimerComponent className="gap-1" endDate={data.endDate} />
                  ) : (
                    "Ends in 1d 23h 18m"
                  )}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Starts</div>
                <div className="font-medium">
                  {new Date(data.startDate).toLocaleDateString()} -{" "}
                  {new Date(data.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Pickup</div>
                <div className="font-medium">{data.location || "NC - CONCORD"}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Vehicle Location</div>
                <div className="font-medium">At Dealership</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500 text-sm">Seller</div>
                <div className="font-medium text-blue-600">{data.Seller?.name || "PRESTIGE MOTORWORKS LLC"}</div>
              </div>
            </div>

            {/* Action buttons */}
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 mb-2">
              BUY NOW ${data.CarSubmission.buyNowPrice || "25,500"}
            </Button>

            <Button
              variant="outline"
              className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3 mb-2"
            >
              MAKE OFFER
            </Button>

            <div className="text-right">
              <a href="#" className="text-blue-600 hover:underline">
                View Fees
              </a>
            </div>
          </div>

          {/* Bidding section for Live auctions */}
          {data.status === "Live" && (
            <div className="bg-white p-4 rounded-md shadow-sm mt-4">
              <div className="mb-4">
                <div className="text-gray-500 text-sm">Current Bid</div>
                <div className="text-3xl font-bold">
                  {data?.CarSubmission.currency}{" "}
                  {data?.Bids.length > 0
                    ? Number.parseInt(data.Bids[0].price).toLocaleString()
                    : Number.parseInt(data?.CarSubmission?.price).toLocaleString()}
                </div>
                <div
                  className="text-sm text-blue-600 cursor-pointer hover:underline"
                  onClick={() => setIsBidDetailOpen(true)}
                >
                  {bids} bids
                </div>

                {data.CarSubmission?.reserved === false ? (
                  <div className="flex gap-1 items-center text-sm text-green-600 mt-2">
                    <Check className="size-4 bg-green-500 rounded-full text-white p-[1px]" /> No Reserve
                  </div>
                ) : (
                  <>
                    {reserveStatus && (
                      <p
                        className={`text-xs flex gap-1 items-center md:text-sm mt-2 ${reserveStatus === "Reserve met"
                          ? "text-green-500"
                          : reserveStatus === "Reserve near"
                            ? "text-yellow-500"
                            : "text-red-500"
                          }`}
                      >
                        {reserveStatus === "Reserve met" ? (
                          <Check className="size-4 bg-green-500 rounded-full text-white p-[1px]" />
                        ) : reserveStatus === "Reserve near" ? (
                          <CircleMinus className="size-5 rounded-full text-yellow-500 p-[1px]" />
                        ) : (
                          <CirclePlus className="size-5 rotate-45 rounded-full text-red-500 p-[1px]" />
                        )}
                        {reserveStatus}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="font-medium">
                  Bid {data?.CarSubmission.currency}{" "}
                  {Number.parseInt(data?.Bids[0]?.price) + 100 || Number.parseInt(data.CarSubmission.price) + 100} or
                  more
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={Number.parseInt(data?.Bids[0]?.price) + 100 || Number.parseInt(data.CarSubmission.price) + 100}
                    className="text-lg"
                  />

                  <BiddingType userId={userid} auctionId={data.id} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="solid"
                  size="lg"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={handlePlaceBid}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Place A Bid"
                  )}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWatch}
                  className={`w-full ${isWatching ? "bg-red-50" : "bg-gray-50"}`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isWatching ? "fill-red-500 text-red-500" : ""}`} />
                  {isWatching ? "Watching" : "Watch"}
                </Button>
              </div>
            </div>
          )}

          <div className="w-full max-w-3xl mx-auto">
            <h2 className="text-teal-700 font-semibold text-lg mb-2 border-b pb-2">Vehicle History</h2>

            <div className="bg-white p-4 rounded-md shadow-sm mt-4">
              {/* Remove duplicate title since it already exists above this component */}

              <div className="flex flex-col space-y-3">
                {/* Top section with AutoCheck logo and vehicle data */}
                <div className="flex flex-wrap items-center justify-between gap-y-4">
                  <div className="w-28">
                    <Image
                      src="/logo/autocheck_logo1.jpg"
                      alt="AutoCheck"
                      width={80}
                      height={35}
                      className="object-contain"
                    />
                  </div>

                  {/* Vehicle data in a responsive grid */}
                  <div className="grid grid-cols-4 gap-2 sm:gap-8 flex-grow text-center">
                    <div>
                      <div className="text-gray-500 text-xs">Owners</div>
                      <div className="font-medium">4</div>
                    </div>

                    <div>
                      <div className="text-gray-500 text-xs">ACDNT</div>
                      <div className="font-medium">0</div>
                    </div>

                    <div>
                      <div className="text-gray-500 text-xs">Titles/Probs</div>
                      <div className="text-green-600">
                        <Check className="h-4 w-4 mx-auto" />
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-500 text-xs">ODO</div>
                      <div className="text-green-600">
                        <Check className="h-4 w-4 mx-auto" />
                      </div>
                    </div>
                  </div>

                  {/* Action buttons - more consistent with site styling */}
                  <div className="flex flex-wrap items-center gap-2 ml-auto">
                    <button
                      className="text-xs h-8 px-3 bg-white border border-blue-400 text-blue-700 rounded hover:bg-blue-50 transition-colors"
                      onClick={() => setBidAmount(100)}
                    >
                      VIEW REPORT
                    </button>

                    <button
                      className="h-8 w-28  bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                      onClick={() => window.open("https://www.carfax.com", "_blank")}
                    >
                      <Image
                        src="/logo/carfax.svg"
                        alt="Carfax Logo"
                        width={75}
                        height={20}
                        className="object-contain w-full h-full"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Dialogs */}
      <Dialog open={isBidDetailOpen} onOpenChange={setIsBidDetailOpen}>
        <DialogContent className="m-2 md:m-0 md:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Bid Details for {data?.CarSubmission.vehicleYear} {data?.CarSubmission.vehicleMake}{" "}
              {data?.CarSubmission.vehicleModel}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bidder</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.Bids.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell>{bid.User.name}</TableCell>
                    <TableCell>
                      {bid.currency} {bid.price.toLocaleString()}
                    </TableCell>
                    <TableCell>{formatDistance(new Date(bid.createdAt), new Date(), { addSuffix: true })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBidModal} onOpenChange={setIsBidModal}>
        <DialogContent className="max-w-xs md:max-w-sm p-4">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              <div>
                <p style={{ marginTop: "20px" }}>Welcome!</p>
                <p className="text-sm text-gray-600" style={{ marginBottom: "20px" }}>
                  What would you like to do next?
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="w-full" style={{ gap: "20px 20px" }}>
            <Button
              className="w-full mt-3 bg-black text-white rounded-none px-4 py-6"
              onClick={() => {
                setIsDialogOpen(true)
                setIsBidModal(false)
              }}
            >
              Register to bid
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <div className="h-full overflow-y-auto">
            <BidRegistrationForm setHandler={setHandler} handler={handler} setIsDialogOpen={setIsDialogOpen} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl shadow-xl text-gray-700 border border-gray-300 max-h-[80vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Place Your Bid</h2>

            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Current Bid</p>
                <p className="text-2xl font-semibold text-gray-900">${currentBid}</p>
                <p className="text-xs text-gray-500">{bids} bids</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Your Bid (Min: ${currentBid + 100})</p>
                <input
                  type="number"
                  className="w-32 p-2 mt-1 border border-gray-300 rounded-lg text-center text-gray-800 focus:ring focus:ring-blue-300"
                  value={bidAmount}
                  min={currentBid + 100}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                className="px-6 py-2 text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition duration-200"
                onClick={confirmBid}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Confirm Bid"
                )}
              </Button>
              <Button
                variant="ghost"
                className="px-6 py-2 text-lg font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
                onClick={() => setIsBidDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <BidModal onClose={() => setIsModalOpen(false)} onConfirm={handleConfirm} loading={holdLoading} />
        </DialogContent>
      </Dialog>

      <BidLogin isAccountModalOpen={isAccountModalOpen} setIsAccountModalOpe={setIsAccountModalOpen} />
    </div>
  )
}
