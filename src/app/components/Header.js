"use client"

import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Menu, Search } from "lucide-react"
import { MainNav } from "./Main-nav"
import Header2 from "./Header2"
import { AuthDialogs } from "./LoginDialog"
import { useSelector } from "react-redux"
import Link from "next/link"
import { useSession } from "next-auth/react";
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [auctions, setAuctions] = useState([])
  const [filteredAuctions, setFilteredAuctions] = useState([])
  const user = useSelector((data) => data.CarUser.userDetails)
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  // async function checkSession() {
  //   const res = await fetch("/api/auth/session");
  //   const data = await res.json();
  //   console.log("Session Data:", data.user); // ✅ Debugging ke liye

  // }
  // checkSession();
  useEffect(() => {
    console.log("user", user)
  }, [user])
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/searchCar/1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAuctions(data.data)
          setFilteredAuctions(data.data)
        }
      })
      .catch((error) => console.error("Error fetching auctions:", error))
  }, [])

  useEffect(() => {
    // Add click outside listener to close search
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    const lowerCaseSearch = e.target.value.toLowerCase()

    if (!lowerCaseSearch.trim()) {
      setFilteredAuctions([])
      return
    }

    // Filter auctions based on search term
    const filtered = auctions.filter((auction) => {
      const { condition, vehicleModel, vehicleMake, vehicleYear } = auction.CarSubmission
      return (
        condition.toLowerCase().includes(lowerCaseSearch) ||
        vehicleModel.toLowerCase().includes(lowerCaseSearch) ||
        vehicleMake.toLowerCase().includes(lowerCaseSearch) ||
        vehicleYear.toLowerCase().includes(lowerCaseSearch)
      )
    })

    // Sort results alphabetically by make, then model
    const sorted = [...filtered].sort((a, b) => {
      // First prioritize exact matches at the beginning of strings
      const makeA = a.CarSubmission.vehicleMake.toLowerCase()
      const makeB = b.CarSubmission.vehicleMake.toLowerCase()
      const modelA = a.CarSubmission.vehicleModel.toLowerCase()
      const modelB = b.CarSubmission.vehicleModel.toLowerCase()

      // Check if search term is at the beginning of make
      const startsWithMakeA = makeA.startsWith(lowerCaseSearch)
      const startsWithMakeB = makeB.startsWith(lowerCaseSearch)

      if (startsWithMakeA && !startsWithMakeB) return -1
      if (!startsWithMakeA && startsWithMakeB) return 1

      // Check if search term is at the beginning of model
      const startsWithModelA = modelA.startsWith(lowerCaseSearch)
      const startsWithModelB = modelB.startsWith(lowerCaseSearch)

      if (startsWithModelA && !startsWithModelB) return -1
      if (!startsWithModelA && startsWithModelB) return 1

      // If both or neither start with the search term, sort alphabetically
      return makeA.localeCompare(makeB) || modelA.localeCompare(modelB)
    })

    setFilteredAuctions(sorted)
  }

  return (
    <>
      <div className="w-full h-16 md:h-20 flex justify-center items-center z-20 sticky top-0 border-b text-black bg-white px-2 md:px-20">
        <div className="flex justify-between border-b items-center w-full bg-white z-20">
          <div className="flex justify-center items-center">
            <MainNav isOpen={isOpen} onOpenChange={setIsOpen}>
              <Menu className="size-7 md:size-10 cursor-pointer" />
            </MainNav>
          </div>
          <a href="/" className="flex flex-col justify-center items-center">
            <img src="/logo/1.png" className="h-16 md:h-20 w-[50vw] md:w-[25vw] object-cover" alt="Logo" />
          </a>
          <div className="flex gap-4 text-lg font-[400] tracking-wider justify-center items-center relative">
            {/* {user?.type === "seller" && (
              <Link href="/Seller" className="hidden md:flex px-4 py-1 rounded-full border-2 border-gray-600">
                Seller Panel
              </Link>
            )} */}
            <div ref={searchRef} className="relative flex items-center">
              <div className="relative flex justify-center items-center">
                {searchOpen && (
                  <Input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search for auctions..."
                    className="absolute top-10 right-0 md:top-0 md:right-0 md:relative transition-all duration-300 ease-in-out transform border p-3 rounded-2xl w-64 shadow-md bg-white z-30"
                  />
                )}
                <Search
                  className="size-6 cursor-pointer ml-2 relative z-20"
                  onClick={() => {
                    setSearchOpen(!searchOpen)
                    if (!searchOpen) {
                      setSearchTerm("")
                      setFilteredAuctions([])
                    }
                  }}
                />

                {searchOpen && searchTerm && filteredAuctions.length > 0 && (
                  <div className="absolute right-0 md:right-8 top-20 md:top-10 w-64 bg-white shadow-lg rounded-md border z-30 max-h-60 overflow-y-auto">
                    {filteredAuctions.map((auction) => (
                      <a
                        href={`/Auction/${auction.CarSubmission.webSlug}`}
                        key={auction.id}
                        className="block p-3 hover:bg-gray-100 transition-all rounded-md"
                      >
                        <div className="text-sm">
                          {auction.CarSubmission.vehicleMake} {auction.CarSubmission.vehicleModel}
                        </div>
                        <div className="text-xs text-gray-500">
                          {auction.CarSubmission.vehicleYear} • {auction.CarSubmission.condition}
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {searchOpen && searchTerm && filteredAuctions.length === 0 && (
                  <div className="absolute right-0 md:right-8 top-20 md:top-10 w-64 bg-white shadow-lg rounded-md border z-30 p-3">
                    <p className="text-gray-500 text-sm">No matching results found</p>
                  </div>
                )}
              </div>
            </div>
            <AuthDialogs />
          </div>
        </div>
        <Header2 />
      </div>
    </>
  )
}

