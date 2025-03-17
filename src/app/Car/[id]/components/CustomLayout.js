import AuctionSidebar from "./AuctionSidebar";

export default function CustomLayout({children}){
    return(
        <div className="w-full px-20 flex gap-4 py-10">
            <div className="w-3/4">
            {children}
            </div>
            <div className="w-1/4">
            <AuctionSidebar/>
            </div>

        </div>

    )
}