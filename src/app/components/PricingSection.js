// // import AnimatedBeam from "@/components/ui/animated-beam"
// // import PricingCard from "./PricingCard"

// // export default function PricingSection() {
// //   const pricingData = [
// //     {
// //       title: "Free",
// //       price: 0,
// //       subtitle: "Free Package",
// //       features: ["Bidding Features",],
// //       buttonText: "Free",
// //       buttonColor: "bg-gray-400 hover:bg-gray-400",
// //     },

// //     {
// //       title: "Premium",
// //       price: 12,
// //       subtitle: "Premium Plan",
// //       features: ["Bidding Features","Auction Features","Free Shipping", "No Additional Taxes", "Quality Assurance"],
// //       buttonText: "Get Started",
// //       buttonColor: "bg-red-500 hover:bg-red-600",
// //     },
// //   ]

// //   return (
// //     <AnimatedBeam>
// //     <div className="py-8 px-4 max-w-7xl mx-auto">
// //         <h1 className="text-center text-4xl font-bold text-white mb-4">A perfect fit for everyone</h1>
// //         <p className="text-center text-md max-w-5xl mx-auto font-[300] text-white mb-4">Elevate your marketing without financial stress. Maker4U offers flexible pricing plans adjustable to businesses of all sizes. Choose the plan that aligns with your ambitions and witness your promotions mount to new heights.</p>
// //       <div className="flex justify-center items-center gap-8">
// //         {pricingData.map((plan, index) => (
// //           <PricingCard
// //             key={index}
// //             title={plan.title}
// //             price={plan.price}
// //             subtitle={plan.subtitle}
// //             features={plan.features}
// //             buttonText={plan.buttonText}
// //             buttonColor={plan.buttonColor}
// //             isSubscribed={plan.isSubscribed}
// //           />
// //         ))}
// //       </div>

// //     </div>
// //     </AnimatedBeam>
// //   )
// // }


// import AnimatedBeam from "@/components/ui/animated-beam";
// import PricingCard from "./PricingCard";

// export default function PricingSection() {
//   const pricingData = [
//     {
//       title: "Free",
//       price: 0,
//       subtitle: "Free Package",
//       features: ["Bidding Features"],
//       buttonText: "Free",
//       buttonColor: "bg-gray-400 hover:bg-gray-400",
//     },
//     {
//       title: "Premium",
//       price: 12,
//       subtitle: "Premium Plan",
//       features: [
//         "Bidding Features",
//         "Auction Features",
//         "Free Shipping",
//         "No Additional Taxes",
//         "Quality Assurance",
//       ],
//       buttonText: "Get Started",
//       buttonColor: "bg-red-500 hover:bg-red-600",
//     },
//   ];

//   return (
//     <AnimatedBeam>
//       <div className="py-8 px-4 max-w-7xl mx-auto">
//         <h1 className="text-center text-4xl font-bold text-white mb-4">
//           A perfect fit for everyone
//         </h1>
//         <p className="text-center text-md max-w-5xl mx-auto font-[300] text-white mb-4">
//           Elevate your marketing without financial stress. Maker4U offers flexible pricing plans
//           adjustable to businesses of all sizes. Choose the plan that aligns with your ambitions and
//           witness your promotions mount to new heights.
//         </p>
//         <div className="flex flex-wrap justify-center items-center gap-8">
//           {pricingData.map((plan, index) => (
//             <div key={index} className="w-full sm:w-[300px] md:w-[350px] lg:w-[400px]">
//               <PricingCard
//                 title={plan.title}
//                 price={plan.price}
//                 subtitle={plan.subtitle}
//                 features={plan.features}
//                 buttonText={plan.buttonText}
//                 buttonColor={plan.buttonColor}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </AnimatedBeam>
//   );
// }


import AnimatedBeam from "@/components/ui/animated-beam";
import PricingCard from "./PricingCard";

export default function PricingSection() {
  const pricingData = [
    {
      title: "Free",
      price: 0,
      subtitle: "Free Package",
      features: ["Bidding Features"],
      buttonText: "Free",
      buttonColor: "bg-gray-400 hover:bg-gray-400",
    },
    {
      title: "Premium",
      price: 12,
      subtitle: "Premium Plan",
      features: [
        "Bidding Features",
        "Auction Features",
        "Free Shipping",
        "No Additional Taxes",
        "Quality Assurance",
      ],
      buttonText: "Get Started",
      buttonColor: "bg-red-500 hover:bg-red-600",
    },
  ];

  return (
    <AnimatedBeam>
      <div className="py-8 px-4 max-w-7xl mx-auto">
        <h1 className="text-center text-4xl font-bold text-white mb-4">
          A perfect fit for everyone
        </h1>
        <p className="text-center text-md max-w-5xl mx-auto font-[300] text-white mb-4">
          Elevate your marketing without financial stress. Maker4U offers flexible pricing plans
          adjustable to businesses of all sizes. Choose the plan that aligns with your ambitions and
          witness your promotions mount to new heights.
        </p>
        
        {/* Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
          {pricingData.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              subtitle={plan.subtitle}
              features={plan.features}
              buttonText={plan.buttonText}
              buttonColor={plan.buttonColor}
            />
          ))}
        </div>
      </div>
    </AnimatedBeam>
  );
}
