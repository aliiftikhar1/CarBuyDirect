'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function MyListingsSection() {
  const [activeTab, setActiveTab] = useState('active')
  const [listings] = useState([]) // Empty array to simulate no listings
  const userid = useSelector((state) => state.CarUser?.userDetails?.id);
  const [userDetails, setUserDetails]=useState('')
  async function getListing(){
    const data = await fetch(`/api/user/getUserDetails/${userid}`)
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
        My <span className="text-[#B08968]">Listings</span>
      </h2>
      <p className="text-muted-foreground mb-8">Here you will see all your listings</p>
      
      <div className="border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('active')}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors relative",
              activeTab === 'active' 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Active listings
            {activeTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors relative",
              activeTab === 'archived' 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Archived listings
            {activeTab === 'archived' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        </div>
      </div>

      <div className="py-10">
        {userDetails?.Submissions?.length === 0 ? (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">No listings found</h3>
            <p className="text-muted-foreground">
              You have no {activeTab} listings.
            </p>
            <Button 
              variant="secondary" 
              className="mt-4 bg-muted/60 hover:bg-muted"
            >
              Get started, sell now
            </Button>
          </div>
        ) : (
        
          <div className="grid grid-cols-1 gap-6 ">
            {userDetails?.Submissions?.map((listing) => (
            
              <div className="capitalize text-md grid grid-cols-2  " key={listing.id}>
                <div className="w-full h-full">
                  <img className="w-auto h-auto rounded-sm" src={listing?.SubmissionImages?.find((item)=>item.label==='horizontal')?.data}></img>
                  </div>
                  <div className="px-4 flex flex-col">
               
                  <div>{listing?.vehicleYear}</div> <div className="font-bold"> {listing?.vehicleMake}</div> <div>{listing?.vehicleModel}</div> <div> Status: <div className="font-bold">{listing?.status}</div></div>
                    </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

