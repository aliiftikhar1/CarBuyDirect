// 'use client'
// import { useState, useEffect } from "react"
// import { toast } from "sonner"
// import Auction from "./components/Auction"
// import Carousel from "./components/Slider"
// import { Zap, Image, LayoutGrid, Gem, BarChart3 } from "lucide-react"
// import FlippingCard from "./components/FlipCard"
// import Reviews from "./components/Reviews"
// import CTASection from "./components/CTASection"
// import AboutUsSection from "./components/AboutUs"
// import AuctionListSkeleton from "./components/AuctionListSkeleton"
// import PricingSection from "./components/PricingSection"
// import { useSession, signIn, signOut } from "next-auth/react";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// const features = [
//   {
//     icon: <Zap className="w-12 h-12 text-red-500" />,
//     title: "Direct Saving",
//     description: "Partnering with Wholesalers and Distributers to get the best price",
//   },
//   {
//     icon: <Image className="w-12 h-12 text-red-500" />,
//     title: "No Hidden Fee",
//     description: "Transparent Pricing every step of the way",
//   },
//   {
//     icon: <LayoutGrid className="w-12 h-12 text-red-500" />,
//     title: "All-in-One-Platform",
//     description: "Buy, Insure, Service, Finance & Transport – all in one place",
//   },
//   {
//     icon: <Gem className="w-12 h-12 text-red-500" />,
//     title: "User Friendly App",
//     description: "Seamlessly browse, compare, buy and book from your phone",
//   },
//   {
//     icon: <BarChart3 className="w-12 h-12 text-red-500" />,
//     title: "Buyer-Focused Approach",
//     description: "Designed to Prioritize your needs, not dealership Profits",
//   },
// ]

// export default function Home() {
//   const [loading, setloading] = useState(false)
//   const [loading2, setisloading] = useState(false)
//   const [auctionItems, setAuctionItems] = useState([])
//   const [watch, setwatch] = useState([])
//   const [slides, setSlides] = useState([])

//   const { data: session } = useSession();


//   useEffect(() => {
//     fetchSlides()
//     console.log("SESSION", session)

//   }, [])

//   const fetchSlides = async () => {
//     setisloading(true)
//     try {
//       const response = await fetch(`/api/admin/slidermanagement`)
//       if (!response.ok) throw new Error("Failed to fetch slides")
//       const data = await response.json()
//       setSlides(data)
//     } catch (err) {
//       toast.error(err.message)
//     } finally {
//       setisloading(false)
//     }
//   }
//   async function GetAuctions() {
//     try {
//       setloading(true)
//       const response = await fetch(`/api/user/getFeaturedAuction/1`)
//       const data = await response.json()
//       setAuctionItems(data.data)
//       fetchWatch()
//       setloading(false)
//     } catch (error) {
//       toast.error("Failed to fetch auctions")
//     }
//   }

//   async function fetchWatch() {
//     try {
//       setloading(true)
//       const response = await fetch(`/api/user/watch/all/1`)
//       const data = await response.json()
//       setwatch(data.data)
//       setloading(false)
//     } catch (error) {
//       toast.error("Failed to fetch auctions")
//     }
//   }
//   useEffect(() => {
//     GetAuctions()
//   }, [])
//   return (
//     <main className="min-h-screen ">
//       <Carousel items={slides} />
//       <button onClick={() => signOut()}>Logout</button>
//       <h1 className="text-xl mt-8 md:mt-0 md:text-3xl font-bold text-center mb-4">WHY CHOOSE CARBUYDIRECT?</h1>
//       <div className="grid grid-cols-2 md:grid-cols-6 md:max-w-5xl mx-auto">
//         {features.map((feature, index) => (
//           <FlippingCard
//             key={index}
//             frontContent={
//               <div className="space-y-4 justify-center flex flex-col items-center">
//                 {feature.icon}
//                 <h3 className="">{feature.title}</h3>
//               </div>
//             }
//             id={index}
//             backContent={feature.description}
//           />
//         ))}
//       </div>
//       <PricingSection />
//       {loading ? <AuctionListSkeleton /> :
//         <Auction items={auctionItems} watchdata={watch} />
//       }
//       <Reviews />
//       <AboutUsSection />
//       <CTASection />
//     </main>
//   )
// }



'use client'
import { useState, useEffect } from "react"
import { toast } from "sonner"
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
// ✅ Bootstrap ko sirf client-side load karne ke liye

// ✅ Lucide icons ko dynamically import karna
const ZapIcon = dynamic(() => import("lucide-react").then((mod) => mod.Zap), { ssr: false });
const ImageIcon = dynamic(() => import("lucide-react").then((mod) => mod.Image), { ssr: false });
const LayoutGridIcon = dynamic(() => import("lucide-react").then((mod) => mod.LayoutGrid), { ssr: false });
const GemIcon = dynamic(() => import("lucide-react").then((mod) => mod.Gem), { ssr: false });
const BarChart3Icon = dynamic(() => import("lucide-react").then((mod) => mod.BarChart3), { ssr: false });

// ✅ Components jo `document` ya `window` use kar rahe hain
const Carousel = dynamic(() => import("./components/Slider"), { ssr: false });
const Auction = dynamic(() => import("./components/Auction"), { ssr: false });
const FlippingCard = dynamic(() => import("./components/FlipCard"), { ssr: false });
const Reviews = dynamic(() => import("./components/Reviews"), { ssr: false });
const CTASection = dynamic(() => import("./components/CTASection"), { ssr: false });
const AboutUsSection = dynamic(() => import("./components/AboutUs"), { ssr: false });
const PricingSection = dynamic(() => import("./components/PricingSection"), { ssr: false });
const AuctionListSkeleton = dynamic(() => import("./components/AuctionListSkeleton"), { ssr: false });

const features = [
  { icon: <ZapIcon className="w-12 h-12 text-red-500" />, title: "Direct Saving", description: "Partnering with Wholesalers and Distributers to get the best price" },
  { icon: <ImageIcon className="w-12 h-12 text-red-500" />, title: "No Hidden Fee", description: "Transparent Pricing every step of the way" },
  { icon: <LayoutGridIcon className="w-12 h-12 text-red-500" />, title: "All-in-One-Platform", description: "Buy, Insure, Service, Finance & Transport – all in one place" },
  { icon: <GemIcon className="w-12 h-12 text-red-500" />, title: "User Friendly App", description: "Seamlessly browse, compare, buy and book from your phone" },
  { icon: <BarChart3Icon className="w-12 h-12 text-red-500" />, title: "Buyer-Focused Approach", description: "Designed to Prioritize your needs, not dealership Profits" },
];

export default function Home() {
  const [loading, setloading] = useState(false);
  const [loading2, setisloading] = useState(false);
  const [auctionItems, setAuctionItems] = useState([]);
  const [watch, setwatch] = useState([]);
  const [slides, setSlides] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetchSlides();
    console.log("SESSION", session);
  }, []);
 

  const fetchSlides = async () => {
    setisloading(true);
    try {
      const response = await fetch(`/api/admin/slidermanagement`);
      if (!response.ok) throw new Error("Failed to fetch slides");
      const data = await response.json();
      setSlides(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setisloading(false);
    }
  };

  async function GetAuctions() {
    try {
      setloading(true);
      const response = await fetch(`/api/user/getFeaturedAuction/1`);
      const data = await response.json();
      setAuctionItems(data.data);
      fetchWatch();
      setloading(false);
    } catch (error) {
      toast.error("Failed to fetch auctions");
    }
  }

  async function fetchWatch() {
    try {
      setloading(true);
      const response = await fetch(`/api/user/watch/all/1`);
      const data = await response.json();
      setwatch(data.data);
      setloading(false);
    } catch (error) {
      toast.error("Failed to fetch auctions");
    }
  }

  useEffect(() => {
    GetAuctions();
  }, []);

  return (
    <main className="min-h-screen ">
      <Carousel items={slides} />
      <h1 className="text-xl mt-8 md:mt-0 md:text-3xl font-bold text-center mb-4">WHY CHOOSE CARBUYDIRECT?</h1>
      <div className="grid grid-cols-2 md:grid-cols-6 md:max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <FlippingCard
            key={index}
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
      <PricingSection />
      {loading ? <AuctionListSkeleton /> : <Auction items={auctionItems} watchdata={watch} />}
      <Reviews />
      <AboutUsSection />
      <CTASection />
    </main>
  );
}
