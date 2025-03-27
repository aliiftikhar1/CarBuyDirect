import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { CheckCircle, InfoOutlined } from "@mui/icons-material";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BidRegistrationForm from "../Auction/[id]/components/BidRegisterationDialog";

function BuynowButton({ data }) {
    const [open, setOpen] = useState(false);
    const [dealOpen, setDealOpen] = useState(false);
    const [price, setPrice] = useState("");
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const user = useSelector((state) => state.CarUser.userDetails);
    const isEligible = user?.cardName;

    const handleBuyBtn = () => {
        if (!user) {
            alert("Please login to place a bid.");
        } else if (!isEligible) {
            setIsDialogOpen(true);
        } else {
            setOpen(true);
        }
    };

    const handleMakeDealBtn = () => {
        if (!user) {
            alert("Please login to place a bid.");
        } else if (!isEligible) {
            setIsDialogOpen(true);
        } else {
            setDealOpen(true);
        }
    };

    const handleSend = async () => {
        setLoader(true);
        const payload = {
            price,
            message,
            auctionId: data.id,
            receiverId: data.sellerId,
            senderId: user.id,
            receiverEmail: data.CarSubmission.email,
            userName: user.name || user.email,
            vehicleYear: data.CarSubmission.vehicleYear,
            vehicleModel: data.CarSubmission.vehicleModel,
            userType: "buyer",
            originalprice: data.CarSubmission.buyPrice,
            regarding: "buy-now",
        };
        try {
            const response = await fetch("/api/user/BuyNow/deal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success("✅ Your deal has been successfully submitted!");
                setDealOpen(false);
                setPrice("");
                setMessage("");
            }
        } catch (error) {
            console.error("Error sending notification:", error);
        } finally {
            setLoader(false);
        }
    };

    const handleBuy = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/user/BuyNow/deal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    price: data.CarSubmission.buyPrice,
                    message: `Buyer wants to purchase your car at Buy price (${data.CarSubmission.buyPrice})`,
                    auctionId: data.id,
                    receiverId: data.sellerId,
                    senderId: user.id,
                    receiverEmail: data.CarSubmission.email,
                    userName: user.name || user.email,
                    vehicleYear: data.CarSubmission.vehicleYear,
                    vehicleModel: data.CarSubmission.vehicleModel,
                    userType: "buyer",
                    originalprice: data.CarSubmission.buyPrice,
                    regarding: "buy-now",
                }),
            });

            if (response.ok) {
                toast.success("✅ Your deal has been successfully submitted!");
                setOpen(false);
            }
        } catch (error) {
            console.error("Error sending notification:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-row-reverse w-full justify-between gap-2">
            <button
                className="px-4 py-2 w-full bg-black text-white rounded-full hover:bg-gray-800 transition"
                onClick={handleBuyBtn}
            >
                Buy Now
            </button>
            <button
                className="px-4 py-2 w-full bg-purple-500 text-white rounded-full hover:bg-purple-600 transition"
                onClick={handleMakeDealBtn}
            >
                Make Deal
            </button>

            {/* Registration Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <BidRegistrationForm setIsDialogOpen={setIsDialogOpen} />
                </DialogContent>
            </Dialog>

            {/* Buy Now Modal */}
            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                        <CheckCircle className="text-green-500 text-5xl mx-auto" />
                        <h2 className="text-xl font-semibold mt-2">Confirm Your Purchase</h2>
                        <p className="text-gray-600 text-sm mt-1">Secure this deal now before the price changes! 🚗💨</p>
                        <p className="text-lg font-bold text-black mt-2">
                            Actual Price: <span className="text-green-600">${data?.CarSubmission?.buyPrice}</span>
                        </p>
                        <p className="text-gray-500 text-xs mt-1">Price locked for the next <strong>15 minutes</strong>. Make your move!</p>

                        <div className="flex gap-2 justify-center mt-4">
                            <button
                                className="px-4 py-2 border border-black text-black rounded-lg hover:bg-black hover:text-white transition"
                                onClick={handleMakeDealBtn}
                            >
                                Make a Deal
                            </button>
                            <button
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                                onClick={handleBuy}
                            >
                                {loading ? <Loader className="animate-spin" /> : "Buy Now"}
                            </button>
                        </div>
                        <div className="flex items-center justify-center text-gray-500 text-xs mt-3">
                            <InfoOutlined className="text-lg mr-1" />
                            <p>By proceeding, you agree to our <strong>Terms & Conditions</strong>.</p>
                        </div>
                        <button
                            className="mt-4 w-full px-4 py-2 border border-black text-black rounded-lg hover:bg-black hover:text-white transition"
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Make Deal Modal */}
            {dealOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-semibold">Make a Deal</h2>
                        <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-3 text-black"
                            type="text"
                            placeholder="Your Price Offer"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-3 text-black"
                            rows="3"
                            placeholder="Your Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            className="w-full bg-black text-white px-4 py-2 rounded-lg mt-3 hover:bg-gray-800 transition"
                            onClick={handleSend}
                        >
                            {loader ? <Loader className="animate-spin" /> : "Send Offer"}
                        </button>
                        <button
                            className="w-full border border-black text-black px-4 py-2 rounded-lg mt-2 hover:bg-black hover:text-white transition"
                            onClick={() => setDealOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuynowButton;
