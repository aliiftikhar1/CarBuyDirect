'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function MyPurchaseHistory() {
  const [activeTab, setActiveTab] = useState('active')
  const [listings] = useState([]) // Empty array to simulate no listings
  const userid = useSelector((state) => state.CarUser?.userDetails?.id);
  const [userDetails, setUserDetails]=useState('')
  async function getListing(){
    const data = await fetch(`/api/user/getUserDetails/sold/${userid}`)
    const response = await data.json()
    console.log("Response is :",response.user)
    
    setUserDetails(response.user)
  }
  useEffect(()=>{
     getListing()
  },[1])
  useEffect(()=>{
    if(userDetails){
      console.log("user details are",userDetails)
    }
  })
 
  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-2">
        My <span className="text-[#B08968]">Purchase History</span>
      </h2>
      <p className="text-muted-foreground mb-8">Here you will see all your purchases</p>
      

      <div className="py-10">
        {userDetails?.Sold?.length == 0 ? (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">No purchases found</h3>
            <p className="text-muted-foreground">
              You have no {activeTab} purchases.
            </p>
            <Button 
              variant="secondary" 
              className="mt-4 bg-muted/60 hover:bg-muted"
            >
              Get started, purchase now
            </Button>
          </div>
        ) : (
        
          <div className="grid grid-cols-1 gap-6 ">
            {userDetails?.Sold?.map((listing) => (
            
              <div className="capitalize text-md grid grid-cols-2  " key={listing.id}>
                <div className="w-full h-full">
                  <img className="w-auto h-auto rounded-sm" src={listing?.Auction?.CarSubmission?.SubmissionImages?.find((item)=>item.label==='horizontal')?.data}></img>
                  </div>
                  <div className="px-4 flex flex-col">
               
                  <div>{listing?.Auction?.CarSubmission?.vehicleYear}</div> <div className="font-bold"> {listing?.Auction?.CarSubmission?.vehicleMake}</div> <div>{listing?.Auction?.CarSubmission?.vehicleModel}</div> <div> Status: <div className="font-bold">{listing?.Auction?.CarSubmission?.status}</div></div>
                    </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

