'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export default function NavBar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState([]);
    const router = useRouter()
    useEffect(() => {
        const adminDetails = localStorage.getItem("adminDetails")
        setUser(adminDetails)
        if (!adminDetails) {
          router.push("/Login")
        }
      
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("adminDetails");
        window.location.replace('/Login');
    };

    return (
        <div className="flex border-b justify-center items-center pl-2">
            <SidebarTrigger className="rounded-full border" />
            <div className="w-full h-16 flex justify-between items-center px-10">
                <div className="flex justify-center items-center">
                    <h1 className="text-xl">Admin Panel</h1>
                </div>
                {user && (
                    <div className="relative">
                        <div className="size-[50px] rounded-full border border-gray-800 overflow-hidden cursor-pointer" onClick={toggleDropdown}>
                            <img src="/logo/1.png" className="w-full h-full object-cover" alt="Logo" />
                        </div>
                        {dropdownOpen && (
                            <div className="absolute z-30 right-0 mt-2 p-4 space-y-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                                <Button className="w-full text-left bg-green-200 hover:bg-green-300" variant="outline">
                                    Profile
                                </Button>
                                <Button className="w-full text-left bg-red-200 hover:bg-red-300" variant="outline" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
