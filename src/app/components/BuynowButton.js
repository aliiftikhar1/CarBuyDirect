"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { Loader, CheckCircle2, Info, ArrowRight, DollarSign, MessageSquare } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import BidRegistrationForm from "../Auction/[id]/components/BidRegisterationDialog"

function BuynowButton({ data, setHandler, handler }) {
  const [open, setOpen] = useState(false)
  const [dealOpen, setDealOpen] = useState(false)
  const [price, setPrice] = useState("")
  const [message, setMessage] = useState("")
  const [loader, setLoader] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const user = useSelector((state) => state.CarUser.userDetails)
  const isEligible = user?.cardName

  const handleBuyBtn = () => {
    if (!user) {
      toast.error("Please login to place a bid.")
    } else if (!isEligible) {
      setIsDialogOpen(true)
    } else {
      setOpen(true)
    }
  }

  const handleMakeDealBtn = () => {
    if (!user) {
      toast.error("Please login to place a bid.")
    } else if (!isEligible) {
      setIsDialogOpen(true)
    } else {
      setDealOpen(true)
    }
  }

  const handleSend = async () => {
    if (!price) {
      toast.error("Please enter your price offer")
      return
    }

    setLoader(true)
    const payload = {
      price,
      message,
      auctionId: data.id,
      receiverId: data.sellerId,
      senderId: user.id,
      receiverEmail: data.CarSubmission.email,
      userName: user.name || user.email,
      vehicleYear: data.CarSubmission.vehicleYear,
      vehicleModel: data.CarSubmission.vehicleModel,
      userType: "buyer",
      originalprice: data.CarSubmission.buyPrice,
      regarding: "buy-now",
    }
    try {
      const response = await fetch("/api/user/BuyNow/deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success("Your deal has been successfully submitted!")
        setDealOpen(false)
        setPrice("")
        setMessage("")
      }
    } catch (error) {
      console.error("Error sending notification:", error)
      toast.error("Failed to submit your deal. Please try again.")
    } finally {
      setLoader(false)
    }
  }

  const handleBuy = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/BuyNow/deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: data.CarSubmission.buyPrice,
          message: `Buyer wants to purchase your car at Buy price (${data.CarSubmission.buyPrice})`,
          auctionId: data.id,
          receiverId: data.sellerId,
          senderId: user.id,
          receiverEmail: data.CarSubmission.email,
          userName: user.name || user.email,
          vehicleYear: data.CarSubmission.vehicleYear,
          vehicleModel: data.CarSubmission.vehicleModel,
          userType: "buyer",
          originalprice: data.CarSubmission.buyPrice,
          regarding: "buy-now",
        }),
      })

      if (response.ok) {
        toast.success("Your deal has been successfully submitted!")
        setOpen(false)
      }
    } catch (error) {
      console.error("Error sending notification:", error)
      toast.error("Failed to complete purchase. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row w-full justify-between gap-3 max-w-xs mx-auto">
      {/* <Button
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        onClick={handleMakeDealBtn}
        size="lg"
      >
        <DollarSign className="w-4 h-4 mr-2 group-hover:animate-pulse" />
        Make Deal
      </Button> */}
      <Button
        className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white rounded-full shadow-sm hover:shadow-xl transition-all duration-300 group"
        onClick={handleBuyBtn}
        size="lg"
      >
        Buy Now
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
      </Button>

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <BidRegistrationForm setHandler={setHandler} handler={handler} setIsDialogOpen={setIsDialogOpen} />
        </DialogContent>
      </Dialog>

      {/* Buy Now Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-600 dark:text-green-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold mt-2 dark:text-white">Confirm Your Purchase</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Secure this deal now before the price changes! 🚗💨</p>

            <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400">Actual Price</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">${data?.CarSubmission?.buyPrice}</p>
              {/* <Badge
                variant="outline"
                className="mt-1 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
              >
                Price locked for 15 minutes
              </Badge> */}
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <Button
                variant="outline"
                className="rounded-lg border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={handleMakeDealBtn}
              >
                Make a Deal
              </Button>
              <Button
                className="rounded-lg bg-black hover:bg-gray-800 text-white"
                onClick={handleBuy}
                disabled={loading}
              >
                {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                Buy Now
              </Button>
            </div>

            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs mt-5">
              <Info className="w-4 h-4 mr-1" />
              <p>
                By proceeding, you agree to our <span className="underline cursor-pointer">Terms & Conditions</span>
              </p>
            </div>

            <Button
              variant="ghost"
              className="mt-4 w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Make Deal Modal */}
      {dealOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold dark:text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
              Make a Deal
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Negotiate your best price</p>
            <p className="text-sm text-gray-700 dark:text-gray-400 text-center">Actual Price</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 text-center">${data?.CarSubmission?.buyPrice}</p>

            <div className="mt-2 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Your Price Offer
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
                  <Input
                    className="pl-9 rounded-lg"
                    type="text"
                    placeholder="Enter your offer"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Your Message</label>
                <Textarea
                  className="rounded-lg"
                  rows={3}
                  placeholder="Why is this a good deal?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg"
                onClick={handleSend}
                disabled={loader}
              >
                {loader ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                Send Offer
              </Button>
              <Button variant="outline" className="w-full rounded-lg" onClick={() => setDealOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuynowButton

