"use client";

import { useEffect, useState, useCallback } from "react";
import AuctionTable from "./AuctionTable";
import CreateAuctionDialog from "./CreateAuctionDialog";
import { useSelector } from "react-redux";

export default function AuctionManagementPage() {
  const user = useSelector((data)=>data.CarUser.userDetails)
  const [auctions, setAuctions] = useState([]);
  const [carSubmissions, setCarSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
   async function getAuctions() {
    try {
      const response = await fetch(`/api/admin/auctionmanagement/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch auctions");
      }
  
      const data = await response.json();
      // console.log("Data",data)
      return data.data; // Ensure your API returns data in this structure.
    } catch (error) {
      console.error("Error fetching auctions:", error);
      return [];
    }
  }
  
   async function getCarSubmissions() {
    try {
      const response = await fetch(`/api/admin/approvedcarsubmissions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch auctions");
      }
  
      const data = await response.json();
      // console.log("Data",data)
      return data.data; // Ensure your API returns data in this structure.
  
    } catch (error) {
      console.error("Error fetching auctions:", error);
      return [];
    }
  }
  // useCallback ensures the function is stable and avoids unnecessary re-renders
  const fetchData = useCallback(async () => {
    try {
      const [auctionsData, carSubmissionsData] = await Promise.all([getAuctions(), getCarSubmissions()]);
      setAuctions(auctionsData || []);
      setCarSubmissions(carSubmissionsData || []);

      console.log("Auctions Data:", auctionsData);
      console.log("Car Submissions Data:", carSubmissionsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Pass fetchData as a dependency

  if (loading) {
    return <div className="container mx-auto p-4">Loading data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Auction Management</h1>
        {/* <CreateAuctionDialog carSubmissions={carSubmissions} fetchData={fetchData} /> */}
      </div>
      <AuctionTable initialAuctions={auctions} />
    </div>
  );
}
