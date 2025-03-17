import { Check, CircleMinus, CirclePlus, MapPin, PackageOpen, Star } from "lucide-react"
import Image from "next/image"
import TimerComponent from "../Car/[id]/components/CountDownTimer"
import { useSelector } from "react-redux"
import { toast } from "sonner"

export default function AuctionCard({ item, index, watchdata, OnWatch, setloadingAction }) {
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

  return (
    <div key={index} className="block w-full h-full relative border rounded-lg transition-transform duration-300">
      {watchdata.find((watch) => watch.auctionId === item.id && watch.userId === userid) ? (
        <div
          onClick={handleWatch}
          className="z-10 cursor-pointer absolute top-2 left-2 right-auto md:left-auto md:right-2 group bg-black text-white gap-1 text-sm md:text-lg rounded-full flex px-2 py-1"
        >
          <Star className="text-white transition-all group-hover:animate-ping absolute duration-300 fill-white group-hover:text-white" />
          <Star className="text-white transition-all duration-300 fill-white group-hover:text-white" />
          {item?.Watching?.length}
        </div>
      ) : (
        <div
          onClick={handleWatch}
          className="z-10 cursor-pointer absolute top-2 left-2 right-auto md:left-auto md:right-2 group bg-black text-white gap-1 text-sm md:text-lg rounded-full flex px-2 py-1"
        >
          <Star className="text-white size-5 md:size-6 transition-all duration-300 group-hover:fill-white group-hover:text-white" />
          {item?.Watching?.length}
        </div>
      )}

      <a
        href={`/Auction/${item.CarSubmission?.webSlug}`}
        className="flex w-full group flex-row md:flex-col h-36 md:h-full bg-white rounded-lg shadow-sm overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative w-2/5 md:w-full aspect-square sm:aspect-[16/10] md:aspect-[4/3] overflow-hidden">
          <Image
            fill
            src={
              item?.CarSubmission?.SubmissionImages?.find((image) => image.label === "portrait")?.data ||
              "/placeholder.jpg"
            }
            alt={item.name}
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            priority={index < 4}
          />
        </div>

        {/* Content Container */}
        <div className="w-3/5 md:w-full flex flex-col justify-between flex-grow md:py-2 py-2 px-2">
          {/* Vehicle Title */}
          <div className="text-left">
            <h2 className="text-sm md:text-lg font-bold line-clamp-2">
              {item?.CarSubmission?.vehicleYear} {item?.CarSubmission?.vehicleMake} {item?.CarSubmission?.vehicleModel}
            </h2>
          </div>

          {/* Status Section */}
          <div className="flex-grow flex justify-center items-center">
            {item.status === "Coming-Soon" ? (
              <h2 className="text-xl font-[200] tracking-tight">Coming Soon</h2>
            ) : item.status === "Scheduled" ? (
              <div className="text-left flex gap-4">
                <p className="text-xl font-[200] tracking-tight">Auction Begins In</p>
                <TimerComponent className="gap-1 text-lg" endDate={item.startDate} />
              </div>
            ) : item.status === "Ended" ? (
              <div className="text-left flex gap-4">
                <p className="text-lg md:text-xl font-[200] tracking-tight">Auction Ended</p>
              </div>
            ) : (
              <div className="flex flex-col-reverse w-full justify-between mt-2">
                <div className="w-full">
                  <p className="text-sm md:text-xl font-bold text-red-500">
                    {item?.Bids.length > 0
                      ? item?.Bids[0]?.price + " " + item.Bids[0]?.currency
                      : item.CarSubmission.currency + " " + item.CarSubmission.price}
                  </p>
                 
                </div>
                <div className="text-right flex justify-between">
                  {item.CarSubmission?.reserved === false ? (
                    <div className="flex gap-1 items-center text-sm">
                      <Check className="size-4 bg-green-500 rounded-full text-white p-[1px]" /> No Reserve
                    </div>
                  ) : <>
                   {reserveStatus && (
                    <p
                      className={`text-xs flex gap-1 items-center md:text-sm ${
                        reserveStatus === "Reserve met"
                          ? "text-green-500"
                          : reserveStatus === "Reserve near"
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                    >
                        {reserveStatus === "Reserve met"
                          ?   <Check className="size-4 bg-green-500 rounded-full text-white p-[1px]" />
                          : reserveStatus === "Reserve near"
                            ?   <CircleMinus className="size-5 rounded-full text-yellow-500 p-[1px]" />
                            :   <CirclePlus className="size-5  rotate-45 rounded-full text-red-500 p-[1px]" />}
                      {reserveStatus}
                    </p>
                  )}
                  </>}
                  <TimerComponent className="gap-1 text-sm w-auto" endDate={item.endDate} />
                </div>
              </div>
            )}
          </div>

          {/* Price and Location */}
          <div className="flex justify-between items-center gap-1 w-full">
            <p className="text-xs sm:text-sm flex gap-1 items-center text-gray-600 truncate overflow-hidden text-ellipsis whitespace-nowrap">
              <PackageOpen className="size-4 md:size-4" /> {item?.CarSubmission.condition}
            </p>
            <p className="text-xs sm:text-sm flex gap-1 items-center text-gray-600 truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-20 md:max-w-full">
              <MapPin className="size-4 md:size-4" />
              {item?.location}
            </p>
          </div>
        </div>
      </a>
    </div>
  )
}

