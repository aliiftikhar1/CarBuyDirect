"use client"

import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Menu, Search, X } from "lucide-react"
import { MainNav } from "./Main-nav"
import Header2 from "./Header2"
import { AuthDialogs } from "./LoginDialog"
import { useSelector } from "react-redux"
import Link from "next/link"
import { useDebounce } from "@coreui/react-pro"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((data) => data.CarUser.userDetails)
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    // Focus input when search opens
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    // Add click outside listener to close search
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch search results when debounced search term changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchTerm.trim()) {
        setSearchResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/searchCar/1?search=${debouncedSearchTerm}`,
        )
        const data = await response.json()

        if (data.success) {
          setSearchResults(data.data)
        } else {
          setSearchResults([])
        }
      } catch (error) {
        console.error("Error fetching search results:", error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
  }, [debouncedSearchTerm])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults([])
  }

  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
    if (searchOpen) {
      clearSearch()
    }
  }

  return (
    <>
      <div className="w-full h-16 md:h-20 flex justify-center items-center z-20 sticky top-0 border-b text-black bg-white px-2 md:px-20">
        <div className="flex justify-between items-center w-full bg-white z-20 border-b">
          <div className="flex justify-start items-center md:w-[12rem] ">
            <MainNav isOpen={isOpen} onOpenChange={setIsOpen}>
              <Menu className="size-7 md:size-10 cursor-pointer" />
            </MainNav>
          </div>

          <a href="/" className="flex flex-col justify-center items-center">
            <img src="/logo/1.png" className="h-16 md:h-20 w-[50vw] md:w-[25vw] object-cover" alt="Logo" />
          </a>

          <div className="flex md:w-[12rem] gap-4 text-lg font-[400] tracking-wider justify-center items-center relative">
            {user?.type === "seller" && (
              <Link href="/Seller" className="hidden absolute -left-[10rem] md:flex px-4 py-1 rounded-full border-2 border-gray-600">
                Seller Panel
              </Link>
            )}

            <div ref={searchRef} className="relative flex items-center">
              <div className="relative flex justify-center items-center">
                {searchOpen && (
                  <div className="absolute top-10 -right-10 md:-top-2 md:right-10 transition-all duration-300 ease-in-out transform border p-1 rounded-2xl w-64 shadow-md bg-white z-30 flex items-center">
                    <Input
                      ref={inputRef}
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search for auctions..."
                      className="border-none shadow-none focus-visible:ring-0"
                    />
                    {searchTerm && (
                      <X
                        className="size-4 cursor-pointer text-gray-500 hover:text-gray-700 mr-2"
                        onClick={clearSearch}
                      />
                    )}
                  </div>
                )}

                <Search className="size-6 cursor-pointer ml-2 relative z-20" onClick={toggleSearch} />

                {searchOpen && searchTerm && (
                  <div className="absolute -right-10 md:right-8 top-20 md:top-10 w-64 bg-white shadow-lg rounded-md border z-30 max-h-60 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-3 text-center text-sm text-gray-500">Loading...</div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((auction) => (
                        <a
                          href={`/Auction/${auction.CarSubmission.webSlug}`}
                          key={auction.id}
                          className="block p-3 hover:bg-gray-100 transition-all rounded-md"
                        >
                          <div className="text-sm font-medium">
                            {auction.CarSubmission.vehicleMake} {auction.CarSubmission.vehicleModel}
                          </div>
                          <div className="text-xs text-gray-500">
                            {auction.CarSubmission.vehicleYear} • {auction.CarSubmission.condition}
                          </div>
                        </a>
                      ))
                    ) : (
                      <div className="p-3 text-center text-sm text-gray-500">No matching results found</div>
                    )}
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

