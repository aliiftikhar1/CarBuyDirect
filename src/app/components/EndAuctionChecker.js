import { useEffect, useState, useRef, useCallback } from "react";

export default function EndAuctionsChecker() {
  const [auctions, setAuctions] = useState([]);
  const checkedAuctions = useRef(new Set());
  const intervalId = useRef(null);

  // Fetch live auctions once on mount
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("/api/admin/auctionmanagement/Live");
        const data = await response.json();
        setAuctions(data.data || []);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };
    fetchAuctions();
  }, []);

  // Function to end an auction
  const endAuction = useCallback(async (auction) => {
    // if (!auction?.Bids?.length || checkedAuctions.current.has(auction.id)) return;

    console.log("Bids are", auction?.Bids[0]);
    try {
      const response = await fetch(`/api/user/endAuction/${auction.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: auction.Bids[0].userId,
          price: auction.Bids[0].price,
          currency: auction.Bids[0].currency,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to end auction ${auction.id}`);
      }

      console.log(`Auction ${auction.id} ended successfully`);
      checkedAuctions.current.add(auction.id);
    } catch (error) {
      console.error(`Error ending auction ${auction.id}:`, error);
    }
  }, []);

  // Check and end expired auctions
  useEffect(() => {
    const checkAuctions = () => {
      const currentDate = new Date();
      // console.log("Current Date is:", currentDate);

      auctions.forEach((auction) => {
        const endDate = new Date(auction.endDate);
        const localEndDate = new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60000); // Convert to local

        // console.log(`Auction ID: ${auction.id} - Local End Date:`, localEndDate);

        if (currentDate >= localEndDate && auction.status === "Live" && !checkedAuctions.current.has(auction.id)) {
          endAuction(auction);
        }
      });
    };

    intervalId.current = setInterval(checkAuctions, 1000);

    return () => clearInterval(intervalId.current);
  }, [auctions, endAuction]);

  return null;
}
