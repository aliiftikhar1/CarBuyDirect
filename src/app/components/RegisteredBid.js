"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Check, Eye, EyeOff, Loader } from "lucide-react"
import { useDispatch } from "react-redux"
import { setUserDetails } from "@/store/UserSlice"
import { Box, Grid, Modal, Typography } from "@mui/material"
import BidRegistrationForm from "../Auction/[id]/components/BidRegisterationDialog"
// Modal styling
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: 4,
};
function RegisteredBid({ open, onClose, email }) {
    const dispatch = useDispatch()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loadingAction, setLoadingAction] = useState(null)
    const [agree, setAgree] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [handler, setHandler] = useState(false);

    const isValid = (value) => value.length >= 3
    const isPasswordValid = password.length >= 12
    const isFormValid = isValid(firstName) && isValid(lastName) && isPasswordValid && agree
    const [opens, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSubmit = async () => {
        if (!isFormValid) {
            toast.error("Please fill in all fields correctly")
            return
        }

        const payload = { email, name: firstName, password }

        try {
            setLoadingAction("register")
            const response = await fetch(`/api/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            const result = await response.json()
            if (result.success) {
                toast.success("User registered successfully")
                dispatch(setUserDetails(result.data))
                handleOpen()
                // onClose()
                // window.location.replace('/')
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error("Error submitting registration:", error)
            toast.error("An error occurred during registration")
        } finally {
            setLoadingAction(null)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-xs md:max-w-sm p-4">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Sign Up</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 text-xl">
                        {[{ label: "First Name", value: firstName, setter: setFirstName },
                        { label: "Last Name", value: lastName, setter: setLastName }].map(({ label, value, setter }) => (
                            <div key={label} className="relative">
                                <Input
                                    type="text"
                                    placeholder={label}
                                    value={value}
                                    style={{ color: "#5f924a" }}
                                    className={`rounded-none px-4 py-6 ${isValid(value) ? 'bg-green-100' : 'bg-white'}`}
                                    onChange={(e) => setter(e.target.value)}
                                />
                                {isValid(value) && <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500" />}
                            </div>
                        ))}
                        <div className="relative">
                            <Input type="email" style={{ color: '#5f924a' }} value={email} disabled className="rounded-none px-4 py-6 bg-green-100" placeholder="Email" />
                            <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500" />
                        </div>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                style={{ color: "#5f924a" }}

                                className={`rounded-none px-4 py-6 ${isPasswordValid ? 'bg-green-100' : 'bg-white'}`}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                            {isPasswordValid && <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500" />}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
                            <small>I agree to CarBuyDirect Cars's <a href="#" className="underline ms-2" style={{ fontSize: "15px" }}>Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.</small>
                        </div>
                        <Button
                            className="w-full bg-black text-white rounded-none px-4 py-6"
                            onClick={handleSubmit}
                            disabled={!isFormValid || loadingAction === "register"}
                        >
                            {loadingAction === "register" ? <Loader className="animate-spin" /> : "Create account"}
                        </Button>
                        <p className="text-center text-sm mt-2">
                            <a href="/login" className="text-decoration-none fw-bold">Log in here</a>
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={opens} onOpenChange={setOpen}>
                <DialogContent className="max-w-xs md:max-w-sm p-4">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            <div className="">
                                <Typography variant="body1" style={{ marginTop: '20px' }}>
                                    Welcome!
                                </Typography>
                                <Typography variant="body2" style={{ marginBottom: '20px' }}>
                                    What would you like to do next?
                                </Typography>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="w-full" style={{ gap: "20px 20px" }}>
                        <Button className="w-full mt-3 bg-black text-white rounded-none px-4 py-6" onClick={() => { setIsDialogOpen(true) }}>Register to bid</Button>
                        <Button className="w-full mt-3 bg-black text-white rounded-none px-4 py-6">Sell my vehicle</Button>
                        <Button className="w-full mt-3 bg-black text-white rounded-none px-4 py-6">Continue</Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <BidRegistrationForm setHandler={setHandler} setIsDialogOpen={setIsDialogOpen} />
                </DialogContent>
            </Dialog>
            {/* <BidRegistrationForm setHandler={setHandler} setIsDialogOpen={setIsDialogOpen} /> */}

        </>

    )
}

export default RegisteredBid