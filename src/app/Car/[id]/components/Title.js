import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TimerComponent from "./CountDownTimer";
import { Share, Star, CheckCircle, Info, Loader } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import BidRegistrationForm from "./BidRegisterationDialog";
import { useSelector } from "react-redux";

export default function Title({ data }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bidAmount, setBidAmount] = useState(data?.CarSubmission?.price + 100); // Default bid value
  const [bids, setBids] = useState(data?.CarSubmission?.bids || 0); // Total bids
  const [currentBid, setCurrentBid] = useState(data?.CarSubmission?.price || 0); // Current bid
  const userid = useSelector((state) => state.CarUser.userDetails?.id);
  const [loading, setLoading] = useState(false);
  const [handler,setHandler] = useState(false);
 
  useEffect(() => {
    if (userid) {

      const fetchUserDetails = async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/user/getUserDetails/${userid}`);
          const result = await response.json();
          setUser(result.user);
          setLoading(false)
        } catch (error) {
          setLoading(false)
          console.error("Error fetching user details:", error);
        }
        
      };

      fetchUserDetails();
    }
  }, [userid,handler]);

  const isEligible = user?.cardName && user?.cardNumber && user?.cardExpiry && user?.cardCvc;

  const handlePlaceBid = () => {
    if (!user) {
      alert("Please login to place a bid.");
    } else if (!isEligible) {
      setIsDialogOpen(true);
    } else {
      setIsBidDialogOpen(true);
    }
  };

  const confirmBid = () => {
    if (bidAmount < currentBid + 100) {
      alert(`Bid amount must be at least $${currentBid + 100}.`);
      return;
    }
    setCurrentBid(bidAmount);
    setBids(bids + 1);
    alert("Bid placed successfully!");
    setIsBidDialogOpen(false);
  };

  return (
    <div className="w-full px-20">
      <div className="border-b pb-4">
        <div className="flex justify-start gap-8 items-center">
          <h1 className="text-4xl tracking-tight font-[200]">
            {data?.CarSubmission?.vehicleYear}{" "}
            <span className="font-bold">{data?.CarSubmission?.vehicleMake}</span>{" "}
            {data?.CarSubmission?.vehicleModel}
          </h1>
          <div className="border-l-4 bg-gray-100/50 px-2 py-1 border-gray-400 flex justify-center items-center h-10">
            <h2 className="text-xl">Reserve Lowered</h2>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-between items-center p-4">
        <div className="grid grid-cols-4 w-2/3">
          <div className="text-3xl font-bold text-center">
            US${currentBid}
          </div>
          <div className="text-center">
            <TimerComponent
              className="text-2xl font-extrabold"
              endDate={"2025-06-06"}
            />
          </div>
          <div className="text-center flex gap-2 justify-center items-center">
            <span className="font-bold">5</span> Comments
          </div>
          <div className="text-center gap-2 flex justify-center items-center">
            <span className="font-bold">{bids}</span> Bids
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="w-[10rem] h-[3rem] rounded-none flex items-center justify-center text-lg bg-transparent border border-gray-300 hover:bg-gray-100"
          >
            <Star className="mr-2" /> Watch
          </Button>
          <Button
            variant="ghost"
            className="w-[10rem] h-[3rem] rounded-none flex items-center justify-center text-lg bg-transparent border border-gray-300 hover:bg-gray-100"
          >
            <Share className="mr-2" /> Share
          </Button>
          <Button
            variant="solid"
            className="w-[10rem] h-[3rem] rounded-none flex items-center justify-center text-lg text-white bg-yellow-600 hover:bg-yellow-700"
            onClick={handlePlaceBid}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader className="animate-spin" size={20} />
                Loading...
              </span>
            ) : (
              "Place A Bid"
            )}
          </Button>

        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <BidRegistrationForm setHandler={setHandler} setIsDialogOpen={setIsDialogOpen}/>
        </DialogContent>
      </Dialog>

      <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
        <DialogContent className="max-w-4xl">
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">Place Your Bid</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Current Bid</p>
                <p className="text-2xl font-bold">${currentBid}</p>
                <p className="text-sm text-gray-500">{bids} bids</p>
              </div>
              <div>
                <p className="text-gray-600">
                  Your Bid (Minimum: ${currentBid + 100})
                </p>
                <input
                  type="number"
                  className="w-32 p-2 border border-gray-300 rounded"
                  value={bidAmount}
                  min={currentBid + 100}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                className="px-6 py-2 text-lg bg-red-600 text-white hover:bg-red-700 rounded"
                onClick={confirmBid}
              >
                Confirm Bid
              </Button>
              <Button
                variant="ghost"
                className="px-6 py-2 text-lg border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setIsBidDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
