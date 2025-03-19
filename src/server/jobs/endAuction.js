import cron from "node-cron"

let processedAuctions = new Set()
let processingAuctions = new Set()

const fetchLiveAuctions = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/auctionmanagement/Live`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching auctions:", error)
    return []
  }
}

const endAuction = async (auction) => {
  try {
    console.log("Ending auction:", auction.id, "with bid:", auction?.Bids[0])

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/endAuction/${auction.id}`, {
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

    processedAuctions.add(auction.id)
    processingAuctions.delete(auction.id)
  } catch (error) {
    console.error(`Error ending auction ${auction.id}:`, error)
    processingAuctions.delete(auction.id)
  }
}

// **Cron Job to Run Every 10 Seconds**
cron.schedule("*/10 * * * * *", async () => {
  console.log("Checking auctions...")

  const auctions = await fetchLiveAuctions()
  const currentDate = new Date()

  auctions.forEach((auction) => {
    const endDate = new Date(auction.endDate)

    if (
      currentDate >= endDate &&
      auction.status === "Live" &&
      !processedAuctions.has(auction.id) &&
      !processingAuctions.has(auction.id)
    ) {
      processingAuctions.add(auction.id)

      if (auction?.Bids?.length) {
        endAuction(auction)
      } else {
        processedAuctions.add(auction.id)
        processingAuctions.delete(auction.id)
      }
    }
  })
})
