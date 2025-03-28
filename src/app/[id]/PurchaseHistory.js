"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { format } from "date-fns"
import { Car, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
export default function MyPurchaseHistory() {
  // No need for tabs since there's only one status
  const userid = useSelector((state) => state.CarUser?.userDetails?.id)
  const [userDetails, setUserDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  async function getListing() {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetch(`/api/user/getUserDetails/sold/${userid}`)

      if (!data.ok) {
        throw new Error("Failed to fetch purchase history")
      }

      const response = await data.json()
      setUserDetails(response.user)
    } catch (err) {
      console.error("Error fetching purchase history:", err)
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to load your purchase history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userid) {
      getListing()
    }
  }, [userid])

  // No filtering needed since all items have the same status
  const purchases = userDetails?.Sold || []

  const handleStartShopping = () => {
    // Navigate to shopping page
    window.location.href = "/marketplace"
  }

  // Simple status badge for "Sold" status
  const soldStatusBadge = (
    <Badge className="bg-green-100 text-green-800 flex items-center gap-1 px-3 py-1.5 font-medium text-xs rounded-full">
      <ShoppingBag className="w-4 h-4" />
      Sold
    </Badge>
  )

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-semibold mb-2">
            My <span className="text-[#B08968]">Purchase History</span>
          </h2>
          <p className="text-muted-foreground">Track and manage all your vehicle purchases</p>
        </div>
        <Button onClick={handleStartShopping} className="mt-4 md:mt-0 bg-[#B08968] hover:bg-[#9a7859] text-white">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Browse more cars
        </Button>
      </div>

      <div className="w-full">
        <h3 className="text-lg font-medium mb-6">Purchase History</h3>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-48 md:h-full rounded-l-lg" />
                  <div className="p-4 md:col-span-2 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <h3 className="text-xl font-semibold text-red-800">Something went wrong</h3>
            <p className="text-red-600 mt-2 mb-6">{error}</p>
            <Button onClick={getListing} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              Try again
            </Button>
          </div>
        ) : (
          <div className="mt-0">
            {!purchases.length ? (
              <div className="text-center py-16 bg-muted/30 rounded-lg space-y-4">
                <div className="bg-muted/60 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No purchases found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">You haven't made any purchases yet.</p>
                <Button onClick={handleStartShopping} className="mt-4 bg-[#B08968] hover:bg-[#9a7859] text-white">
                  Start shopping
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {purchases.map((purchase) => {
                  const purchaseDate = purchase?.createdAt ? new Date(purchase.createdAt) : null
                  const formattedDate = purchaseDate ? format(purchaseDate, "MMM dd, yyyy") : "Unknown date"
                  const carImage = purchase?.Auction?.CarSubmission?.SubmissionImages?.find(
                    (item) => item.label === "horizontal",
                  )?.data

                  return (
                    <Card key={purchase.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative h-48 md:h-full bg-muted/20">
                          {carImage ? (
                            <img
                              src={carImage || "/placeholder.svg"}
                              alt={`${purchase?.Auction?.CarSubmission?.vehicleMake} ${purchase?.Auction?.CarSubmission?.vehicleModel}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted/30">
                              <Car className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="p-6 md:col-span-2">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-semibold capitalize flex items-center gap-2">
                                {purchase?.Auction?.CarSubmission?.vehicleYear}{" "}
                                <span className="font-bold">{purchase?.Auction?.CarSubmission?.vehicleMake}</span>{" "}
                                {purchase?.Auction?.CarSubmission?.vehicleModel}
                              </h3>

                              <div className="mt-4 space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <span className="font-medium mr-2">Purchase Date:</span> {formattedDate}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <span className="font-medium mr-2">Amount:</span>
                                  <span className="font-bold text-foreground">
                                    {purchase?.price} {purchase?.currency}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {soldStatusBadge}
                          </div>

                          <CardFooter className="px-0 pt-6 pb-0 mt-4 flex justify-end border-t">
                            <Button variant="outline" size="sm" className="text-xs" onClick={()=>window.location.href=`/Auction/${purchase?.Auction?.CarSubmission?.webSlug}`}>
                              View Details
                            </Button>
                          </CardFooter>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

