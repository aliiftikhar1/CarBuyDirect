
"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export default function TimerComponent({ className = "", endDate }) {
 
  const [timeLeft, setTimeLeft] = useState({});

 

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = new Date(endDate) - now;
      return difference > 0
        ? {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          }
        : null; // null means time is up
    };
  
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      if (!updatedTimeLeft) {
        clearInterval(timer); // stop the timer
        window.location.reload(); // reload the page
      } else {
        setTimeLeft(updatedTimeLeft);
      }
    }, 1000);
  
    return () => clearInterval(timer);
  }, [endDate]);
  


  return (
    <div className={cn("flex items-center justify-center text-center gap-2 p-0  rounded-lg", className)}>

      {timeLeft.days > 10000 ? (
        <>
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="text-lg font-bold">{new Date(endDate).toLocaleDateString()}</span>
        </>
      ) : (
        <div className="flex w-full  gap-2 text-lg font-semibold items-center">
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
    </div>
  );
}