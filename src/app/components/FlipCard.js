"use client"
import { useState } from "react"
import clsx from "clsx"


export default function FlippingCard({ id,frontContent, backContent }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className={`${id>2?'md:col-span-3':'md:col-span-2'} relative w-full  p-1 md:p-4 h-64`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={clsx(
          "w-full h-full  transition-transform duration-500 [transform-style:preserve-3d]",
          isFlipped ? "[transform:rotateY(180deg)]" : "",
        )}
      >
        {/* Front Side */}
        <div className="absolute text-center p-4 border md:border-2 border-red-500 w-full h-full bg-white  rounded-xl flex items-center justify-center text-lg md:text-xl font-[300] md:font-bold [backface-visibility:hidden]">
          {frontContent}
        </div>
        {/* Back Side */}
        <div className="absolute w-full p-4 text-center h-full bg-red-500 text-white  rounded-xl flex items-center justify-center text-base md:text-xl font-[300] md:font-bold [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {backContent}
        </div>
      </div>
    </div>
  )
}

