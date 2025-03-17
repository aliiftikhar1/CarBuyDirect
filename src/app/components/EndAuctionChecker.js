import { useEffect, useState } from "react";

export default function EndAuctionsChecker() {
  const [auctions, setAuctions] = useState([]); 
  const [checkedAuctions, setCheckedAuctions] = useState(new Set()); 

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const response = await fetch("/api/admin/auctionmanagement/Live");
        const data = await response.json();
        setAuctions(data.data || []); 
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    }
    fetchAuctions();
  }, []); 

  
  const endAuction = async (auction) => {
    if (!auction?.Bids?.length) return; 

    try {
      const response = await fetch(`/api/user/endAuction/${auction.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: auction.Bids[0].price,
          currency: auction.Bids[0].currency,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to end auction ${auction.id}`);
      }

      console.log(`Auction ${auction.id} ended successfully`);
      setCheckedAuctions((prev) => new Set([...prev, auction.id]));
    } catch (error) {
      console.error(`Error ending auction ${auction.id}:`, error);
    }
  };

  useEffect(() => {
    const checkAuctions = () => {
      const currentDate = new Date();

      auctions.forEach((auction) => {
        const endDate = new Date(auction.endDate);

        if (currentDate >= endDate && auction.status === "Live" && !checkedAuctions.has(auction.id)) {
          endAuction(auction);
        }
      });
    };

    const intervalId = setInterval(checkAuctions, 1000); 

    return () => clearInterval(intervalId); 
  }, [auctions, checkedAuctions]); 

  return null;
}
