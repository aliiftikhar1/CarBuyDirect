"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function TimerComponent({ className = "", endDate }) {
  const getOrCreateEndDate = () => {
    const storedEndDate = endDate;
    if (storedEndDate) {
      return new Date(storedEndDate);
    } else {
      const newEndDate = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
      return newEndDate;
    }
  };

  const [flashSaleEndDate, setFlashSaleEndDate] = useState(getOrCreateEndDate);

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = new Date(flashSaleEndDate).getTime() - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Timer ends
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [endDate]);

  return (
    <div className={cn("flex justify-center items-center gap-5 text-center ", className)}>
       {timeLeft.days>10?<span className={cn("countdown font-[700]", className)}>{new Date(endDate).toLocaleDateString()}</span>:<>
       {timeLeft.days==0?'':
      <div className="flex flex-col w-full">
        <span className={cn("countdown font-[700]", className)}>{timeLeft.days}</span>
        <span className="text-xs font-normal">days</span>
      </div>}
      {timeLeft.days<2?<>
        {timeLeft.hours==0?'':
        <div className="flex flex-col w-full">
        <span className={cn("countdown font-[700]", className)}>{timeLeft.hours}</span>
        <span className="text-xs font-normal">hours</span>
      </div>}
      {timeLeft.minutes==0?'':
      <div className="flex flex-col w-full">
        <span className={cn("countdown font-[700]", className)}>{timeLeft.minutes}</span>
        <span className="text-xs font-normal">min</span>
      </div>}
      {timeLeft.seconds==0?'':
      <div className="flex flex-col w-full">
        <span className={cn("countdown font-[700]", className)}>{timeLeft.seconds}</span>
        <span className="text-xs font-normal">sec</span>
      </div>}</>:''}
      </>
}
    </div>
  );
}
