'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TimerComponent from "./components/CountDownTimer";
import Title from "./components/Title";
import Gallery from "./components/Gallery";
import TabSectionWithButtons from "./components/MainGallerySection";
import Highlights from "./components/Hightlights";
import TechnicalData from "./components/TechnicalData";
import CustomLayout from "./components/CustomLayout";
import Description from "./components/Description";
import AuctionDetails from "./components/AuctionDetails";

export default function Car() {
  const { id } = useParams();
  const [auctionItems, setAuctionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GetAuctions = async () => {
    try {
      const response = await fetch(`/api/user/FetchAuctions/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch auction data.");
      }
      const result = await response.json();
      console.log("Data",result)
      setAuctionItems(result.data || []);
    } catch (error) {
      console.error("Error fetching auction data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetAuctions();
  }, []); // Empty array ensures fetch runs only once on mount.

  if (loading) {
    return <div className="text-center mt-20">Loading auctions...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        Error loading auctions: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-auto mt-20">
      <Title data={auctionItems} />
      <Gallery data={auctionItems} />
      <TabSectionWithButtons data={auctionItems} />
      <Highlights data={auctionItems} />
      <CustomLayout>
        <TechnicalData data={auctionItems} />
        <Description data={auctionItems} />
        <AuctionDetails data={auctionItems} />
      </CustomLayout>
    </div>
  );
}
