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
  const [trigger, settriggerfetch] = useState(false);
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

  
  useEffect(() => {
    GetAuctions();
  }, [trigger, id]); // Fetch auction data when handler or id changes

  if (loading) {
    
    return <SkeletonLoader/>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error loading auctions: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center h-auto mt-12">
      {auctionItem && <HeroSection data={auctionItem} triggerfetch={settriggerfetch} trigger={trigger}/>}
    </div>
  );
}
