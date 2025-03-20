import express from "express";
import cron from "node-cron";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Store processed auction IDs with timestamps to allow cleanup
const processedAuctions = new Map(); // Map<auctionId, timestamp>
// Track auctions currently being processed
const processingAuctions = new Set();

// Configuration
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
const AUCTION_CLEANUP_HOURS = 24; // Keep processed auctions in memory for 24 hours
const MAX_CONCURRENT_PROCESSES = 5; // Process up to 5 auctions concurrently

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    processedCount: processedAuctions.size,
    processingCount: processingAuctions.size
  });
});


const fetchLiveAuctions = async () => {
  try {
    console.log("Fetching live auctions...");
    const response = await fetch(`${API_URL}/api/admin/auctionmanagement/Live/1`);

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Live AUctions are : ", data.data);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching auctions:", error.message);
    return [];
  }
};


const endAuction = async (auction) => {
  if (!auction?.id) {
    console.error("Invalid auction object received");
    return false;
  }

  try {
    console.log(`Processing auction ${auction.id} ending at ${auction.endDate}`);
    
    if (!auction.Bids || auction.Bids.length === 0) {
      console.log(`Auction ${auction.id} has no bids, marking as processed`);
      return true;
    }
    
    const winningBid = auction.Bids[0];
    console.log(`Ending auction ${auction.id} with winning bid: ${winningBid.price} ${winningBid.currency} by user ${winningBid.userId}`);

    const response = await fetch(`${API_URL}/api/user/endAuction/${auction.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userid: winningBid.userId,
        price: winningBid.price,
        currency: winningBid.currency,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}: ${JSON.stringify(data)}`);
    }

    console.log(`Auction ${auction.id} ended successfully:`, data);
    return true;
  } catch (error) {
    console.error(`Error ending auction ${auction.id}:`, error.message);
    
    return false;
  }
};


const processEndedAuctions = async () => {
  try {
    console.log("Checking for ended auctions...");
    const auctions = await fetchLiveAuctions();
    const currentDate = new Date();
    const endedAuctions = [];

    for (const auction of auctions) {
      const endDate = new Date(auction.endDate);
      
      if (
        currentDate >= endDate &&
        auction.status === "Live" &&
        !processedAuctions.has(auction.id) &&
        !processingAuctions.has(auction.id)
      ) {
        endedAuctions.push(auction);
      }
    }

    if (endedAuctions.length === 0) {
      console.log("No ended auctions to process");
      return;
    }

    console.log(`Found ${endedAuctions.length} ended auctions to process`);
    
    // Process auctions concurrently with a limit
    const auctionsToProcess = endedAuctions.slice(0, MAX_CONCURRENT_PROCESSES);
    
    // Mark auctions as processing
    auctionsToProcess.forEach(auction => {
      processingAuctions.add(auction.id);
    });

    // Process auctions in parallel
    const results = await Promise.allSettled(
      auctionsToProcess.map(async (auction) => {
        try {
          const success = await endAuction(auction);
          return { auctionId: auction.id, success };
        } finally {
          // Always remove from processing set when done
          processingAuctions.delete(auction.id);
        }
      })
    );

    // Handle results
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.success) {
        // Store with timestamp for later cleanup
        processedAuctions.set(result.value.auctionId, Date.now());
      }
    });

    console.log(`Processed ${results.length} auctions`);
  } catch (error) {
    console.error("Error in auction processing cycle:", error.message);
  }
};

/**
 * Clean up old processed auction records to prevent memory leaks
 */
const cleanupProcessedAuctions = () => {
  const now = Date.now();
  const expiryTime = AUCTION_CLEANUP_HOURS * 60 * 60 * 1000; // Convert hours to milliseconds
  let cleanupCount = 0;
  
  for (const [auctionId, timestamp] of processedAuctions.entries()) {
    if (now - timestamp > expiryTime) {
      processedAuctions.delete(auctionId);
      cleanupCount++;
    }
  }
  
  if (cleanupCount > 0) {
    console.log(`Cleaned up ${cleanupCount} old auction records`);
  }
};

// Cron job to check for ended auctions every 5 seconds
cron.schedule("*/5 * * * * *", processEndedAuctions);

// Cron job to clean up processed auctions once per hour
cron.schedule("0 * * * *", cleanupProcessedAuctions);

// Start the server
app.listen(PORT, () => {
  console.log(`Auction processing server running on port ${PORT}`);
  console.log(`API URL: ${API_URL}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});