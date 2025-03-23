"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import BuyerNotifications from "../components/buyer-notifications" 
import SellerNotifications from "../components/seller-notifications" 
import { Skeleton } from "@/components/ui/skeleton"

export default function Notifications() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Get logged in user details from Redux store
  const userdetails = useSelector((data) => data.CarUser.userDetails)
  const userId = useSelector((data) => data.CarUser.userDetails?.id)

  useEffect(() => {
    if (userId) {
      setLoading(false)
    }
  }, [userId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-start gap-3 p-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  // Render the appropriate component based on user type
  return userdetails?.type === "customer" ? <BuyerNotifications id={id} /> : <SellerNotifications id={id} />
}

