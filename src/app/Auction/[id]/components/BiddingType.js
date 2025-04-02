"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Info, Edit } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"

export default function BiddingType({ userId, auctionId }) {
  const [biddingType, setBiddingType] = useState("standard")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [incrementAmount, setIncrementAmount] = useState("")
  const [maxBid, setMaxBid] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")
  const [updateError, setUpdateError] = useState("")
  const [hasExistingAutobid, setHasExistingAutobid] = useState(false)
  const [autobidDetails, setAutobidDetails] = useState(null)

  // Check if an autobid already exists when component mounts
  useEffect(() => {
    const checkExistingAutobid = async () => {
      try {
        const response = await fetch(`/api/user/autoBid?userId=${userId}&auctionId=${auctionId}`)
        const data = await response.json()

        // Check if there's an autobid for this user and auction
        const existingAutobid = data.find((autobid) => autobid.userId === userId && autobid.auctionId === auctionId)

        if (existingAutobid) {
          setHasExistingAutobid(true)
          setAutobidDetails(existingAutobid)
          setBiddingType("autobid")
        }
      } catch (err) {
        console.error("Error checking existing autobid:", err)
      }
    }

    checkExistingAutobid()
  }, [userId, auctionId])

  const handleTabChange = (value) => {
    setBiddingType(value)
    if (value === "autobid") {
      setIsDialogOpen(true)
    }
  }

  const handleInfoClick = () => {
    setIsInfoDialogOpen(true)
  }

  const handleUpdateClick = () => {
    // Pre-fill the form with current values
    if (autobidDetails) {
      setMaxBid(autobidDetails.maxAmount.toString())
      setIncrementAmount(autobidDetails.incrementAmount.toString())
    }
    setIsUpdateDialogOpen(true)
    setIsInfoDialogOpen(false) // Close the info dialog
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/user/autoBid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          auctionId,
          maxAmount: Number.parseFloat(maxBid),
          incrementAmount: Number.parseFloat(incrementAmount),
          status: "active",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Check specifically for the already registered error
        if (response.status === 409) {
          setHasExistingAutobid(true)
          throw new Error(data.error || "An autobid has already been registered for this auction")
        }
        throw new Error(data.error || "Failed to set up autobid")
      }

      toast("Your autobid has been set up and is now active.")

      setHasExistingAutobid(true)
      setAutobidDetails(data)
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateError("")

    try {
      if (!autobidDetails || !autobidDetails.id) {
        throw new Error("Autobid details not found")
      }

      const response = await fetch(`/api/user/autoBid/${autobidDetails.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxAmount: Number.parseFloat(maxBid),
          incrementAmount: Number.parseFloat(incrementAmount),
          status: "active", // Maintain active status on update
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update autobid")
      }

      toast("Your autobid has been updated successfully.")

      // Update the local state with the new values
      setAutobidDetails({
        ...autobidDetails,
        maxAmount: Number.parseFloat(maxBid),
        incrementAmount: Number.parseFloat(incrementAmount),
      })

      setIsUpdateDialogOpen(false)
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <>
      <div className="flex gap-2 justify-center items-center w-full">
        <Tabs value={biddingType} onValueChange={handleTabChange} className="w-full ">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard" className="text-sm">
              Standard
            </TabsTrigger>
            <TabsTrigger value="autobid" className="text-sm">
              Autobid
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button size="icon" variant="ghost" onClick={handleInfoClick}>
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {/* Configuration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure Autobid</DialogTitle>
            <DialogDescription>
              Set up automatic bidding to compete without having to manually place each bid.
            </DialogDescription>
          </DialogHeader>

          {hasExistingAutobid ? (
            <>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Autobid Already Registered</AlertTitle>
                <AlertDescription>
                  You already have an autobid set up for this auction. You cannot create multiple autobids for the same
                  auction.
                </AlertDescription>
              </Alert>
              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </div>
            </>
          ) : (
            <>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="maxBid">Maximum Bid Amount</Label>
                  <Input
                    id="maxBid"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter your maximum bid"
                    value={maxBid}
                    onChange={(e) => setMaxBid(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This is the highest amount you're willing to bid. Your bid will only increase as needed to stay
                    ahead.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incrementAmount">Bid Increment</Label>
                  <Input
                    id="incrementAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter bid increment amount"
                    value={incrementAmount}
                    onChange={(e) => setIncrementAmount(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    The amount to increase your bid by when outbid. Minimum increments may apply based on auction rules.
                  </p>
                </div>

                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>How Autobid Works</AlertTitle>
                  <AlertDescription className="text-xs">
                    When you set up autobid, the system will automatically place bids on your behalf whenever you're
                    outbid, up to your maximum amount. You'll be notified when you're outbid beyond your maximum.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Setting up..." : "Set Up Autobid"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{hasExistingAutobid ? "Your Autobid Details" : "About Autobidding"}</DialogTitle>
            <DialogDescription>
              {hasExistingAutobid
                ? "Information about your current autobid configuration"
                : "Learn how autobidding works in this auction"}
            </DialogDescription>
          </DialogHeader>

          {hasExistingAutobid && autobidDetails ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Maximum Bid</p>
                  <p className="text-lg font-semibold">{formatCurrency(autobidDetails.maxAmount)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Increment Amount</p>
                  <p className="text-lg font-semibold">{formatCurrency(autobidDetails.incrementAmount)}</p>
                </div>
                <div className="col-span-2 space-y-1 pt-2">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${autobidDetails.status === "active" ? "bg-green-500" : "bg-yellow-500"}`}
                    ></span>
                    <p className="font-medium capitalize">{autobidDetails.status}</p>
                  </div>
                </div>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>How Your Autobid Works</AlertTitle>
                <AlertDescription>
                  <p className="text-sm">
                    Your autobid will automatically place bids on your behalf up to your maximum amount of{" "}
                    {formatCurrency(autobidDetails.maxAmount)}. Each time you're outbid, the system will increase your
                    bid by {formatCurrency(autobidDetails.incrementAmount)} until your maximum is reached.
                  </p>
                </AlertDescription>
              </Alert>

              <Button onClick={handleUpdateClick} className="w-full" variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Update Autobid Settings
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>What is Autobidding?</AlertTitle>
                <AlertDescription>
                  <p className="text-sm">
                    Autobidding allows you to set a maximum bid amount and let the system automatically bid on your
                    behalf. This saves you from having to manually place each bid and ensures you don't miss out due to
                    timing.
                  </p>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">How It Works:</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>You set a maximum bid amount you're willing to pay</li>
                  <li>You set an increment amount for each automatic bid</li>
                  <li>The system places bids automatically when you're outbid</li>
                  <li>Your bid only increases as needed to stay ahead</li>
                  <li>You'll be notified if you're outbid beyond your maximum</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Benefits:</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Save time by not having to monitor the auction constantly</li>
                  <li>Never miss out on an item due to timing</li>
                  <li>Avoid emotional bidding that might lead to overpaying</li>
                  <li>Keep your maximum bid private from other bidders</li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={() => setIsInfoDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Autobid Settings</DialogTitle>
            <DialogDescription>Modify your autobid settings for this auction.</DialogDescription>
          </DialogHeader>

          {updateError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{updateError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleUpdateSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="updateMaxBid">Maximum Bid Amount</Label>
              <Input
                id="updateMaxBid"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter your maximum bid"
                value={maxBid}
                onChange={(e) => setMaxBid(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                This is the highest amount you're willing to bid. Your bid will only increase as needed to stay ahead.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="updateIncrementAmount">Bid Increment</Label>
              <Input
                id="updateIncrementAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter bid increment amount"
                value={incrementAmount}
                onChange={(e) => setIncrementAmount(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                The amount to increase your bid by when outbid. Minimum increments may apply based on auction rules.
              </p>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription className="text-xs">
                Updating your autobid settings will affect how the system bids on your behalf for the remainder of this
                auction. If you increase your maximum bid, you may win the auction at a higher price than your previous
                maximum.
              </AlertDescription>
            </Alert>

            <DialogFooter className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsUpdateDialogOpen(false)
                  // Optionally reopen the info dialog
                  setIsInfoDialogOpen(true)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Autobid"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

