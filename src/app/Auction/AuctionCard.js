"use client"

import { Check, CircleMinus, CirclePlus, MapPin, PackageOpen, Star } from "lucide-react"
import Image from "next/image"
import TimerComponent from "../components/CountDownTimer"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import EndAuctionTimerComponent from "../components/EndAuctionCountDownTimer"
import BuynowButton from "../components/BuynowButton"

export default function AuctionCard({ item, index, watchdata, OnWatch, setloadingAction , setHandler, handler }) {
  const userid = useSelector((state) => state.CarUser.userDetails?.id)

  function handleWatch() {
    if (!userid) {
      toast.message("Login to watch auction!!")
      return
    }
    fetch(`/api/user/watch`, {
      method: "POST",
      body: JSON.stringify({
        auctionId: item.id,
        userId: userid,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        setloadingAction("watch")
        OnWatch()
        console.log("Success")
      } else {
        console.log("Failed")
      }
    })
  }

  function getReserveStatus(currentPrice, reservedPrice) {
    if (currentPrice >= reservedPrice) {
      return "Reserve met"
    } else if (currentPrice >= reservedPrice * 0.9) {
      return "Reserve near"
    } else {
      return "Reserve not met"
    }
  }

  const currentPrice =
    item?.Bids.length > 0 ? Number.parseFloat(item?.Bids[0]?.price) : Number.parseFloat(item.CarSubmission.price)

  const reserveStatus = item.CarSubmission?.reserved
    ? getReserveStatus(currentPrice, Number.parseFloat(item.CarSubmission.reservedPrice))
    : null

  // Get status badge based on auction status
  const getStatusBadge = () => {
    if (item.status === "Coming-Soon") {
      return (
        <span className="absolute top-2 left-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-medium">
          Coming Soon
        </span>
      )
    } else if (item.status === "Scheduled") {
      return (
        <span className="absolute top-2 left-2 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-xs font-medium">
          Scheduled
        </span>
      )
    } else if (item.status === "Ended") {
      return (
        <span className="absolute top-2 left-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs font-medium">
          Ended
        </span>
      )
    } else if (item.status === "Sold") {
      return (
        <span className="absolute top-2 left-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs font-medium">
          Sold
        </span>
      )
    } else {
      return (
        <span className="absolute top-2 left-2 bg-red-100 text-red-700 px-2 py-0.5 rounded-md text-xs font-medium">
          Active
        </span>
      )
    }
  }

  return (
    <div
      key={index}
      className="block w-full h-full relative border border-gray-200 rounded-lg transition-transform duration-300 hover:shadow-md"
    >


    
        <div className="hidden md:flex">
       
          {getStatusBadge()}

        </div>
        <div className="absolute top-[0rem] left-[4rem] sm:right-2">
        {watchdata.find((watch) => watch.auctionId === item.id && watch.userId === userid) ? (
            <div
              onClick={handleWatch}
              className="z-10 cursor-pointer absolute top-2 right-2 group bg-black text-white gap-1 text-sm md:text-lg rounded-full flex px-2 py-1 hover:bg-gray-800 transition-colors"
            >
              <Star className="text-white transition-all group-hover:animate-ping absolute duration-300 fill-white group-hover:text-white" />
              <Star className="text-white transition-all duration-300 fill-white group-hover:text-white" />
              <span className="ml-0.5">{item?.Watching?.length}</span>
            </div>
          ) : (
            <div
              onClick={handleWatch}
              className="z-10 cursor-pointer absolute top-2 right-2 group bg-black text-white gap-1 text-sm md:text-lg rounded-full flex px-2 py-1 hover:bg-gray-800 transition-colors"
            >
              <Star className="text-white size-5 md:size-6 transition-all duration-300 group-hover:fill-white group-hover:text-white" />
              <span className="ml-0.5">{item?.Watching?.length}</span>
            </div>
          )}
           <div className="absolute hidden md:flex top-[3.2rem] right-2">
            <BuynowButton data={item} setHandler={setHandler} handler={handler}/>
            </div>
          </div>
      
      <a
        href={`/Auction/${item.CarSubmission?.webSlug}`}
        className="flex w-full group flex-row h-36 md:h-[15rem] bg-white rounded-lg overflow-hidden"
      >
        {/* Image Container with gradient overlay */}
        <div className="relative w-2/5 md:max-w-1/5  aspect-square overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 pointer-events-none"></div>
          <Image
            fill
            src={
              item?.CarSubmission?.SubmissionImages?.find((image) => image.label === "portrait")?.data ||
              "/placeholder.jpg" ||
              "/placeholder.svg"
            }
            alt={item?.CarSubmission?.vehicleModel || "Vehicle"}
            className="object-cover group-hover:scale-[1.05] transition-transform duration-500"
            priority={index < 4}
          />
        </div>

        {/* Content Container */}
        <div className="w-3/5 md:w-full flex flex-col justify-between flex-grow md:py-3 py-3 px-3 bg-gradient-to-r from-gray-50 to-white">
          {/* Vehicle Title */}
          <div className="w-full h-full flex justify-between items-center">
          <div className="text-left">
            <h2 className="text-sm md:text-lg font-bold line-clamp-2 text-gray-900">
              {item?.CarSubmission?.vehicleYear} {item?.CarSubmission?.vehicleMake} {item?.CarSubmission?.vehicleModel}
            </h2>
            <p className="text-xs md:text-sm font-medium text-gray-600 mt-0.5">VIN: {item?.CarSubmission?.vin}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <span className="text-xs md:text-sm font-medium text-gray-700">
                {item?.CarSubmission?.mileage}{" "}
                {item?.CarSubmission?.milageUnit ? item?.CarSubmission?.milageUnit : "mi"}
              </span>
              <div className="size-1.5 bg-gray-400 rounded-full"></div>
              <span className="text-xs md:text-sm text-gray-700">{item?.CarSubmission?.category}</span>
              <div className="size-1.5 bg-gray-400 rounded-full"></div>
              <span className="text-xs md:text-sm text-gray-700">{item?.CarSubmission?.transmission}</span>
              <div className="size-1.5 bg-gray-400 rounded-full"></div>
              <span className="text-xs md:text-sm text-gray-700">{item?.CarSubmission?.fuelType}</span>
              {item?.CarSubmission?.engineCapacity && (
                <>
                  <div className="size-1.5 bg-gray-400 rounded-full"></div>
                  <span className="text-xs md:text-sm text-gray-700">{item?.CarSubmission?.engineCapacity}</span>
                </>
              )}
            </div>
          </div>
         
          </div>

          {/* Status Section */}
          <div className="flex-grow flex justify-center items-center my-2">
            {item.status === "Coming-Soon" ? (
              <div className="bg-blue-50 rounded-lg p-2 text-center w-full">
                <h2 className="text-lg font-medium text-blue-700">Coming Soon</h2>
              </div>
            ) : item.status === "Scheduled" ? (
              <div className="bg-amber-50 rounded-lg p-2 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-center gap-2">
                  <p className="text-sm md:text-base font-medium text-amber-700">Auction Begins In</p>
                  <TimerComponent
                    className="gap-1 text-sm md:text-base font-bold text-amber-800"
                    endDate={item.startDate}
                  />
                </div>
              </div>
            ) : item.status === "Ended" ? (
              <div className="bg-gray-50 rounded-lg p-2 text-center w-full">
                <p className="text-base md:text-lg font-medium text-gray-700">Auction Ended</p>
                <p className="text-sm md:text-base font-bold text-gray-900 mt-1">
                  {item?.Bids.length > 0
                    ? item.Bids[0]?.currency + " " + item?.Bids[0]?.price
                    : item.CarSubmission.currency + " " + item.CarSubmission.price}
                </p>
              </div>
            ) : item.status === "Sold" ? (
              <div className="bg-green-50 rounded-lg p-2 text-center w-full">
                <p className="text-base md:text-lg font-medium text-green-700">Sold For</p>
                <p className="text-sm md:text-base font-bold text-green-800 mt-1">
                  {item?.Bids.length > 0
                    ? item.Bids[0]?.currency + " " + item?.Bids[0]?.price
                    : item.CarSubmission.currency + " " + item.CarSubmission.price}
                </p>
              </div>
            ) : (
              <div className="flex flex-col w-full justify-between bg-red-50/50 rounded-lg p-2">
                <div className="w-full flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600">Current Bid</p>
                    <p className="text-sm md:text-xl font-bold text-red-600">
                      {item?.Bids.length > 0
                        ? item.Bids[0]?.currency + " " + item?.Bids[0]?.price
                        : item.CarSubmission.currency + " " + item.CarSubmission.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Ends In</p>
                    <EndAuctionTimerComponent
                      className="gap-1 text-sm font-bold text-gray-900"
                      endDate={item.endDate}
                    />
                  </div>
                </div>

                <div className="mt-2 flex justify-between">
                  {item.CarSubmission?.reserved === false ? (
                    <div className="flex gap-1 items-center text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      <Check className="size-4 bg-green-500 rounded-full text-white p-[1px]" /> No Reserve
                    </div>
                  ) : (
                    <>
                      {reserveStatus && (
                        <p
                          className={`text-xs flex gap-1 items-center md:text-sm px-2 py-0.5 rounded-full ${reserveStatus === "Reserve met"
                              ? "bg-green-100 text-green-700"
                              : reserveStatus === "Reserve near"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                          {reserveStatus === "Reserve met" ? (
                            <Check className="size-4 bg-green-500 rounded-full text-white p-[1px]" />
                          ) : reserveStatus === "Reserve near" ? (
                            <CircleMinus className="size-5 rounded-full text-yellow-500 p-[1px]" />
                          ) : (
                            <CirclePlus className="size-5 rotate-45 rounded-full text-red-500 p-[1px]" />
                          )}
                          {reserveStatus}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Price and Location */}
          <div className="flex justify-between items-center gap-1 w-full border-t border-gray-100 pt-2">
            <p className="text-xs sm:text-sm md:text-xs flex gap-1 items-center text-gray-600 truncate overflow-hidden text-ellipsis whitespace-nowrap">
              <PackageOpen className="min-size-4 size-4 text-gray-500" />
              <span className="font-medium">{item?.CarSubmission.condition}</span>
            </p>
            <p className="text-xs sm:text-sm md:text-xs flex gap-1 items-center text-gray-600 truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-full sm:max-w-full md:max-w-full">
              <MapPin className="min-size-4 size-4 text-gray-500" />
              <span className="font-medium">{item?.location}</span>
            </p>
          </div>
        </div>
      </a>
{/* Vehicle History Report Section */}
<div className="px-4 py-3 mt-2 border-t border-gray-200">
  <div className="flex flex-col sm:flex-row w-full gap-1 md:gap-4">
    {/* Left side with logos */}
    <div className="flex flex-row sm:w-2/5 justify-between items-center space-x-3">
      {/* AutoCheck logo with score */}
      <div className="flex flex-row justify-between items-center space-x-2 w-1/2">
        <div className="h-12 w-32 rounded overflow-hidden">
          <Image
            src="/logo/AutoCheck12.png"
            alt="AutoCheck"
            width={100}
            height={50}
            className="object-cover h-full w-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="text-gray-500 text-xs">Score</div>
          <div className="font-medium text-sm">70</div>
        </div>
      </div>

      {/* Carfax logo */}
      <div className="h-12 w-52 md:w-24  rounded overflow-hidden">
        <Image 
          src="/logo/carfax.svg" 
          alt="Carfax Logo" 
          width={80} 
          height={30} 
          className="object-contain h-full w-full"
        />
      </div>
    </div>

    {/* Right side with vehicle data and button */}
    <div className="flex flex-col  sm:flex-row sm:w-3/5 items-center justify-between md:mt-3 sm:mt-0">
      {/* Vehicle history data */}
      <div className="grid grid-cols-5 gap-1 md:gap-4 w-full ">
        <div className="flex flex-col justify-center items-center">
          <div className="text-gray-500 text-xs">Owners</div>
          <div className="font-medium text-sm">4</div>
        </div>
        
        <div className="flex flex-col justify-center items-center">
          <div className="text-gray-500 text-xs">ACDNT</div>
          <div className="font-medium text-sm">0</div>
        </div>
        
        <div className="flex flex-col justify-center items-center">
          <div className="text-gray-500 text-xs">Titles</div>
          <div className="text-green-600">
            <Check className="h-4 w-4" />
          </div>
        </div>
        
        <div className="flex flex-col justify-center items-center">
          <div className="text-gray-500 text-xs">ODO</div>
          <div className="text-green-600">
            <Check className="h-4 w-4" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
        <button 
          className="text-[8px] md:text-xs flex justify-center items-center text-center h-8 px-4 w-full bg-white border border-blue-500 text-blue-700 rounded hover:bg-blue-50 font-medium transition-colors"
        >
          VIEW REPORT
        </button>
      </div>
      </div>
      
      {/* View Report button */}
     
    </div>
  </div>
</div>
    </div>
  )
}

