"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { updateUserDetails } from "@/app/Actions"
import { Check, Loader, Wallet, ArrowLeft, ArrowRight, Banknote, AlertCircle, CreditCard } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js"
import { debounce } from "lodash"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function BidRegistrationForm({ setHandler, setIsDialogOpen }) {
  return (
    <Elements stripe={stripePromise}>
      <BidRegistrationFormContent setHandler={setHandler} setIsDialogOpen={setIsDialogOpen} />
    </Elements>
  )
}

function BidRegistrationFormContent({ setHandler, setIsDialogOpen }) {
  const userdetails = useSelector((data) => data.CarUser.userDetails)
  const [loader, setLoader] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("")
  const dispatch = useDispatch()
  const [isChecking, setIsChecking] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState("idle")
  const [statusMessage, setStatusMessage] = useState("")

  // Stripe hooks
  const stripe = useStripe()
  const elements = useElements()
  const [cardError, setCardError] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  })

  const [formData, setFormData] = useState({
    id: userdetails?.id || "",
    username: userdetails?.username || "",
    name: userdetails?.name || "",
    email: userdetails?.email || "",
    cardName: userdetails?.cardName || "",
    phoneNo: userdetails?.phoneNo || "",
    address: userdetails?.address || "",
    city: userdetails?.city || "",
    country: userdetails?.country || "Pakistan",
    province: userdetails?.province || "",
    zipcode: userdetails?.zipcode || "",
    paymentMethod: "",
  })

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleSelectChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }))
  }

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method)
    setFormData((prevData) => ({
      ...prevData,
      paymentMethod: method,
    }))
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
    if (currentStep === 5) {
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
        if (!formData.cardName.trim()) {
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
            name: formData.cardName,
            email: formData.email,
            phone: formData.phoneNo,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.province,
              postal_code: formData.zipcode,
              country: formData.country === "Pakistan" ? "PK" : formData.country,
            },
          },
        })

        if (error) {
          setCardError(error.message)
          setIsValidating(false)
          return false
        }

        // If we have a payment method, we need to attach it to the customer
        // This would typically be done via a server action
        const response = await fetch("/api/stripe/setup-payment-method", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            customerId: userdetails.stripeCustomerId || null,
            email: formData.email,
            name: formData.name || formData.username,
          }),
        })

        const data = await response.json()

        if (!data.success) {
          setCardError(data.error || "Failed to save payment method")
          setIsValidating(false)
          return false
        }

        // Card is valid and saved to customer
        setIsValidating(false)
        return true
      } catch (error) {
        console.error("Card validation error:", error)
        setCardError("An error occurred while validating your card. Please try again.")
        setIsValidating(false)
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    setLoader(true)
    try {
      const response = await updateUserDetails({ ...formData, paymentMethod }, dispatch)
      if (response.status) {
        setLoader(false)
        toast.success("Form submitted successfully!")
        setHandler((prev) => !prev)
        setIsDialogOpen((prev) => !prev)
      } else {
        setLoader(false)
        toast.error("Failed to submit form. Please try again.")
      }
    } catch (error) {
      setLoader(false)
      toast.error("An error occurred. Please try again later.")
    }
  }

  const nextStep = async () => {
    if (currentStep === 5) {
      const isValid = await validateCardDetails()
      if (!isValid) {
        toast.error(cardError || "Please check your card details")
        return
      }
    }

    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
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

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (!username || username.length < 3) {
        setUsernameStatus("idle")
        setStatusMessage("")
        return
      }

      setIsChecking(true)
      try {
        const response = await fetch("/api/dataVerification/username", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        })

        const data = await response.json()
        console.log("Data ",data)

        if (response.status === 201) {
          // Username exists
          setUsernameStatus("invalid")
          setStatusMessage(data.message)
        } else if (response.status === 200) {
          // Username is available
          setUsernameStatus("valid")
          setStatusMessage(data.message)
        } else {
          // Error
          setUsernameStatus("error")
          setStatusMessage("Failed to verify username")
        }
      } catch (error) {
        setUsernameStatus("error")
        setStatusMessage("Error checking username")
        console.error("Error verifying username:", error)
      } finally {
        setIsChecking(false)
      }
    }, 500),
    [],
  )

  // Check username when it changes
  useEffect(() => {
    if (formData.username) {
      checkUsername(formData.username)
    } else {
      setUsernameStatus("idle")
      setStatusMessage("")
    }
  }, [formData.username, checkUsername])

  return (
    <Card className="w-full flex flex-col justify-between max-w-full border-none shadow-none p-0 overflow-hidden">
      <CardHeader className="space-y-4 pb-0 px-4">
        <div className="w-full">
          <h2 className="font-semibold text-xl">Register To Bid</h2>

          {/* Stepper indicator */}
          <div className="">
            {/* Progress bar background */}
            <div className="relative my-2 w-[95%] top-[0.8rem] mx-auto">
              <div className="absolute top-1/3 left-0 right-0 h-1  bg-muted"></div>

              {/* Progress bar fill */}
              <div
                className={`absolute top-1/3 h-1 left-1 bg-primary transition-all duration-300 ease-in-out`}
                style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
              ></div>
            </div>
            {/* Step indicators */}
            <div className="relative flex justify-between">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`relative z-10 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border-2 transition-all
                      ${
                        currentStep === step
                          ? "border-primary bg-primary text-primary-foreground"
                          : currentStep > step
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted bg-background text-muted-foreground"
                      }`}
                  >
                    {currentStep > step ? (
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <span className="text-[10px] sm:text-xs font-medium">{step}</span>
                    )}
                  </div>
                  <span className="mt-1 text-[8px] sm:text-[10px] max-w-12 font-medium overflow-clip text-center">
                    {step === 1 && "Welcome"}
                    {step === 2 && "Personal Details"}
                    {step === 3 && "Other Details"}
                    {step === 4 && "Greeting"}
                    {step === 5 && "Payment"}
                    {step === 6 && "Thanks"}
                    {step === 7 && "Method"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className="space-y-4 px-4 py-2 w-full h-full overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 220px)" }}
      >
        {/* Step 1: Greeting for new bidder */}
        {currentStep === 1 && (
          <div className="space-y-4 text-center flex flex-col justify-center w-full h-full">
            <Image
              src="/logo/1.png"
              alt="CarBuyDirect Cars"
              width={1200}
              height={1200}
              className="mx-auto w-[50%] h-12 object-cover"
            />
            <h3 className="text-xl font-semibold">Welcome to CarBuyDirect!</h3>
            <p className="text-muted-foreground text-sm">
              We're excited to have you join our bidding community. Let's get you set up so you can start bidding on
              your dream car.
            </p>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {currentStep === 2 && (
          <div className="flex flex-col justify-between w-full h-full">
            <h3 className="text-lg font-semibold">Your Personal Information</h3>
            <p className="text-muted-foreground text-sm mb-2">Please provide your personal details below.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm">
                  Full Name (optional)
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-9"
                />
                <p className="text-xs text-muted-foreground">Please verify that this is your complete legal name.</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="username" className="text-sm">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`h-9 ${
                      usernameStatus === "invalid"
                        ? "border-red-500 focus-visible:ring-red-500"
                        : usernameStatus === "valid"
                          ? "border-green-500 focus-visible:ring-green-500"
                          : ""
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {isChecking && <Loader className="h-4 w-4 animate-spin text-muted-foreground" />}
                    {!isChecking && usernameStatus === "valid" && <Check className="h-4 w-4 text-green-500" />}
                    {!isChecking && usernameStatus === "invalid" && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
                {statusMessage && (
                  <p
                    className={`text-xs ${
                      usernameStatus === "invalid"
                        ? "text-red-500"
                        : usernameStatus === "valid"
                          ? "text-green-500"
                          : "text-muted-foreground"
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-9"
                />
                <p className="text-xs text-muted-foreground">
                  We'll use this email for account verification and notifications.
                </p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="phoneNo" className="text-sm">
                  Phone Number
                </Label>
                <Input
                  id="phoneNo"
                  placeholder="Phone Number"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  className="h-9"
                />
                <p className="text-xs text-muted-foreground">We'll use this number to contact you about your bids.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location Details */}
        {currentStep === 3 && (
          <div className="flex flex-col justify-between w-full h-full">
            <h3 className="text-lg font-semibold">Other Details</h3>

            <div className="space-y-1">
              <Label htmlFor="address" className="text-sm">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="city" className="text-sm">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="country" className="text-sm">
                  Country
                </Label>
                <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="province" className="text-sm">
                  State / Province
                </Label>
                <Input
                  id="province"
                  placeholder="State / Province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="zipcode" className="text-sm">
                  Postal / Zip code
                </Label>
                <Input
                  id="zipcode"
                  placeholder="Postal / Zip code"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  className="h-9"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Personal greeting */}
        {currentStep === 4 && (
          <div className="space-y-4 text-center flex flex-col justify-center w-full h-full">
            <h3 className="text-xl font-semibold">Hello, {formData.name || formData.username || "there"}!</h3>
            <p className="text-muted-foreground text-sm">
              Thank you for providing your personal information. Now, let's set up your payment details so you're ready
              to bid.
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="italic text-sm">
                "You're just a few steps away from bidding on your dream car. Let's continue with your payment
                information."
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Get card details */}
        {currentStep === 5 && (
          <div className="flex flex-col justify-between w-full h-full">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Please enter your card details below. This information is securely stored.
            </p>

            <div className="space-y-1 mb-4">
              <Label htmlFor="cardName" className="text-sm">
                Name on Card
              </Label>
              <Input
                id="cardName"
                placeholder="Name on Card"
                value={formData.cardName}
                onChange={handleInputChange}
                className={`h-9 ${cardError && !formData.cardName ? "border-red-500" : ""}`}
              />
            </div>

            <div className="space-y-3">
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

        {/* Step 6: Thanksgiving text */}
        {currentStep === 6 && (
          <div className="space-y-4 text-center flex flex-col justify-center w-full h-full">
            <h3 className="text-xl font-semibold">Thank You!</h3>
            <p className="text-muted-foreground text-sm">
              Thank you for providing your payment information. Your details have been securely saved.
            </p>
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-primary font-medium text-sm">
                You're almost there! Just one more step to complete your registration.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Guaranteed safe & secure checkout</span>
            </div>
          </div>
        )}

        {/* Step 7: Finance/Cash option */}
        {currentStep === 7 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Select Payment Method</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Please select your preferred payment method for bidding.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                className={`border rounded-lg p-3 cursor-pointer transition-all hover:border-primary ${
                  paymentMethod === "finance" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => handlePaymentMethodSelect("finance")}
              >
                <div className="flex flex-col items-center text-center gap-1">
                  <Wallet className="h-8 w-8 text-primary" />
                  <h4 className="font-semibold text-sm">Finance</h4>
                  <p className="text-xs text-muted-foreground">Pay in installments with our financing options</p>
                </div>
              </div>

              <div
                className={`border rounded-lg p-3 cursor-pointer transition-all hover:border-primary ${
                  paymentMethod === "cash" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => handlePaymentMethodSelect("cash")}
              >
                <div className="flex flex-col items-center text-center gap-1">
                  <Banknote className="h-8 w-8 text-primary" />
                  <h4 className="font-semibold text-sm">Cash</h4>
                  <p className="text-xs text-muted-foreground">Make a one-time payment for your purchase</p>
                </div>
              </div>
            </div>

            {paymentMethod && (
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-xs">
                  You've selected{" "}
                  <span className="font-semibold">{paymentMethod === "finance" ? "Finance" : "Cash"}</span> as your
                  payment method.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between p-4 border-t">
        {currentStep > 1 && (
          <Button variant="outline" onClick={prevStep} size="sm">
            <ArrowLeft className="mr-1 h-3 w-3" /> Previous
          </Button>
        )}
        {currentStep < 7 ? (
          <Button
            className={`${currentStep > 1 ? "ml-auto" : "w-full"}`}
            onClick={nextStep}
            size="sm"
            disabled={isValidating || (currentStep === 2 && usernameStatus === "invalid")}
          >
            {isValidating && currentStep === 5 ? <Loader className="animate-spin mr-1 h-3 w-3" /> : null}
            Next <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        ) : (
          <Button
            className={`${currentStep > 1 ? "ml-auto" : "w-full"}`}
            onClick={handleSubmit}
            disabled={!paymentMethod || loader}
            size="sm"
          >
            {loader ? <Loader className="animate-spin mr-1 h-3 w-3" /> : null}
            Submit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

