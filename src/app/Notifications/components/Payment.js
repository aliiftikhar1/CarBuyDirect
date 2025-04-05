"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Reply } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import prisma from "@/lib/prisma"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertCircle, CreditCard } from "lucide-react"

// You'll need to replace this with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export default function Payment({ auction , notificationId}) {
  const [open, setOpen] = useState(false)
  const userDetails = useSelector((state) => state.CarUser.userDetails)
  const stripeCustomerId = userDetails.stripeCustomerId

  return (
    <div className="flex flex-row justify-end mt-8">
      <Button onClick={() => setOpen(true)} className="flex-1">
        <Reply className="mr-2 h-4 w-4" />
        Pay Now
      </Button>

      <Elements stripe={stripePromise}>
        <PaymentDialog open={open} setOpen={setOpen} notificationId={notificationId} stripeCustomerId={stripeCustomerId} auction={auction} />
      </Elements>
    </div>
  )
}

function PaymentDialog({ open, setOpen, stripeCustomerId, auction, notificationId }) {
  console.log("Displaig auction before payment", auction)
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [useExistingPaymentMethod, setUseExistingPaymentMethod] = useState(true)
  const [clientSecret, setClientSecret] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardError, setCardError] = useState("")
  const latestBid =auction.Bids[auction.Bids.length - 1]
  const [isValidating, setIsValidating] = useState(false)
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  })

  useEffect(() => {
    if (open && stripeCustomerId) {
      fetchPaymentMethods()
      createPaymentIntent()
    }
  }, [open, stripeCustomerId])

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/stripe/getPaymentMethod/${stripeCustomerId}`)
      const data = await response.json()

      if (data.paymentMethods && data.paymentMethods.length > 0) {
        setPaymentMethods(data.paymentMethods)
        setSelectedPaymentMethod(data.paymentMethods[0].id)
      } else {
        setUseExistingPaymentMethod(false)
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error)
      toast.error("Failed to load payment methods")
      setUseExistingPaymentMethod(false)
    } finally {
      setLoading(false)
    }
  }

  const createPaymentIntent = async () => {
    try {
      const response = await fetch("/api/stripe/createPaymentIntent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: auction.Bids[auction.Bids.length - 1].price * 100, // Convert to cents
          currency: "usd",
          customerId: stripeCustomerId,
        }),
      })

      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error("Error creating payment intent:", error)
      toast.error("Failed to initialize payment")
    }
  }

  const handleCardChange = (event) => {
    // Clear any previous errors when the user makes changes
    setCardError(event.error ? event.error.message : "")

    // Update the completion status of the card element
    if (event.elementType) {
      setCardComplete((prev) => ({
        ...prev,
        [event.elementType]: event.complete,
      }))
    }
  }

  const validateCardDetails = async () => {
    setIsValidating(true)
    setCardError("")

    try {
      // Check if stripe and elements are loaded
      if (!stripe || !elements) {
        setCardError("Stripe has not loaded yet. Please try again.")
        setIsValidating(false)
        return false
      }

      // Check if name on card is provided
      if (!cardName.trim()) {
        setCardError("Name on card is required")
        setIsValidating(false)
        return false
      }

      // Check if all card fields are complete
      if (!cardComplete.cardNumber || !cardComplete.cardExpiry || !cardComplete.cardCvc) {
        setCardError("Please complete all card information fields")
        setIsValidating(false)
        return false
      }

      // Create a payment method with the card element
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: cardName,
        },
      })

      if (error) {
        setCardError(error.message)
        setIsValidating(false)
        return false
      }

      // If we have a payment method, we need to attach it to the customer
      const response = await fetch("/api/stripe/setup-payment-method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          customerId: stripeCustomerId || null,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setCardError(data.error || "Failed to save payment method")
        setIsValidating(false)
        return false
      }

      // Card is valid and saved to customer
      setSelectedPaymentMethod(paymentMethod.id)
      setUseExistingPaymentMethod(true)
      setIsValidating(false)
      return true
    } catch (error) {
      console.error("Card validation error:", error)
      setCardError("An error occurred while validating your card. Please try again.")
      setIsValidating(false)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setLoading(true)

    try {
      let result

      if (useExistingPaymentMethod && selectedPaymentMethod) {
        // Use existing payment method
        result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: selectedPaymentMethod,
        })
      } else {
        // First validate and save the new card
        const isValid = await validateCardDetails()
        if (!isValid) {
          setLoading(false)
          return
        }

        // Now use the newly created payment method
        result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: selectedPaymentMethod,
        })

        
      }
      console.log("Stripe Results are : ", result)
      

      if (result.error) {
        throw new Error(result.error.message)
      }else{
        const response = await fetch("/api/user/endAuction/postUpdation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auction: auction,
             latestBid: latestBid,
              notificationId: notificationId
          }),
        })
  
        const data = await response.json()

        
    }
      // Payment successful
      toast.success("Your payment has been processed successfully")

      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error("Payment error:", error)
      toast.error( "There was an error processing your payment")
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (card) => {
    return `•••• •••• •••• ${card.last4}`
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            Complete your payment for {typeof auction.title === "string" ? auction.title : "this auction"}.
            {auction.Bids[auction.Bids.length - 1].price && (
              <span className="font-semibold block mt-2">
                Total: ${auction.Bids[auction.Bids.length - 1].price.toFixed(2)}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {paymentMethods.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="useExisting"
                  checked={useExistingPaymentMethod}
                  onChange={() => setUseExistingPaymentMethod(true)}
                  className="h-4 w-4"
                />
                <Label htmlFor="useExisting">Use existing payment method</Label>
              </div>

              {useExistingPaymentMethod && (
                <div className="pl-6 space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={method.id}
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => setSelectedPaymentMethod(method.id)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor={method.id} className="flex items-center">
                        {method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)}
                        <span className="ml-2">{formatCardNumber(method.card)}</span>
                        <span className="ml-2">
                          Exp: {method.card.exp_month}/{method.card.exp_year}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="useNew"
                  checked={!useExistingPaymentMethod}
                  onChange={() => setUseExistingPaymentMethod(false)}
                  className="h-4 w-4"
                />
                <Label htmlFor="useNew">Use a new payment method</Label>
              </div>
            </div>
          )}

          {!useExistingPaymentMethod && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="cardName" className="text-sm">
                  Name on Card
                </Label>
                <Input
                  id="cardName"
                  placeholder="Name on Card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className={`h-9 ${cardError && !cardName ? "border-red-500" : ""}`}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cardNumber" className="text-sm">
                  Card Number
                </Label>
                <div className="border rounded-md p-2 h-10 flex items-center">
                  <CardNumberElement
                    id="cardNumber"
                    options={cardElementOptions}
                    onChange={handleCardChange}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="cardExpiry" className="text-sm">
                    Expiry Date
                  </Label>
                  <div className="border rounded-md p-2 h-10 flex items-center">
                    <CardExpiryElement
                      id="cardExpiry"
                      options={cardElementOptions}
                      onChange={handleCardChange}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cardCvc" className="text-sm">
                    CVC
                  </Label>
                  <div className="border rounded-md p-2 h-10 flex items-center">
                    <CardCvcElement
                      id="cardCvc"
                      options={cardElementOptions}
                      onChange={handleCardChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <CreditCard className="h-3 w-3" />
                <span>Your card information is encrypted and securely stored</span>
              </div>

              {cardError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-600">{cardError}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !stripe || !elements || !clientSecret}>
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

