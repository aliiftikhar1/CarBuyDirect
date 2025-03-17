// components/TabSectionWithButtons.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // shadcn/ui button component
import { cn } from "@/lib/utils"; // helper for conditional classNames if using shadcn/utils

const TabSectionWithButtons = ({data}) => {
  const [activeTab, setActiveTab] = useState("ALL");

  const tabs = [
    "ALL",
    "EXTERIOR",
    "INTERIOR",
    "MECHANICAL",
    "DOCUMENTATION",
    "OTHER",
    "VIDEOS",
  ];

  return (
    <div className="flex w-full px-20 gap-4  justify-between border-t border-gray-200 py-4">
      {/* Tab Section */}
      <div className="w-3/4 flex flex-col space-y-2">
      {/* <div className="flex justify-between space-x-4 h-16 items-center bg-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
             `px-[20px] h-full text-base font-medium flex space-x-4 items-center
              ${activeTab === tab? "bg-gray-300"
                : "text-gray-500 hover:text-black"}
                `
            }
          >
            {tab}
          </button>
        ))}
      </div> */}
      <div className="flex space-x-8 text-xl h-16 items-center ">
        <div>
            Auction View: <strong>{data?.views}</strong>
        </div>
        <div>
            Watching: <strong>{data?.watching}</strong>
        </div>

      </div>
      </div>
      {/* Buttons */}
      <div className="flex flex-col space-y-2 w-1/4">
        <Button variant="outline" className="w-full h-16 rounded-none text-xl  bg-yellow-500 text-white hover:bg-gold-600">
          SCHEDULE VIEWING
        </Button>
        <Button variant="outline" className="w-full h-16 rounded-none text-xl  bg-yellow-500 text-white hover:bg-gold-600">
          ASK THE SELLER A QUESTION
        </Button>
      </div>
    </div>
  );
};

export default TabSectionWithButtons;
