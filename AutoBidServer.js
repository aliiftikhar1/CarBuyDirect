import cron from 'node-cron';
import fetch from 'node-fetch';

// URL for the API endpoints
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const FETCH_LIVE_AUCTIONS_URL = `${BASE_URL}/api/user/autoBid/fetchLiveAuction/1`;
const PLACE_BID_URL = `${BASE_URL}/api/user/autoBid/createBid`;
const DEACTIVATE_AUTOBID_URL = `${BASE_URL}/api/user/autoBid/deactivate`;

// Function to fetch live auctions
async function fetchLiveAuctions() {
  try {
    const response = await fetch(FETCH_LIVE_AUCTIONS_URL);
    const data = await response.json();
    
    if (data.status && data.data) {
      return data.data;
    } else {
      console.error('Failed to fetch live auctions:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching live auctions:', error);
    return [];
  }
}

// Function to deactivate an auto-bid
async function deactivateAutoBid(autoBidId) {
  try {
    const response = await fetch(`${DEACTIVATE_AUTOBID_URL}/${autoBidId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log(`Auto-bid ${autoBidId} deactivation result:`, data);
    return data;
  } catch (error) {
    console.error(`Error deactivating auto-bid ${autoBidId}:`, error);
    return null;
  }
}

// Function to place a new bid
async function placeBid(userId, auctionId, carId, price) {
  try {
    const response = await fetch(PLACE_BID_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        auctionId,
        carId,
        price,
        currency: 'USD',
        type: 'Auto'
      })
    });
    
    const data = await response.json();
    console.log(`New auto-bid placed for auction ${auctionId} by user ${userId} at $${price}:`, data);
    return data;
  } catch (error) {
    console.error(`Error placing bid for auction ${auctionId} by user ${userId}:`, error);
    return null;
  }
}

// Main function to process auto-bids
async function processAutoBids() {
  console.log('Running auto-bid processor...');
  
  // Fetch all live auctions
  const auctions = await fetchLiveAuctions();
  
  if (!auctions || auctions.length === 0) {
    console.log('No live auctions found.');
    return;
  }
  
  // Process each auction
  for (const auction of auctions) {
    console.log(`Processing auction ID: ${auction.id}`);
    
    // Skip if no bids or no auto-bids
    if (!auction.Bids || auction.Bids.length === 0) {
      console.log(`Auction ${auction.id} has no bids. Skipping.`);
      continue;
    }
    
    if (!auction.Autobid || auction.Autobid.length === 0) {
      console.log(`Auction ${auction.id} has no auto-bids. Skipping.`);
      continue;
    }
    
    const highestBid = auction.Bids[0]; // Bids are already ordered by createdAt desc
    const carId = auction.CarSubmission.id;
    
    console.log(`Highest bid: $${highestBid.price} by user ${highestBid.userId}`);
    
    // Process each auto-bid
    for (const autoBid of auction.Autobid) {
      // Skip if the highest bidder is the same as the auto-bidder
      if (highestBid.userId === autoBid.userId && highestBid.auctionId === autoBid.auctionId) {
        console.log(`User ${autoBid.userId} is already the highest bidder. Skipping.`);
        continue;
      }
      
      const newBidAmount = highestBid.price + autoBid.incrementAmount;
      
      // Check if new bid amount exceeds max amount
      if (newBidAmount > autoBid.maxAmount) {
        console.log(`New bid amount $${newBidAmount} exceeds max amount $${autoBid.maxAmount} for user ${autoBid.userId}. Deactivating auto-bid.`);
        await deactivateAutoBid(autoBid.id);
      } else {
        console.log(`Placing new bid of $${newBidAmount} for user ${autoBid.userId} on auction ${auction.id}`);
        await placeBid(autoBid.userId, auction.id, carId, newBidAmount);
        
        // Break after placing a bid to avoid multiple bids in the same cycle
        // The next cycle will handle further bidding
        break;
      }
    }
  }
}

// Schedule the cron job to run every minute
// You can adjust the schedule as needed
cron.schedule('* * * * *', async () => {
  try {
    await processAutoBids();
  } catch (error) {
    console.error('Error in auto-bid cron job:', error);
  }
});

console.log('Auto-bid server started. Running every minute.');

// For testing purposes, you can uncomment this to run immediately
// processAutoBids();