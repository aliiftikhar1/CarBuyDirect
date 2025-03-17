'use client'
import { ChevronRight, X } from "lucide-react";
import { useState } from "react";

export default function TopBar() {
    const [visible, setvisible] = useState(true)
    return (
        <>{visible&&(
        <div className="flex flex-col w-full relative bg-white">
            <div className="absolute top-1 md:top-2 right-4">
                <X className="text-gray-300 hover:text-gray-100" onClick={()=>setvisible(!visible)}/>
            </div>
            <div className="p-1  md:p-2 bg-[#5a79c8]">
                <p className="uppercase text-sm md:text-base text-white text-center flex justify-center items-center">Sell your supercar <ChevronRight /></p>
            </div>
            <div className="p-1 bg-[#e2e2de] px-12 text-sm space-x-4 hidden md:flex ">
                <p>US +1-718-787-584</p>
               
                <p>|</p>
                <p>sales@carbuydirect.com</p>
            </div>
            <div className=" bg-[#e2e2de] px-4 py-1 text-xs h-7  flex justify-between items-center md:hidden">
            <p>+1-718-787-584</p>
                <p>|</p>
                <p>sales@carbuydirect.com</p>
                </div>
        </div>
        )}</>
    )
}