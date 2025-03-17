import CTASection from "../components/CTASection";
import FlippingCard from "../components/FlipCard";
import Reviews from "../components/Reviews";
import CarServiceSection from "./Car-Service";
import CarCarousel from "./Carousel";
import FAQ from "./FAQSection";
import FirstSection from "./FirstSection";
import HeroSection from "./HeroSection";
import SavingsSection from "./SavingSection";
import WhyCarBuyDirect from "./WhyCarBuyDirect";
import { Zap, Image, LayoutGrid, Gem, BarChart3 } from "lucide-react"
const features = [
    {
        icon: <Zap className="w-12 h-12 text-red-500" />,
        title: "Direct Saving",
        description: "Partnering with Wholesalers and Distributers to get the best price",
    },
    {
        icon: <Image className="w-12 h-12 text-red-500" />,
        title: "No Hidden Fee",
        description: "Transparent Pricing every step of the way",
    },
    {
        icon: <LayoutGrid className="w-12 h-12 text-red-500" />,
        title: "All-in-One-Platform",
        description: "Buy, Insure, Service, Finance & Transport – all in one place",
    },
    {
        icon: <Gem className="w-12 h-12 text-red-500" />,
        title: "User Friendly App",
        description: "Seamlessly browse, compare, buy and book from your phone",
    },
    {
        icon: <BarChart3 className="w-12 h-12 text-red-500" />,
        title: "Buyer-Focused Approach",
        description: "Designed to Prioritize your needs, not dealership Profits",
    },
]
export default function About() {
    return (
        <div className="pt-10">
            <HeroSection />
            <h1 className="text-xl mt-8 md:mt-0 md:text-3xl font-bold text-center mb-4">WHY CHOOSE CARBUYDIRECT?</h1>
            <div className="grid grid-cols-2 md:grid-cols-6 md:max-w-5xl mx-auto">
                {features.map((feature, index) => (
                    <FlippingCard
                        key={index}
                        // className={index > 2 ? "md:col-span-3" : "md:col-span-2"}
                        frontContent={
                            <div className="space-y-4 justify-center flex flex-col items-center">
                                {feature.icon}
                                <h3 className="">{feature.title}</h3>
                            </div>
                        }
                        id={index}
                        backContent={feature.description}
                    />
                ))}
            </div>
            <CarServiceSection />
            <CarCarousel/>
            <SavingsSection/>
            <FAQ/>
            <Reviews/>
            {/* <FirstSection />
            <WhyCarBuyDirect /> */}
            <CTASection/>
        </div>
    )
}