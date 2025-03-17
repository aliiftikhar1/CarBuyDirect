import Skeleton from "@mui/material/Skeleton";

export default function AuctionListSkeleton() {
    return (
        <div className="px-2 md:px-20">
            <div className="py-2 flex  flex-row  items-center  space-x-4">
                <h2 className="uppercase font-extrabold text-base md:text-xl">Auction</h2>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="md:border relative py-2 md:p-4">
                        <div className="z-10 absolute top-6 left-6 right-auto md:left-auto md:right-6 bg-gray-300 rounded-full flex px-2 py-1">
                            <Skeleton variant="circular" width={24} height={24} />
                            <Skeleton variant="text" width={20} height={24} />
                        </div>
                        <div className="bg-white h-[90%] group relative shadow-lg overflow-hidden">
                            <Skeleton variant="rectangular" width="100%" height="650px" />
                            <div className="w-full h-full bg-black/20 absolute top-0"></div>
                        </div>
                        <div className="pt-2 px-2 md:pt-5 md:px-5 absolute bottom-40 text-white w-full">
                            <div className="flex justify-between text-base md:text-xl">
                                <div>
                                    <Skeleton variant="text" width={60} height={24} />
                                    <Skeleton variant="text" width={120} height={28} />
                                    <Skeleton variant="text" width={100} height={24} />
                                </div>
                                <div className="text-right pe-5">
                                    <Skeleton variant="text" width={80} height={40} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
