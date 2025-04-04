"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import HeroSection from "./components/Herosection";
import { useSelector } from "react-redux";
import SkeletonLoader from "@/app/components/SkeletonLoader";
export default function Car() {
  const { id } = useParams();
  const [auctionItem, setAuctionItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [handler, setHandler] = useState(false);
  const userid = useSelector((data) => data.CarUser?.userDetails?.id);

  const GetAuctions = async () => {
    try {
      const response = await fetch(`/api/user/FetchAuctions/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch auction data.");
      }
      const result = await response.json();
      console.log("Data", result);
      setAuctionItem(result.data || null);
    } catch (error) {
      console.error("Error fetching auction data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // const endAuction = async (auctionId) => {
  //   try {
  //     const response = await fetch(`/api/user/endAuction/${auctionId}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ userid, price:auctionItem?.Bids[0]?.price, currency:auctionItem?.Bids[0]?.currency }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to end auction.");
  //     }

  //     console.log(`Auction ${auctionId} ended successfully`);
  //     setHandler((prev) => !prev); 
  //   } catch (error) {
  //     console.error(`Error ending auction ${auctionId}:`, error);
  //   }
  // };

  useEffect(() => {
    GetAuctions();
  }, [handler, id]); // Fetch auction data when handler or id changes

  // useEffect(() => {
  //   if (!auctionItem) return;

  //   const checkAuctionEnd = () => {
  //     const currentDate = new Date();
  //     const endDate = new Date(auctionItem.endDate);

  //     if (currentDate >= endDate && auctionItem.status === "Live") {
  //       endAuction(auctionItem.id);
  //       return true; // Auction has ended
  //     }
  //     return false; // Auction is still ongoing
  //   };

  //   const intervalId = setInterval(() => {
  //     const hasEnded = checkAuctionEnd();
  //     if (hasEnded) {
  //       clearInterval(intervalId); // Stop checking if the auction has ended
  //     }
  //   }, 1000); // Check every second

  //   return () => clearInterval(intervalId); // Clean up on unmount
  // }, [auctionItem]);

  if (loading) {
    // return <div className="text-center mt-20">Loading auctions...</div>;
    return <SkeletonLoader/>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error loading auctions: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center h-auto mt-12">
      {auctionItem && <HeroSection data={auctionItem} setHandler={setHandler} handler={handler} />}
    </div>
  );
}
