export default function AuctionSidebar() {
    return (
        <div className="w-full h-full flex flex-col gap-4">
            {Array(8)
                .fill()
                .map((_, index) => (
                    <div
                        key={index}
                        className="bg-gray-400 flex justify-center items-center h-[60vh]"
                    >
                        {`Auction Item ${index + 1}`}
                    </div>
                ))}
        </div>
    );
}
