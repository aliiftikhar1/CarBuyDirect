'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NavBar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="flex border-b justify-center items-center pl-2">
         <SidebarTrigger className="rounded-full border " />
            <div className="w-full h-16  flex justify-between items-center px-10">
                <div className="flex justify-center items-center">
               
                    <h1 className="text-xl">Seller Panel</h1>
                </div>
                <div className="relative">
                    <div className="size-[50px] rounded-full border border-gray-800 overflow-hidden cursor-pointer" onClick={toggleDropdown}>
                        <img src="/logo/1.png" className="w-full h-full object-cover" alt="Logo" />
                    </div>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 p-4 space-y-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                            <Button className="w-full text-left bg-green-200 hover:bg-green-300" variant="outline">Profile</Button>
                            <Button className="w-full text-left bg-red-200 hover:bg-red-300" variant="outline">Logout</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}