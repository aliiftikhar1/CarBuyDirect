"use client"

import { useEffect, useState, useRef } from "react"

export default function EndAuctionsChecker() {
  const [auctions, setAuctions] = useState([])
  // Track both completed auctions and auctions currently being processed
  const processedAuctions = useRef(new Set())
  const processingAuctions = useRef(new Set())
  const intervalId = useRef(null)

  const fetchAuctions = async () => {
    try {
      const response = await fetch("/api/admin/auctionmanagement/Live")
      const data = await response.json()
      setAuctions(data.data || [])
    } catch (error) {
      console.error("Error fetching auctions:", error)
    }
  }

  useEffect(() => {
    fetchAuctions()
  }, [1])

  useEffect(()=>{
    intervalId.current = setInterval(() => {
      const currentDate = new Date()

      auctions.forEach((auction) => {
        const endDate = new Date(auction.endDate)

        // Check if auction has ended, is live, and hasn't been processed or isn't currently being processed
        if (
          currentDate >= endDate &&
          auction.status === "Live" &&
          !processedAuctions.current.has(auction.id) &&
          !processingAuctions.current.has(auction.id)
        ) {
          // Mark as processing before making the API call
          processingAuctions.current.add(auction.id)

          // Only process auctions with bids
          if (auction?.Bids?.length) {
            endAuction(auction)
          } else {
            // If no bids, just mark as processed
            processedAuctions.current.add(auction.id)
            processingAuctions.current.delete(auction.id)
          }
        }
      })
    }, 1000)

    return () => clearInterval(intervalId.current)
  })

  const endAuction = async (auction) => {
    try {
      console.log("Ending auction:", auction.id, "with bid:", auction?.Bids[0])

      const response = await fetch(`/api/user/endAuction/${auction.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: auction.Bids[0].userId,
          price: auction.Bids[0].price,
          currency: auction.Bids[0].currency,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to end auction ${auction.id}`)
      }

      console.log(`Auction ${auction.id} ended successfully`)

      // Mark as processed and remove from processing
      processedAuctions.current.add(auction.id)
      processingAuctions.current.delete(auction.id)
      // Refresh auctions list
      fetchAuctions()

      window.location.reload();

    } catch (error) {
      console.error(`Error ending auction ${auction.id}:`, error)
      // Remove from processing so it can be retried
      processingAuctions.current.delete(auction.id)
    }
  }

  return null
}

