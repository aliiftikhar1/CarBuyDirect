import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"


export default function PricingCard({
  title,
  price,
  subtitle,
  features,
  buttonText,
  buttonColor = "bg-blue-300 hover:bg-blue-400",
  isSubscribed = false,
}) {
  return (
    <div className="flex flex-col border p-8 w-100 h-[80vh] hover:rotate-1 transition-all duration-500 text-white bg-white/10 hover:bg-white/20 bg-opacity-50 b rounded-lg shadow-lg">
      <h3 className="text-4xl font-extrabold text-left mb-2">{title}</h3>
      <div className="text-left mb-4">
        <div className="flex items-center justify-start">
          <span className="text-3xl font-semibold">USD</span>
          <span className="text-5xl font-bold mx-1">{price}</span>
          <span className="">/ month</span>
        </div>
        <p className="text-gray-200 text-lg mt-2">{subtitle}</p>
      </div>

      <div className="flex-grow">
        <p className="mb-4">You can get:</p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        className={cn(
          "w-full mt-8 text-white font-semibold py-2 px-4 rounded-full transition-colors",
          buttonColor,
          isSubscribed && "bg-green-500 hover:bg-green-600",
        )}
      >
        {isSubscribed ? "Subscribed" : buttonText}
      </Button>
    </div>
  )
}

