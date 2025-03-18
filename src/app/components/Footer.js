import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Youtube, Twitter, LinkedinIcon } from 'lucide-react'
import Image from "next/image"

export default function Footer() {
    return (
        <footer className="w-full bg-white py-4 border-t px-4 md:px-20">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                    {/* Logo and Social Media Section */}
                    <div className="space-y-4">
                        <div className="flex flex-col justify-center items-center">
                            <img src="/logo/1.png" className="h-16 md:h-20 w-[100vw] md:w-[50vw] object-cover"></img>
                            {/* <h1 className="font-xspace text-base md:text-3xl -tracking-[4px] md:tracking-tight">CAR BUY DIRECT</h1> */}
                            {/* <p className="uppercase font-[300] text-xs md:text-base">Supercar Blondie</p> */}
                        </div>
                        {/* <div className="flex flex-col justify-center items-center">
                        <h1 className="font-xspace text-base md:text-3xl -tracking-[4px] md:-tracking-[4px]">CAR BUY DIRECT</h1>
                            <h1 className="font-xspace text-3xl tracking-tight">CarBuyDirect| CARS</h1>
                            <p className="uppercase font-[300]">Supercar Blondie</p>
                        </div> */}
                        <div className="flex space-x-4 justify-center items-center">
                            <Link href="#" className="text-gray-600 hover:text-gray-900">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-gray-900">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-gray-900">
                                <Youtube className="h-5 w-5" />
                                <span className="sr-only">YouTube</span>
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-gray-900">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-gray-900">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.001-.104z" />
                                </svg>
                                <span className="sr-only">TikTok</span>
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-gray-900">
                                <LinkedinIcon className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Get the latest updates by subscribing to our newsletter.
                        </p>
                        <form className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Email Address"
                                className="max-w-[300px]"
                            />
                            <Button
                                type="submit"
                                variant="secondary"
                                className="bg-gray-100 hover:bg-gray-200"
                            >
                                SUBSCRIBE
                            </Button>
                        </form>


                    </div>

                    {/* Navigation Links Section */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Link href="/Auction" className="block text-sm text-muted-foreground hover:text-gray-900">Auctions</Link>
                            {/* <Link href="#" className="block text-sm text-muted-foreground hover:text-gray-900">Brands</Link> */}
                            <Link href="/Sell" className="block text-sm text-muted-foreground hover:text-gray-900">Sell your vehicle</Link>
                            <Link href="/FAQ" className="block text-sm text-muted-foreground hover:text-gray-900">FAQ</Link>
                            <Link href="/ContactUs" className="block text-sm text-muted-foreground hover:text-gray-900">Contact us</Link>
                            <Link href="/Results" className="block text-sm text-muted-foreground hover:text-gray-900">Auction Results</Link>
                        </div>
                        <div className="space-y-3">
                            <Link href="/About" className="block text-sm text-muted-foreground hover:text-gray-900">About us</Link>
                            <Link href="/Team" className="block text-sm text-muted-foreground hover:text-gray-900">Team</Link>
                            <Link href="/Careers" className="block text-sm text-muted-foreground hover:text-gray-900">Careers</Link>
                            <Link href="/Terms-Of-Service" className="block text-sm text-muted-foreground hover:text-gray-900">Terms of use</Link>
                            <Link href="/Privacy-Policy" className="block text-sm text-muted-foreground hover:text-gray-900">Privacy policy</Link>
                            <Link href="/Car-Loan" className="block text-sm text-muted-foreground hover:text-gray-900">Car Loan</Link>
                            <Link href="/Car-Insurance" className="block text-sm text-muted-foreground hover:text-gray-900">Car Insurance</Link>
                            {/* <Link href="#" className="block text-sm text-muted-foreground hover:text-gray-900">Cookie declaration</Link> */}
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-12 pt-4 border-t border-gray-200">
                    <p className="text-center text-sm text-muted-foreground">
                        © Copyright {new Date().getFullYear()} All rights reserved by CarBuyDirect, Inc.

                    </p>
                </div>
            </div>
        </footer>
    )
}

