import { Star } from "lucide-react";
import { useSelector } from "react-redux";
import TimerComponent from "../Car/[id]/components/CountDownTimer";
import { toast } from "sonner";

export default function Auction({ items, watchdata }) {
    const userid = useSelector((state) => state.CarUser.userDetails?.id);
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
                setloadingAction('watch')
                OnWatch();
                // setloadingAction('default')
                console.log("Success");
            } else {
                console.log("Failed");
            }
        });
    }


    return (
        <div className="px-2 md:px-20">
            <div className="py-2 flex  flex-row  items-center  space-x-4">
                <h2 className="uppercase font-extrabold text-base md:text-xl">Results</h2>
                {/* <p className="text-sm md:text-base">Country: ALL</p> */}
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 ">
                {items.filter((item)=>(item.status==='Ended')).map((item) => (
                    <div key={item.id} className="md:border relative py-2  md:p-4 ">
                        {watchdata.find((watch) => (watch.auctionId === item.id && watch.userId === userid)) ? (
                            <div onClick={handleWatch} className="z-10 cursor-pointer absolute top-6 left-6 right-auto md:left-auto md:right-6 group bg-black text-white gap-1 text-sm md:text-lg rounded-full flex px-2 py-1">
                                {/* <div className="size-5 group-hover:animate-ping bg-white rounded-full absolute"></div> */}
                                <Star
                                    className="text-white transition-all group-hover:animate-ping absolute duration-300 fill-white group-hover:text-white"
                                />
                                <Star
                                    className="text-white transition-all duration-300 fill-white group-hover:text-white"
                                />
                                {item?.Watching?.length}
                            </div>) : (<div onClick={handleWatch} className="z-10 cursor-pointer absolute top-6 left-6 right-auto md:left-auto md:right-6 group bg-black text-white gap-1 text-sm md:text-lg rounded-full flex px-2 py-1">
                                <Star
                                    className="text-white size-5 md:size-6 transition-all duration-300 group-hover:fill-white group-hover:text-white"
                                />
                                {item?.Watching?.length}
                            </div>)}
                            <a href={`/Auction/${item.CarSubmission?.webSlug}`} className="cursor-pointer">
                        <div className="bg-white h-[90%] group relative shadow-lg overflow-hidden ">
                            <img
                                src={
                                    item?.CarSubmission?.SubmissionImages?.find(
                                        (image) => image.label === "portrait"
                                    )?.data || "/placeholder.jpg"
                                }
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-[1.07] transform transition-all duration-500"
                            />

                            <div className="w-full h-full bg-black/20 absolute top-0"> </div>
                            <div className="p-2 md:p-5 absolute z-10 bottom-0 text-white w-full">
                                <div className="flex justify-between text-base md:text-xl">
                                    <div>
                                        <p>  {item?.CarSubmission?.vehicleYear}</p>
                                        <h3 className="font-extrabold text-2xl">{item?.CarSubmission?.vehicleMake}</h3>
                                        <p>{item?.CarSubmission?.vehicleModel}</p>
                                    </div>
                                    <div>
                                        <p className=" text-right  text-base md:text-lg font-[300]">
                                            {item.location.split(",").map((part, index) => (
                                                <span key={index}>
                                                    {part}
                                                    {index < item.location.split(",").length - 1 && <br />}
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </a>
                        {/* statussection */}
                        <div className="flex-grow h-16 flex justify-center items-center mt-2">
                                                {item.status === "Coming-Soon" ? (
                                                    <h2 className="text-xl font-[200] tracking-tight">Comming Soon</h2>
                                                ) : item.status === "Scheduled" ? (
                                                    <div className="text-left flex gap-4">
                                                        <p className="text-xl font-[200] tracking-tight">
                                                            Auction Begins In
                                                        </p>
                                                        <TimerComponent
                                                            className="gap-1 text-lg"
                                                            endDate={item.startDate}
                                                        />
                                                    </div>
                                                ) : item.status === "Ended" ? (
                                                    <div className="text-left flex gap-4">
                                                        <p className="text-lg md:text-xl font-[200] tracking-tight">Auction Ended</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex  w-full justify-between mt-2">
                                                        <div className="w-full">
                                                            <p className="text-xs md:text-sm text-gray-600">Latest bid</p>
                                                            <p className="text-sm md:text-xl font-bold text-red-500">
                                                                {item?.Bids.length > 0
                                                                    ? item?.Bids[0]?.price +
                                                                    " " +
                                                                    item.Bids[0]?.currency
                                                                    : item.CarSubmission.currency +
                                                                    " " +
                                                                    item.CarSubmission.price}
                                                            </p>
                                                        </div>
                                                        <div className="text-right flex flex-col items-end w-full">
                                                            <p className="text-xs sm:text-sm text-gray-600">Time left</p>
                                                            <TimerComponent
                                                                className="gap-1 text-sm w-auto "
                                                                endDate={item.endDate}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                        {/* <div className="mt-4 flex items-center justify-between px-1">
                            <div>
                                <div className="text-sm text-muted-foreground">Latest bid</div>
                                <div className="text-xl font-bold">{item.latestBid}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-muted-foreground">Time left</div>
                                <div className="text-xl font-bold text-[#B1955A]">{item.timeLeft}</div>
                            </div>
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
    );
}
