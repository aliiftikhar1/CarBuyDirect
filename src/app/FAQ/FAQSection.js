"use client";
import React, { useRef, useState } from "react";
import FAQContent from "./FAQContent";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const FAQSection = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const tabs = [
        { id: "general", label: "General" },
        { id: "selling", label: "Selling" },
        { id: "buying", label: "Buying" },
    ];

    // Create refs for each section
    const sectionRefs = {
        general: useRef(null),
        selling: useRef(null),
        buying: useRef(null),
    };

    const scrollToSection = (id) => {
        const section = sectionRefs[id]?.current;
        if (section) {
            const offset = -200; // Adjust this value for your custom scroll offset
            const top = section.getBoundingClientRect().top + window.pageYOffset + offset;

            window.scrollTo({
                top: top,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="md:max-w-7xl mx-auto p-6 bg-white mt-[50px] md:mt-[150px]">


            <div className="flex">
                {/* Sidebar Tabs */}
                <div className="w-1/5 pr-4 hidden md:block sticky top-[150px] self-start">
                    <ul className="space-y-2">
                        {tabs.map((tab) => (
                            <li key={tab.id}>
                                <button
                                    onClick={() => scrollToSection(tab.id)}
                                    className="w-full text-left text-gray-700 font-medium px-4 py-2 border-l-4 border-transparent hover:border-yellow-500 hover:bg-gray-50"
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Content Section */}
                <div className="md:w-4/5 md:pl-4 space-y-2 md:space-y-16 overflow-y-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-[100] text-gray-800 mb-2">
                            Frequently Asked <span className="text-yellow-500">Questions</span>
                        </h1>
                        <p className="text-gray-600">
                            Find answers to all your questions regarding auctions, buying, or selling a car.
                        </p>
                        <div className="relative border mt-4">
                            <Input
                                type="text"
                                placeholder="Search FAQs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-full p-6 text-lg placeholder:text-lg rounded-none focus:bg-gray-300"
                            />

                            <Search className="size-10 absolute top-4 right-4" />
                        </div>
                    </div>
                    {searchTerm ? (
                        <FAQContent
                            searchTerm={searchTerm}
                            isSearching={true}
                        />
                    ) : (
                        tabs.map((tab) => (
                            <div
                                key={tab.id}
                                id={tab.id}
                                ref={sectionRefs[tab.id]}
                                className="space-y-8"
                            >
                                <FAQContent
                                    activeTab={tab.id}
                                    searchTerm={searchTerm}
                                    isSearching={false}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FAQSection;

