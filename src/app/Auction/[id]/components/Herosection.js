"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Bell,
  Heart,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  CircleMinus,
  CirclePlus,
  Phone,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import OverviewSection from "./OverView"
import TabsSection from "./TabsSection"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import BidRegistrationForm from "./BidRegisterationDialog"
import { useSelector } from "react-redux"
import { Loader } from "lucide-react"
import TimerComponent from "@/app/components/CountDownTimer"
import { formatDistance } from "date-fns"
import BidLogin from "@/app/components/BidLogin"
import { Typography } from "@mui/material"
import Comments from "./Comments"
import BidModal from "@/app/components/BidModal"
import { toast } from "sonner"
import BiddingType from "./BiddingType"

export default function HeroSection({ data, triggerfetch, trigger }) {
  const images = data.CarSubmission.SubmissionImages || []
  const [isBidDetailOpen, setIsBidDetailOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [visibleThumbnails, setVisibleThumbnails] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [currentBid, setCurrentBid] = useState(
    Number.parseInt(data?.Bids[0]?.price) || Number.parseInt(data?.CarSubmission?.price) || 0,
  ) // Current bid
  const [bidAmount, setBidAmount] = useState(Number.parseInt(currentBid) + 100) // Default bid value
  const [bids, setBids] = useState(data?.Bids?.length || 0) // Total bids
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
      console.log(user)
      setIsAccountModalOpen(true)
    } else if (!isEligible) {
      toast("You are not currently registered.")
      console.log(user)
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
      console.log(user)
      setIsModalOpen(true)
    }
  }

  const confirmBid = async () => {
    if (bidAmount < currentBid + 100) {
      toast(`Bid amount must be at least $${currentBid + 100}.`)
      return
    }

    setLoading(true) // Start loading state
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
      console.log("Bid placed successfully:", result)

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
      setLoading(false) // End loading state
    }
  }

  useEffect(() => {
    // Initialize `currentImage` with the index of the image whose label is "horizontal"
    const horizontalImageIndex = images.findIndex((image) => image.label === "horizontal")
    if (horizontalImageIndex !== -1) {
      setCurrentImage(horizontalImageIndex)
    }
  }, [images])

  const updateVisibleThumbnails = (currentIndex) => {
    const totalImages = images.length
    if (totalImages <= 6) {
      setVisibleThumbnails(Array.from({ length: totalImages }, (_, i) => i))
    } else {
      const start = Math.max(0, Math.min(currentIndex - 3, totalImages - 6))
      setVisibleThumbnails(Array.from({ length: 6 }, (_, i) => start + i))
    }
  }

  useEffect(() => {
    updateVisibleThumbnails(currentImage)
  }, [currentImage, images.length])

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

  return (
    <div className="w-full px-4 md:px-8 lg:px-36 flex flex-col gap-8 md:py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="space-y-4 md:min-w-3/5">
          <div className="relative md:h-[75vh] aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
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
            <div className="absolute bottom-4 right-4 bg-white/80 px-2 py-1 rounded text-sm">
              {currentImage + 1} of {images.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="hidden md:flex gap-2 pb-2">
            {visibleThumbnails
              .slice()
              .reverse()
              .map((index) => (
                <button
                  key={images[index].id}
                  onClick={() => setCurrentImage(index)}
                  className={`relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden ${
                    currentImage === index ? "ring-2 ring-red-500 shadow-[0_0_10px_red]" : ""
                  }`}
                >
                  <Image
                    src={images[index].data || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
          </div>
        </div>
        {/* Right side - Details */}
        <div className="space-y-3 md:w-2/5">
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold">
              {data.CarSubmission.vehicleYear} {data.CarSubmission.vehicleMake} {data.CarSubmission.vehicleModel}
              <br />
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600">
                {data.status === "Coming-Soon" ? (
                  <h2 className="text-xl font-[200] tracking-tight">Coming Soon</h2>
                ) : data.status === "Scheduled" ? (
                  <div className="text-left flex gap-4">
                    <p className="text-xl font-[200] tracking-tight">Auction Begins On</p>
                    <TimerComponent className="gap-1 text-lg" endDate={data.startDate} />
                  </div>
                ) : data.status === "Ended" ? (
                  <div className="text-left flex gap-4">
                    <p className="text-xl font-[200] tracking-tight">Auction Ended</p>
                  </div>
                ) : data.status === "Sold" ? (
                  <div className="text-left flex gap-4">
                    <p className="text-lg md:text-2xl text-left text-gray-600">Sold Out</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <TimerComponent className="gap-1" endDate={data.endDate} />
                      <button>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </button>
                    </span>
                  </div>
                )}
              </div>
              {(data.status === "Scheduled" || data.status === "Live") && (
                <Button variant="ghost" className="text-red-600 flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Remind me
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {data.status === "Live" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    Current Bid
                    <Dialog open={isBidDetailOpen} onOpenChange={setIsBidDetailOpen}>
                      <DialogTrigger asChild>
                        <span className="text-blue-600 cursor-pointer hover:underline">{data?.Bids.length}</span>
                      </DialogTrigger>
                      <DialogContent className="m-2 md:m-0 md:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>
                            Bid Details for {data?.CarSubmission.vehicleYear} {data?.CarSubmission.vehicleMake}{" "}
                            {data?.CarSubmission.vehicleModel}
                          </DialogTitle>
                        </DialogHeader>
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
                                <TableCell>
                                  {formatDistance(new Date(bid.createdAt), new Date(), { addSuffix: true })}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    {data.CarSubmission?.reserved === false ? (
                      <div className="flex gap-1 items-center text-sm">
                        <Check className="size-4 bg-green-500 rounded-full text-white p-[1px]" /> No Reserve
                      </div>
                    ) : (
                      <>
                        {reserveStatus && (
                          <p
                            className={`text-xs flex gap-1 items-center md:text-sm ${
                              reserveStatus === "Reserve met"
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
                </div>
              )}

              <div className="text-2xl md:text-4xl font-bold">
                {data?.CarSubmission.currency}{" "}
                {data?.Bids.length > 0
                  ? Number.parseInt(data.Bids[0].price)
                  : Number.parseInt(data?.CarSubmission?.price)}
              </div>

              <div className="text-sm text-gray-600">
                <span className="text-blue-600">$690</span> buyers premium not included in the price. Excludes any Debit
                Card / Credit Card / PayPal surcharges that will apply.
              </div>
            </div>
            {data.status === "Live" && (
              <>
                <div className="space-y-3">
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
                      min={
                        Number.parseInt(data?.Bids[0]?.price) + 100 || Number.parseInt(data.CarSubmission.price) + 100
                      }
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
                        <Loader className="animate-spin" size={20} />
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
              </>
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white text-xl">
                  {data.Seller.name
                    .split(" ")
                    .map((s) => s.charAt(0))
                    .join("")}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{data.Seller.name}</h3>
                <p className="text-gray-600 text-sm">Enquires about the item</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Button
                variant="outline"
                className="flex-1 text-blue-600 border-blue-600"
                onClick={() => (window.location.href = `tel:${data.Seller.phoneNo}`)}
              >
                <span className="mr-2">
                  <Phone />
                </span>{" "}
                Call
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-blue-600"
                onClick={() => (window.location.href = `mailto:${data.Seller.email}`)}
              >
                <span className="mr-2">
                  <Mail />
                </span>{" "}
                Send an email
              </Button>
            </div>
          </div>

          <Dialog open={isBidModal} onOpenChange={setIsBidModal}>
            <DialogContent className="max-w-xs md:max-w-sm p-4">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  <div className="">
                    <Typography variant="body1" style={{ marginTop: "20px" }}>
                      Welcome!
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: "20px" }}>
                      What would you like to do next?
                    </Typography>
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
            <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
              <BidRegistrationForm setHandler={setHandler} handler={handler} setIsDialogOpen={setIsDialogOpen} />
            </DialogContent>
          </Dialog>
          <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
            <DialogContent className="max-w-lg rounded-2xl shadow-xl text-gray-700 border border-gray-300">
              <div className="p-6 space-y-6">
                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-800 text-center">Place Your Bid</h2>

                {/* Bid Info Section */}
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

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                  <Button
                    className="px-6 py-2 text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition duration-200"
                    onClick={confirmBid}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader className="animate-spin" size={16} />
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
        </div>
      </div>
      <BidLogin isAccountModalOpen={isAccountModalOpen} setIsAccountModalOpe={setIsAccountModalOpen} />

      <div className="md:w-3/5">
        <div>
          <OverviewSection data={data} />
        </div>
        <div>
          <TabsSection data={data} />
        </div>
        <div>{user ? <Comments data={data} /> : ""}</div>
      </div>
    </div>
  )
}

