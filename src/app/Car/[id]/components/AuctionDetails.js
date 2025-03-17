import React from "react";
import TimerComponent from "./CountDownTimer";

export default function AuctionDetails({data}) {
  const bids = [
    { user: "jingy1983", amount: "$125,000", time: "23 hours ago" },
    { user: "nycexec212", amount: "$121,000", time: "a day ago" },
    { user: "jingy1983", amount: "$120,000", time: "a day ago" },
  ];

  return (
    <div className="">
      <div className=" mx-auto  rounded-lg">
        {/* Header Section */}
        <div className="flex flex-wrap md:flex-nowrap justify-between px-6 py-4">
          {/* Auction Summary */}
          <div className="w-full md:w-1/2 space-y-3">
            <h3 className="text-2xl font-bold">AUCTION SUMMARY</h3>
            <p className="flex flex-col font-bold text-xl">
              <span className=" text-lg font-normal">Auction ends:</span> {new Date(data?.endDate).toLocaleString()}
            </p>
            <p className="flex flex-col font-bold text-xl">
            <span className=" text-lg font-normal">Auction views:</span> {data?.views}
            </p>
            <p className="flex flex-col font-bold text-xl">
            <span className=" text-lg font-normal">Watching:</span> {data?.watching}
            </p>
            <p className="flex flex-col font-bold text-xl">
            <span className=" text-lg font-normal">Location:</span>{" "}
              <span className="text-blue-700">{data?.location}</span>
            </p>
            <p className="flex flex-col font-bold text-xl">
            <span className=" text-lg font-normal">Seller:</span>{" "}
              <span className="text-yellow-600">{data?.Seller.name}</span>
            </p>
          </div>

          {/* Bid History */}
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-bold">BID HISTORY</h3>
            <ul className="mt-4 space-y-3">
              {bids?.map((bid, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center ${index==0?'border text-yellow-600':''} border p-4`}
                >
                  <div>
                  <p className="flex flex-col font-bold text-xl">
                  <span className=" text-lg font-normal text-gray-800">Bid placed by:</span> {bid.user}
                    </p>
                   
                  </div>
                  <div>
                  <p className="text-lg font-bold">{bid.amount}</p>
                  <p className="text-sm text-gray-500">{bid.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="w-full flex justify-end">
            <button className="w-[10rem] h-[3rem]  bg-yellow-500/70 text-black font-semibold mt-3 hover:underline">
              VIEW ALL 9 BIDS
            </button>
            </div>
           
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center p-6 border">
          <div className="space-x-8 flex items-center">
            <p className=" flex flex-col">
              Highest bid: <span className="text-black font-bold text-3xl">$125,000</span>
            </p>
            <p className="text-sm text-gray-500 flex flex-col text-center gap-2">Time left
                <div className="text-xl text-gray-700 w-52">
                    <TimerComponent endDate='2025-01-18' className="gap-0"/>
                </div>
            </p>
            <div className="border-l-4 bg-gray-100/50 px-2 py-1 border-gray-400 flex justify-center items-center h-10"><h2 className="text-xl">Reserve Lowered</h2></div>
          </div>
          <button className="w-[10rem] h-[3rem]  bg-yellow-500/70 text-black px-6 py-2 rounded-none shadow hover:bg-yellow-700">
            PLACE A BID
          </button>
        </div>
      </div>
    </div>
  );
}
