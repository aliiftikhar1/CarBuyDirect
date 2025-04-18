"use client"
import { Check, Sparkles, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useSelector } from "react-redux"

export default function PricePlan() {
  // Get userId from Redux store
  const userId = useSelector((data) => data.CarUser?.userDetails?.id)

  const [userPlan, setUserPlan] = useState("free")
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch user's price plan from API
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!userId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`/api/user/pricePlan/getpricePlan/${userId}`)
        const data = await response.json()

        if (data.success && data.user) {
          setUserPlan(data.user.pricePlan || "free")
        } else {
          console.error("Failed to fetch user plan:", data.message)
          toast.error("Failed to load your subscription plan")
        }
      } catch (error) {
        console.error("Error fetching user plan:", error)
        toast.error("Failed to load your subscription plan")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserPlan()
  }, [userId])

  // Function to update user's price plan
  const updatePricePlan = async (newPlan) => {
    if (newPlan === userPlan || !userId) return

    try {
      setIsUpdating(true)
      const response = await fetch(`/api/user/pricePlan/changepricePlan/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pricePlan: newPlan,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setUserPlan(newPlan)
        toast.success(`Your plan has been updated to ${newPlan.charAt(0).toUpperCase() + newPlan.slice(1)}`)
      } else {
        console.error("Failed to update plan:", data.message)
        toast.error("Failed to update your subscription plan")
      }
    } catch (error) {
      console.error("Error updating plan:", error)
      toast.error("Failed to update your subscription plan")
    } finally {
      setIsUpdating(false)
    }
  }

  // Define all available plans
  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Basic features for personal use",
      price: 0,
      features: ["Bidding Features"],
      current: userPlan === "free",
    },
    {
      id: "premium",
      name: "Premium",
      description: "Advanced features for power users",
      price: 12,
      features: ["Bidding Features", "Auction Features", "Free Shipping", "No Additional Taxes", "Quality Assurance"],
      current: userPlan === "premium",
    },
  ]

  if (isLoading) {
    return (
      <div className="container py-12 mx-auto px-4 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-12 mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`
              relative overflow-hidden border flex flex-col justify-between
              ${plan.current ? "ring-2 ring-primary ring-offset-2" : ""}
              transition-all duration-300 hover:shadow-lg
            `}
          >
            {plan.id === "premium" && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-bl-lg rounded-tr-md bg-primary text-primary-foreground">POPULAR</Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <div className="flex items-between justify-between">
                <CardTitle className="text-2xl font-bold z-10">
                  {plan.id === "premium" ? (
                    <div className="flex items-center">
                      {plan.name}
                      <Sparkles className="h-5 w-5 ml-2 text-amber-400" />
                    </div>
                  ) : (
                    plan.name
                  )}
                </CardTitle>
                {plan.current && (
                  <>
                    <div className="bg-green-500 text-white font-bold size-[30rem] absolute z-0 -top-[22rem] transition-all duration-500 -right-[15rem] py-16 px-28 rounded-full flex items-end justify-start">
                      Current Plan
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 flex items-baseline z-10">
                <span className="text-5xl font-extrabold">${plan.price === 0 ? "0" : plan.price}</span>
                <div className="ml-2">
                  <span className="text-black text-lg ml-1">/ month</span>
                </div>
              </div>
              <CardDescription className="mt-3 text-base z-10">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-8 h-full z-10">
              <p className="mb-4 text-sm font-medium text-muted-foreground">INCLUDES:</p>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <div className="rounded-full bg-primary/10 p-1 mr-3">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={plan.current ? "outline" : "default"}
                className={`
                  w-full py-5 rounded-md font-medium
                  ${plan.current ? "border-primary text-primary hover:bg-primary/5" : ""}
                `}
                disabled={plan.current || isUpdating}
                onClick={() => updatePricePlan(plan.id)}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : plan.current ? (
                  "Current Plan"
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

