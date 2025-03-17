import { Search } from "lucide-react";

export default function FAQSection() {
    return (
        <div className="text-center mb-8 px-2 flex flex-col justify-center items-center">
            <h1 className="text-4xl font-[100] text-gray-800 mb-2">
                Frequently Asked <span className="text-yellow-500">Questions</span>
            </h1>
            <p className="text-gray-600">
                Find answers to all your questions regarding auctions, buying, or selling a car.
            </p>
            <a href="/FAQ" className="px-8 py-4 bg-gray-200 uppercase mt-4">
                Go to faq section                
            </a>
        </div>
    )
}