// // // "use client";
// // // import React, { useState, useEffect } from "react";
// // // import { cn } from "@/lib/utils";
// // // import { Clock } from "lucide-react";

// // // export default function TimerComponent({ className = "", endDate }) {
// // //   const getOrCreateEndDate = () => {
// // //     const storedEndDate = endDate;
// // //     if (storedEndDate) {
// // //       return new Date(storedEndDate);
// // //     } else {
// // //       const newEndDate = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
// // //       return newEndDate;
// // //     }
// // //   };

// // //   const [flashSaleEndDate, setFlashSaleEndDate] = useState(getOrCreateEndDate);

// // //   const calculateTimeLeft = () => {
// // //     const now = new Date().getTime();
// // //     const difference = new Date(flashSaleEndDate).getTime() - now;

// // //     if (difference > 0) {
// // //       return {
// // //         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
// // //         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
// // //         minutes: Math.floor((difference / (1000 * 60)) % 60),
// // //         seconds: Math.floor((difference / 1000) % 60),
// // //       };
// // //     } else {
// // //       return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Timer ends
// // //     }
// // //   };

// // //   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

// // //   useEffect(() => {
// // //     const timer = setInterval(() => {
// // //       setTimeLeft(calculateTimeLeft());
// // //     }, 1000);

// // //     return () => clearInterval(timer); // Cleanup interval on unmount
// // //   }, [endDate]);

// // //   return (
// // //     <div className={cn("flex justify-center items-center text-center ", className)}>
// // //       <Clock className="size-4"/>
// // //        {timeLeft.days>10000?<span className={cn("countdown font-[700]", className)}>{new Date(endDate).toLocaleDateString()}</span>:<>
// // //        {timeLeft.days==0?'':
// // //       <div className="flex items-center gap-1  ">
// // //         <span className={cn("countdown font-[500]", className)}>{timeLeft.days}</span>
// // //         <span className="text-xs items-center font-normal">d</span>
// // //       </div>}
// // //         {timeLeft.hours==0?'':
// // //         <div className="flex items-center gap-1  ">
// // //         <span className={cn("countdown font-[500]", className)}>{timeLeft.hours}</span>
// // //         <span className="text-xs items-center font-normal">h</span>
// // //       </div>}
// // //       {timeLeft.days<=0?<>
// // //       {timeLeft.minutes==0?'':
// // //       <div className="flex items-center gap-1  ">
// // //         <span className={cn("countdown font-[500]", className)}>{timeLeft.minutes}</span>
// // //         <span className="text-xs items-center font-normal">m</span>
// // //       </div>}
// // //       {timeLeft.seconds==0?'':
// // //       <div className="flex items-center gap-1">
// // //         <span className={cn("countdown font-[500]", className)}>{timeLeft.seconds}</span>
// // //         <span className="text-xs items-center font-normal">s</span>
// // //       </div>}</>:''}
// // //       </>
// // // }
// // //     </div>
// // //   );
// // // }

// // "use client";
// // import React, { useState, useEffect } from "react";
// // import { cn } from "@/lib/utils";
// // import { Clock } from "lucide-react";
// // import { Button } from "@/components/ui/button"; // Assuming you're using a UI library

// // export default function TimerComponent({ className = "", endDate, buy }) {
// //   const getOrCreateEndDate = () => {
// //     const storedEndDate = endDate;
// //     if (storedEndDate) {
// //       return new Date(storedEndDate);
// //     } else {
// //       return new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000); // Default to 3 days
// //     }
// //   };

// //   console.log("BUY AUCTION DATA", buy.buy)

// //   const [flashSaleEndDate, setFlashSaleEndDate] = useState(getOrCreateEndDate);

// //   const calculateTimeLeft = () => {
// //     const now = new Date().getTime();
// //     const difference = new Date(flashSaleEndDate).getTime() - now;

// //     if (difference > 0) {
// //       return {
// //         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
// //         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
// //         minutes: Math.floor((difference / (1000 * 60)) % 60),
// //         seconds: Math.floor((difference / 1000) % 60),
// //       };
// //     } else {
// //       return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Timer ends
// //     }
// //   };

// //   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setTimeLeft(calculateTimeLeft());
// //     }, 1000);

// //     return () => clearInterval(timer); // Cleanup interval on unmount
// //   }, [endDate]);

// //   return (
// //     <>
// //       <div className={cn("flex justify-center items-center text-center", className)}>
// //       {timeLeft.days >= 7 ? (
// //         <>
// //           <div className="">
// //             <div className="d-flex align-items-center">
// //               <Clock className="size-4" />
// //               {timeLeft.days > 10000 ? (
// //                 <span className={cn("countdown font-[700]", className)}>
// //                   {new Date(endDate).toLocaleDateString()}
// //                 </span>
// //               ) : (
// //                 <>
// //                   {timeLeft.days > 0 && (
// //                     <div className="flex items-center gap-1">
// //                       <span className={cn("countdown font-[500]", className)}>{timeLeft.days}</span>
// //                       <span className="text-xs font-normal">d</span>
// //                     </div>
// //                   )}
// //                   {timeLeft.hours > 0 && (
// //                     <div className="flex items-center gap-1">
// //                       <span className={cn("countdown font-[500]", className)}>{timeLeft.hours}</span>
// //                       <span className="text-xs font-normal">h</span>
// //                     </div>
// //                   )}
// //                   {timeLeft.days <= 0 && (
// //                     <>
// //                       {timeLeft.minutes > 0 && (
// //                         <div className="flex items-center gap-1">
// //                           <span className={cn("countdown font-[500]", className)}>{timeLeft.minutes}</span>
// //                           <span className="text-xs font-normal">m</span>
// //                         </div>
// //                       )}
// //                       {timeLeft.seconds > 0 && (
// //                         <div className="flex items-center gap-1">
// //                           <span className={cn("countdown font-[500]", className)}>{timeLeft.seconds}</span>
// //                           <span className="text-xs font-normal">s</span>
// //                         </div>
// //                       )}
// //                     </>
// //                   )}
// //                 </>
// //               )}
// //             </div>
// //             <Button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg">
// //               Buy Now
// //             </Button>
// //           </div>
// //         </>
// //       ) : (
// //         // Otherwise, show countdown timer
// //         <div className="d-flex">
// //           <Clock className="size-4" />
// //           {timeLeft.days > 10000 ? (
// //             <span className={cn("countdown font-[700]", className)}>
// //               {new Date(endDate).toLocaleDateString()}
// //             </span>
// //           ) : (
// //             <>
// //               {timeLeft.days > 0 && (
// //                 <div className="flex items-center gap-1">
// //                   <span className={cn("countdown font-[500]", className)}>{timeLeft.days}</span>
// //                   <span className="text-xs font-normal">d</span>
// //                 </div>
// //               )}
// //               {timeLeft.hours > 0 && (
// //                 <div className="flex items-center gap-1">
// //                   <span className={cn("countdown font-[500]", className)}>{timeLeft.hours}</span>
// //                   <span className="text-xs font-normal">h</span>
// //                 </div>
// //               )}
// //               {timeLeft.days <= 0 && (
// //                 <>
// //                   {timeLeft.minutes > 0 && (
// //                     <div className="flex items-center gap-1">
// //                       <span className={cn("countdown font-[500]", className)}>{timeLeft.minutes}</span>
// //                       <span className="text-xs font-normal">m</span>
// //                     </div>
// //                   )}
// //                   {timeLeft.seconds > 0 && (
// //                     <div className="flex items-center gap-1">
// //                       <span className={cn("countdown font-[500]", className)}>{timeLeft.seconds}</span>
// //                       <span className="text-xs font-normal">s</span>
// //                     </div>
// //                   )}
// //                 </>
// //               )}
// //             </>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //     </>
// //   );
// // }


"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import BuynowButton from "@/app/components/BuynowButton";

export default function TimerComponent({ className = "", endDate, buy, data }) {
  const getOrCreateEndDate = () => {
    return endDate ? new Date(endDate) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  };

  const [flashSaleEndDate] = useState(getOrCreateEndDate);
  const [timeLeft, setTimeLeft] = useState({});

  const calculateTimeLeft = () => {
    const now = Date.now();
    const difference = flashSaleEndDate.getTime() - now;
    return difference > 0
      ? {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
      : { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn("flex items-center justify-center text-center gap-2 p-0  rounded-lg", className)}>

      {timeLeft.days > 10000 ? (
        <>
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="text-lg font-bold">{new Date(endDate).toLocaleDateString()}</span>
        </>
      ) : (
        <div className="flex gap-2 text-lg font-semibold items-center">
          <Clock className="w-5 h-5 text-gray-600" />
          {timeLeft.days > 0 && (
            <span>
              {timeLeft.days} <span className="text-sm font-normal">d</span>
            </span>
          )}
          {timeLeft.hours > 0 && (
            <span>
              {timeLeft.hours} <span className="text-sm font-normal">h</span>
            </span>
          )}
          {timeLeft.days <= 0 && (
            <>
              {timeLeft.minutes > 0 && (
                <span>
                  {timeLeft.minutes} <span className="text-sm font-normal">m</span>
                </span>
              )}
              {timeLeft.seconds > 0 && (
                <span>
                  {timeLeft.seconds} <span className="text-sm font-normal">s</span>
                </span>
              )}
            </>
          )}
        </div>
      )}
      {
      // timeLeft?.days <= 7 &&
       buy?.buy && (
        <BuynowButton data={data} />
      )}
    </div>
  );
}
// "use client";
// import React, { useState, useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { Clock } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import BuynowButton from "@/app/components/BuynowButton";

// export default function TimerComponent({ className = "", endDate, buy }) {
//   const getOrCreateEndDate = () => {
//     return endDate ? new Date(endDate) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
//   };

//   console.log("BUY AUCTION DATA", buy?.buy);

//   const [flashSaleEndDate] = useState(getOrCreateEndDate);
//   const [timeLeft, setTimeLeft] = useState({});

//   const calculateTimeLeft = () => {
//     const now = Date.now();
//     const difference = flashSaleEndDate.getTime() - now;
//     return difference > 0
//       ? {
//         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//         minutes: Math.floor((difference / (1000 * 60)) % 60),
//         seconds: Math.floor((difference / 1000) % 60),
//       }
//       : null;
//   };

//   useEffect(() => {
//     const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className={cn("flex flex-col items-center text-center gap-2 w-100 border rounded-lg", className)}>
//       {timeLeft ? (
//         <div className="flex items-center gap-2">
//           <Clock className="w-5 h-5 text-gray-600" />
//           <div className="flex gap-2 text-lg font-semibold">
//             {timeLeft.days > 0 && (
//               <span>
//                 {timeLeft.days} <span className="text-sm font-normal">d</span>
//               </span>
//             )}
//             {timeLeft.hours > 0 && (
//               <span>
//                 {timeLeft.hours} <span className="text-sm font-normal">h</span>
//               </span>
//             )}
//             {timeLeft.days <= 0 && (
//               <>
//                 {timeLeft.minutes > 0 && (
//                   <span>
//                     {timeLeft.minutes} <span className="text-sm font-normal">m</span>
//                   </span>
//                 )}
//                 {timeLeft.seconds > 0 && (
//                   <span>
//                     {timeLeft.seconds} <span className="text-sm font-normal">s</span>
//                   </span>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       ) : null}
//       {timeLeft?.days <= 7 && buy?.buy && (
//        <BuynowButton/>
//       )}
//     </div>
//   );
// }
