"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState, useRef } from "react"
import ProfilePage from "./Profile"
import { useParams } from "next/navigation"
import MyListingsSection from "./Listing"
import MybidsSection from "./Bids"
import MyInvoicesSection from "./Invoices"
import MyFavoritesSection from "./Favourites"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import {  getUserBids } from "../Actions"
import Settings from "./Settings"
import MyPurchaseHistory from "./PurchaseHistory"
import PricePlan from "./PricePlan"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function MyProfile() {
  const params = useParams()
  const curenttab = params.id
  const [activeTab, setActiveTab] = useState(curenttab)
  const UserDetails = useSelector((data) => data.CarUser.userDetails)
  const [UserBids, setUserBids] = useState([])
  const userid = useSelector((data) => data.CarUser.userDetails?.id)
  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (userid) {
      getUserBids(userid).then((data) => {
        setUserBids(data)
      })
    }
  }, [userid, dispatch])

  useEffect(() => {
    // Function to handle clicks outside the menu
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    // Add event listener when menu is open
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  // Add scroll event listener to detect when to make the button sticky
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    setIsMenuOpen(false) // Close menu when a tab is clicked
  }

  console.log("UserBids is:", UserBids)
  const tabs = [
    { id: "my-profile", label: "Profile", component: <ProfilePage /> },
    { id: "my-listings", label: "Listings", component: <MyListingsSection /> },
    { id: "my-bids", label: "Bids", component: <MybidsSection bids={UserBids} /> },
    { id: "my-invoices", label: "Invoices", component: <MyInvoicesSection /> },
    { id: "my-favorites", label: "Favorites", component: <MyFavoritesSection /> },
    { id: "my-settings", label: "Settings", component: <Settings /> },
    { id: "purchase-history", label: "Purchase History", component: <MyPurchaseHistory /> },
    { id: "price-plan", label: "Price Plan", component: <PricePlan /> },
  ]

  return (
    <div className="w-full h-full md:px-36 py-20 gap-4 flex">
      <div className="w-1/4 bg-gray-50 rounded-lg md:block hidden sticky top-36 h-fit">
        <nav className="hidden md:flex flex-col space-y-1">
          {tabs.map((tab) => (
            <Link
              href={`/${tab.id}`}
              key={tab.id}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900",
                activeTab === tab.id ? "bg-gray-100 text-gray-900 border-l-2 border-gray-900" : "text-gray-600",
              )}
            >
              {tab.label}
            </Link>
          ))}
          <button
            className="flex items-center px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-gray-100 hover:text-red-600"
            onClick={() => {
              // Handle sign out logic here
              console.log("Sign out clicked")
            }}
          >
            Sign Out
          </button>
        </nav>
      </div>

      {/* Mobile Menu - Now with sticky positioning */}
      <div
        className={cn(
          "md:hidden z-10 transition-all duration-300",
          scrolled ? "fixed top-[7.2rem] right-4" : "absolute right-4 -mt-4",
        )}
        ref={menuRef}
      >
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          variant="outline"
          className={cn("flex items-center gap-2", scrolled ? "shadow-md bg-white" : "")}
        >
          <div className="relative w-5 h-5">
            <X
              className={cn(
                "absolute inset-0 h-5 w-5 transform transition-all duration-300",
                isMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-45 scale-75",
              )}
            />
            <Menu
              className={cn(
                "absolute inset-0 h-5 w-5 transform transition-all duration-300",
                isMenuOpen ? "opacity-0 -rotate-45 scale-75" : "opacity-100 rotate-0 scale-100",
              )}
            />
          </div>
          Tabs
        </Button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <nav className="flex flex-col py-1">
              {tabs.map((tab) => (
                <Link
                  href={`/${tab.id}`}
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900",
                    activeTab === tab.id ? "bg-gray-100 text-gray-900 border-l-2 border-gray-900" : "text-gray-600",
                  )}
                >
                  {tab.label}
                </Link>
              ))}
              <button
                className="flex items-center px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-gray-100 hover:text-red-600"
                onClick={() => {
                  // Handle sign out logic here
                  console.log("Sign out clicked")
                  setIsMenuOpen(false)
                }}
              >
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </div>

      <div className="w-full px-3 md:px-0">{tabs.find((tab) => tab.id === activeTab)?.component}</div>
    </div>
  )
}

