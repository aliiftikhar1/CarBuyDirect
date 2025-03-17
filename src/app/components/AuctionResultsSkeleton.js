import { Skeleton } from "@/components/ui/skeleton";

export default function AuctionResultsSkeleton() {
  return (
    <div className="px-2 md:px-20">
      <div className="py-2 flex flex-row items-center space-x-4">
        <h2 className="uppercase font-extrabold text-base md:text-xl">Results</h2>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="md:border relative py-2 md:p-4">
            <div className="z-10 cursor-pointer absolute top-6 left-6 right-auto md:left-auto md:right-6 group bg-black text-white gap-1 text-sm md:text-lg rounded-full flex px-2 py-1">
              <Skeleton className="w-6 h-6 rounded-full bg-gray-300" />
              <Skeleton className="w-4 h-4 rounded-full bg-gray-300" />
            </div>
            <div className="bg-white group relative shadow-lg overflow-hidden" style={{height:"400px"}}>
              <Skeleton className="w-full h-full object-cover" />
              <div className="w-full h-full bg-black/20 absolute top-0"></div>
              <div className="p-2 md:p-5 absolute z-10 bottom-0 text-white w-full">
                <div className="flex justify-between text-base md:text-xl">
                  <div>
                    <Skeleton className="w-16 h-5 bg-gray-300" />
                    <Skeleton className="w-24 h-6 bg-gray-400 mt-1" />
                    <Skeleton className="w-16 h-5 bg-gray-300 mt-1" />
                  </div>
                  <div>
                    <Skeleton className="w-20 h-5 bg-gray-300 text-right" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-grow h-16 flex justify-center items-center mt-2">
              <Skeleton className="w-32 h-6 bg-gray-300" />
            </div>
            <div className="flex w-full justify-between mt-2">
              <div className="w-full">
                <Skeleton className="w-16 h-4 bg-gray-300" />
                <Skeleton className="w-24 h-5 bg-red-400 mt-1" />
              </div>
              <div className="text-right flex flex-col items-end w-full">
                <Skeleton className="w-16 h-4 bg-gray-300" />
                <Skeleton className="w-20 h-5 bg-gray-400 mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
