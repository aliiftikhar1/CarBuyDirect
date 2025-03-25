import React, { useState } from "react";
import { Button, TextField, Modal, Box, Typography, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { CheckCircle, InfoOutlined } from "@mui/icons-material";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import BidRegistrationForm from "../Auction/[id]/components/BidRegisterationDialog";



function BuynowButton({ data }) {
    const [open, setOpen] = useState(false);
    const [dealOpen, setDealOpen] = useState(false);
    const [price, setPrice] = useState("");
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [handler, setHandler] = useState(false);
    const [loading, setLoading] = useState(false)
    const user = useSelector((state) => state.CarUser.userDetails);
    const isEligible = user?.cardName && user?.cardNumber && user?.cardExpiry && user?.cardCvc;

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleBuyBtn = () => {
        if (!user) {
            alert("Please login to place a bid.");
        } else if (!isEligible) {
            setIsDialogOpen(true);
        } else {
            handleOpen();
        }
        // handleOpen();
    }
    const handleDealOpen = () => {
        setDealOpen(true);
        setOpen(false);
    };
    const handleDealClose = () => setDealOpen(false);

    const handleSend = async () => {
        setLoader(true)
        const payload = {
            // originalprice: data?.CarSubmission?.buyPrice,
            price,
            message,
            auctionId: data.id,
            sellerId: data.sellerId,
            userId: user.id,
            receiverEmail: data.CarSubmission.email,
            userName: user.name || user.email,
            vehicleYear: data.CarSubmission.vehicleYear,
            vehicleModel: data.CarSubmission.vehicleModel,

        };
        try {
            const response = await fetch("/api/user/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.status === 200) {
                setLoader(false);
                toast.success("✅ Your deal has been successfully submitted! The car owner will review your offer and get back to you soon.");
                handleDealClose();
                setPrice('');
                setMessage('');
            } else {
                setLoader(false)
            }
        } catch (error) {
            setLoader(false)
            console.error("Error sending notification:", error);
        }
    };
    const handleCheckout = async () => {
        try {
            const response = await fetch("/api/user/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    sellerId: data.sellerId,
                    amount: 10000, // Amount in cents (100.00 USD)
                    productName: "Car Model X"
                })
            });

            const { sessionId } = await response.json();
            if (!response.ok) {
                setLoading(false)
                alert("Oops! Something went wrong. Please try again later.");
                return handleClose();
            }
            if (sessionId) {
                setLoading(false)
                window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
            }
        } catch (error) {
            setLoading(false)
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    };
    const handleBuy = async () => {
        setLoading(true)
        const productName = data?.CarSubmission?.vehicleModel + " " + data?.CarSubmission?.vehicleMake + " " + data?.CarSubmission?.vehicleYear
        const payload = {
            price,
            message,
            auctionId: data.id,
            sellerId: data.sellerId,
            userId: user.id,
            receiverEmail: data.CarSubmission.email,
            userName: user.name || user.email,
            vehicleYear: data.CarSubmission.vehicleYear,
            vehicleModel: data.CarSubmission.vehicleModel,

        };
        // try {
        //     const response = await fetch("/api/user/buyerdealdone", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(payload),
        //     });

        //     const result = await response.json();
        //     if (result.status === 200) {

        //         handleCheckout()
        //         toast.success("✅ Your deal has been successfully submitted! The car owner will review your offer and get back to you soon.");
        //         handleDealClose();
        //         setPrice('');
        //         setMessage('');
        //     } else {
        //         setLoader(false)
        //     }
        // } catch (error) {
        //     setLoader(false)
        //     console.error("Error sending notification:", error);
        // }

        setLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({userId:user.id, buyerId: user.stripeCustomerId, sellerId: data?.sellerId, productId: data?.id, productName: productName, price: data?.CarSubmission?.buyPrice }),
            });

            const response = await res.json();
            if (response.success) {
                window.location.href = response.url; // Redirect to Stripe Checkout
            } else {
                alert("Failed to process payment.");
            }
        } catch (error) {
            console.error("Error in payment:", error.message);
        }
        setLoading(false);
    }

    return (
        <div>
            <div className="flex flex-col gap-1">
            
            <button
             className="px-2 py-1 border bg-black text-white rounded-full"
                // variant="contained"
                // sx={{
                //     bgcolor: "black",
                //     color: "white",
                //     "&:hover": { bgcolor: "#333" },
                //     borderRadius: "20px",
                //     padding: "10px 20px",
                //     fontWeight: "bold",
                // }}
                onClick={handleBuyBtn}
            >
                Buy Now
            </button>
            <button
             className="px-2 py-1 border bg-purple-500 text-white rounded-full"
                // variant="contained"
                // sx={{
                //     bgcolor: "black",
                //     color: "white",
                //     "&:hover": { bgcolor: "#333" },
                //     borderRadius: "20px",
                //     padding: "10px 20px",
                //     fontWeight: "bold",
                // }}
                onClick={handleDealOpen}
            >
                Make Deal
            </button>
            
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <BidRegistrationForm setHandler={setHandler} setIsDialogOpen={setIsDialogOpen} />
                </DialogContent>
            </Dialog>

            {/* <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h5" gutterBottom>
                        Confirm Your Purchase
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Actual Price: <strong>${data?.CarSubmission?.buyPrice}</strong>
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                        <Button variant="outlined" onClick={handleDealOpen} sx={buttonOutlineStyle}>
                            Make a Deal
                        </Button>
                        <Button variant="contained" sx={buttonBuyStyle}>
                            Buy
                        </Button>
                    </Box>
                    <Button variant="outlined" onClick={handleClose} sx={buttonCloseStyle}>
                        Close
                    </Button>
                </Box>
            </Modal> */}
            <Modal open={open} onClose={handleClose}>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                    }}>
                    <Box
                        sx={{
                            backgroundColor: "white",
                            padding: { xs: 2, sm: 4 },
                            borderRadius: 3,
                            boxShadow: 24,
                            width: { xs: "100%", sm: 450 },
                            maxWidth: "90vw",
                            mx: "auto",
                            my: "10%",
                            textAlign: "center",
                            position: "relative",
                            animation: "fadeIn 0.3s ease-in-out",
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                            <CheckCircle sx={{ fontSize: 50, color: "green" }} />
                        </Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "black" }}>
                            Confirm Your Purchase
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: "gray", fontSize: "0.95rem" }}>
                            Secure this deal now before the price changes! 🚗💨
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: "black", fontSize: "1.2rem", fontWeight: "bold", mb: 1 }}
                        >
                            Actual Price: <span style={{ color: "green" }}>${data?.CarSubmission?.buyPrice}</span>
                        </Typography>
                        <Typography variant="body2" sx={{ color: "gray", fontSize: "0.85rem", mb: 2 }}>
                            This price is locked for the next <strong>15 minutes</strong>. Make your move!
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handleDealOpen}
                                sx={{
                                    borderColor: "black",
                                    color: "black",
                                    backgroundColor: "white",
                                    fontWeight: "bold",
                                    "&:hover": { backgroundColor: "black", color: "white" },
                                }}
                            >
                                Make a Deal
                            </Button>

                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "black",
                                    color: "white",
                                    fontWeight: "bold",
                                    "&:hover": { backgroundColor: "#333" },
                                }}
                                onClick={handleBuy}
                            >
                                {loading ? <Loader className="animate-spin" /> : " Buy Now"}
                            </Button>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 3, color: "gray" }}>
                            <InfoOutlined sx={{ fontSize: 18, mr: 1 }} />
                            <Typography variant="caption">
                                By proceeding, you agree to our <strong>Terms & Conditions</strong>.
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{
                                borderColor: "black",
                                color: "black",
                                backgroundColor: "white",
                                fontWeight: "bold",
                                width: "100%",
                                mt: 3,
                                "&:hover": { backgroundColor: "black", color: "white" },
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/* Make a Deal Modal */}
            <Modal open={dealOpen} onClose={handleDealClose}>
                <Box sx={{
                    backgroundColor: "white",
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 24,
                    width: 400,
                    mx: "auto",
                    my: "10%",
                }}>
                    <Typography variant="h5" gutterBottom>
                        Make a Deal
                    </Typography>
                    <TextField
                        fullWidth
                        label="Your Price Offer"
                        variant="outlined"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        sx={{
                            input: { color: "black" },
                            label: { color: "black" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "black" },
                                "&:hover fieldset": { borderColor: "black" },
                                "&.Mui-focused fieldset": { borderColor: "black" },
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Your Message"
                        variant="outlined"
                        multiline
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        sx={{
                            input: { color: "black" },
                            label: { color: "black" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "black" },
                                "&:hover fieldset": { borderColor: "black" },
                                "&.Mui-focused fieldset": { borderColor: "black" },
                            },
                            mt: 2,
                        }}
                    />
                    <Button variant="contained"
                        sx={{
                            backgroundColor: "black",
                            color: "white",
                            "&:hover": { backgroundColor: "#333" },
                            mt: 2,
                            width: "100%",
                        }} onClick={handleSend}>
                        {loader ? <Loader className="animate-spin" /> : " Send Offer"}
                    </Button>
                    <Button variant="outlined"
                        onClick={handleDealClose}
                        sx={{
                            borderColor: "black",
                            color: "black",
                            backgroundColor: "white",
                            "&:hover": { backgroundColor: "black", color: "white" },
                            mt: 2,
                            width: "100%",
                        }}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div >
    );
}

export default BuynowButton;

// ✅ Styling objects for better readability
const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    borderRadius: "12px",
    textAlign: "center",
};

const modalStyleDark = { ...modalStyle, bgcolor: "#1E1E1E", color: "white" };
const textFieldStyle = { mb: 2, bgcolor: "white", borderRadius: "5px" };
const buttonOutlineStyle = {
    borderRadius: "20px",
    padding: "10px 20px",
    fontWeight: "bold",
    borderColor: "black",
    color: "black",
    "&:hover": { bgcolor: "white", color: "black" },
};
const buttonBuyStyle = {
    borderRadius: "20px",
    padding: "10px 20px",
    fontWeight: "bold",
    bgcolor: "#00c853",
    "&:hover": { bgcolor: "#009624" },
};
const buttonSendStyle = {
    borderRadius: "20px",
    padding: "10px 20px",
    fontWeight: "bold",
    bgcolor: "#00c853",
    "&:hover": { bgcolor: "#009624" },
};
const buttonCloseStyle = {
    borderRadius: "20px",
    padding: "10px 20px",
    fontWeight: "bold",
    mt: 2,
    color: "red",
    borderColor: "red",
    "&:hover": { bgcolor: "red", color: "white" },
};
