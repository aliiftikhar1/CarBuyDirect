"use client"
import { Check, Sparkles, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import AnimatedBeam from "@/components/ui/animated-beam"
import { PaymentDialog } from "./PricingSectionPayment"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { getReduxUserDetails } from "../Actions"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export default function PricePlan() {
  // Get userId from Redux store
  const userId = useSelector((data) => data.CarUser?.userDetails?.id)
  const userDetails = useSelector((data) => data.CarUser?.userDetails)
  const stripeCustomerId = userDetails?.stripeCustomerId
  const dispatch = useDispatch()
  const [userPlan, setUserPlan] = useState("free")
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [planEndDate, setPlanEndDate] = useState(null)
  const [isPlanExpired, setIsPlanExpired] = useState(false)

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

          // Handle plan end date
          if (data.user.pricePlanEndDate) {
            setPlanEndDate(data.user.pricePlanEndDate)

            // Check if plan has expired
            const endDate = new Date(data.user.pricePlanEndDate)
            const currentDate = new Date()
            setIsPlanExpired(currentDate > endDate)
          }
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

  // Function to handle plan selection and open payment dialog
  const handlePlanSelection = (plan) => {
    if (plan.id === userPlan || !userId) return

    if (plan.id === "free") {
      // Downgrading to free plan doesn't require payment
      updatePricePlan("free")
    } else {
      // For premium plan, open payment dialog
      setSelectedPlan(plan)
      setPaymentDialogOpen(true)
    }
  }

  // Function to update user's price plan after successful payment
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
          amount: newPlan === "premium" ? 12 : 0, // Assuming premium plan costs $12
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
      
            getReduxUserDetails(userId, dispatch).then((data) => {
              console.log("UserDetails is:", data)
            })
           
    }
  }

  const handleRenewPlan = () => {
    // For premium plan renewal, open payment dialog with the current plan
    const currentPlan = plans.find((plan) => plan.id === userPlan)
    if (currentPlan) {
      setSelectedPlan(currentPlan)
      setPaymentDialogOpen(true)
      
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
    <AnimatedBeam>
      <div className="container text-white py-12 mx-auto px-4">
        <div className="w-full text-center text-4xl font-bold pb-8">Price Plans</div>
        {/* <div className="w-full text-center text-4xl font-bold pb-8">{userDetails?.pricePlan} {userDetails?.pricePlanEndDate}</div> */}
        <div className="grid md:grid-cols-2 gap-8 md:max-w-4xl h-full md:h-[33rem] mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`
                relative overflow-hidden bg-white/20 border flex flex-col justify-between
                transition-all duration-300 
                ${plan.current ? "ring-2 ring-primary ring-offset-2" : ""}
                ${plan.id === "premium" ? "shadow-[0_0_25px_#ffff]  " : ""}
              `}
            >
              {plan.id === "premium" && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-bl-lg rounded-tr-md bg-primary text-primary-foreground">POPULAR</Badge>
                </div>
              )}

              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-between text-white justify-between">
                  <CardTitle className="text-2xl text-white font-bold">
                    {plan.id === "premium" ? (
                      <div className="flex items-center text-white">
                        {plan.name}
                        <Sparkles className="h-5 w-5 ml-2 text-amber-400" />
                      </div>
                    ) : (
                      plan.name
                    )}
                  </CardTitle>
                </div>

                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl text-white font-extrabold">${plan.price === 0 ? "0" : plan.price}</span>
                  <div className="ml-2">
                    <span className="text-white text-lg ml-1">/ month</span>
                  </div>
                </div>
                {plan.current && planEndDate && (
                  <div className="mt-2 text-sm text-white">
                    {isPlanExpired ? (
                      <span className="text-red-300">Expired on {new Date(planEndDate).toLocaleDateString()}</span>
                    ) : (
                      <span>Valid until {new Date(planEndDate).toLocaleDateString()}</span>
                    )}
                  </div>
                )}
                <CardDescription className="mt-3 text-white text-base">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="pb-8 h-full">
                <p className="mb-4 text-sm font-medium text-white">INCLUDES:</p>
                <ul className="space-y-3 text-white">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <div className="rounded-full bg-green-500/60 p-1 mr-3">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {isPlanExpired && plan.current ? (
                  <Button
                    variant="default"
                    className="w-full py-5 rounded-md font-medium bg-amber-500 hover:bg-amber-600"
                    onClick={handleRenewPlan}
                  >
                    Renew Plan
                  </Button>
                ) : (
                  <Button
                    variant={plan.current ? "outline" : "default"}
                    className={`
                      w-full py-5 rounded-md font-medium
                      ${plan.current ? "border-primary text-primary hover:bg-primary/5" : ""}
                    `}
                    disabled={plan.current || isUpdating}
                    onClick={() => handlePlanSelection(plan)}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : plan.current ? (
                      "Current Plan"
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Payment Dialog */}
        {selectedPlan && (
          <Elements stripe={stripePromise}>
            <PaymentDialog
              open={paymentDialogOpen}
              setOpen={setPaymentDialogOpen}
              stripeCustomerId={stripeCustomerId}
              amount={selectedPlan.price}
              planName={selectedPlan.name}
              onPaymentSuccess={() => {
                updatePricePlan(selectedPlan.id)
                // Reset the expired state after successful renewal
                if (isPlanExpired) {
                  setIsPlanExpired(false)
                  // Set a new end date one month from now (this is just for UI, the actual date will come from the API)
                  const newEndDate = new Date()
                  newEndDate.setMonth(newEndDate.getMonth() + 1)
                  setPlanEndDate(newEndDate.toISOString())

                }
              }}
            />
          </Elements>
        )}
      </div>
    </AnimatedBeam>
  )
}

