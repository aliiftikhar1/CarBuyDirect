'use client'

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import MyProfileSection from "../profile-components/myprofilesection"
import ProfilePage from "./Profile"
// import MyBiddingSection from "./my-bidding-section"
// import MyAccountSection from "./my-account-section"
import { useParams } from "next/navigation"
import MyListingsSection from "./Listing"
import MybidsSection from "./Bids"
import MyInvoicesSection from "./Invoices"
import MyFavoritesSection from "./Favourites"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { getUserDetails, getUserBids } from "../Actions"
import Settings from "./Settings"
import MyPurchaseHistory from "./PurchaseHistory"
import PricePlan from "./PricePlan"


export default function MyProfile() {
  const params = useParams()
  const curenttab = params.id
  const [activeTab, setActiveTab] = useState(curenttab)
  const UserDetails = useSelector((data) => data.CarUser.userDetails)
  const [UserBids, setUserBids] = useState([])
  const userid = useSelector((data) => data.CarUser.userDetails?.id)
  const dispatch = useDispatch()

  useEffect(() => {
    if (userid) {
      console.log("User id is:", userid)
      getUserDetails(userid,dispatch).then((data) => {
        console.log("UserDetails is:", data)
      })
      getUserBids(userid).then((data) => {
        setUserBids(data)
      })

    }
  }, [userid])

  console.log("UserBids is:", UserBids)
  const tabs = [
    { id: 'my-profile', label: 'Profile', component: <ProfilePage /> },
    { id: 'my-listings', label: 'Listings', component: <MyListingsSection /> },
    { id: 'my-bids', label: 'Bids', component: <MybidsSection bids={UserBids} /> },
    { id: 'my-invoices', label: 'Invoices', component: <MyInvoicesSection /> },
    { id: 'my-favorites', label: 'Favorites', component: <MyFavoritesSection /> },
    { id: 'my-settings', label: 'Settings', component: <Settings/> },
    { id: 'purchase-history', label: 'Purchase History', component: <MyPurchaseHistory/> },
    { id: 'price-plan', label: 'Price Plan', component: <PricePlan/> },
  ]

  return (
    <div className="w-full h-full md:px-36 py-20 gap-4 flex">
      <div className="w-1/4 bg-gray-50 rounded-lg md:block hidden sticky top-36 h-fit">
        <nav className="hidden md:flex flex-col space-y-1">
          {tabs.map((tab) => (
            <Link
              href={`/${tab.id}`}
              key={tab.id}
              // onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900",
                activeTab === tab.id
                  ? "bg-gray-100 text-gray-900 border-l-2 border-gray-900"
                  : "text-gray-600"
              )}
            >
              {tab.label}
            </Link>
          ))}
          <button
            className="flex items-center px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-gray-100 hover:text-red-600"
            onClick={() => {
              // Handle sign out logic here
              console.log('Sign out clicked')
            }}
          >
            Sign Out
          </button>
        </nav>
      </div>
      <div className="w-full">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  )
}

