import { formatDate } from "@/lib/utils"

export default function AuctionList({ auctions }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Existing Auctions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Car</th>
              <th className="py-3 px-6 text-left">Seller</th>
              <th className="py-3 px-6 text-left">Start Date</th>
              <th className="py-3 px-6 text-left">End Date</th>
              <th className="py-3 px-6 text-left">Location</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {auctions.map((auction) => (
              <tr key={auction.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {auction.CarSubmission.vehicleMake} {auction.CarSubmission.vehicleModel} (
                  {auction.CarSubmission.vehicleYear})
                </td>
                <td className="py-3 px-6 text-left">{auction.CarSubmission.User.name}</td>
                <td className="py-3 px-6 text-left">{formatDate(auction.startDate)}</td>
                <td className="py-3 px-6 text-left">{formatDate(auction.endDate)}</td>
                <td className="py-3 px-6 text-left">{auction.location}</td>
                <td className="py-3 px-6 text-left">{auction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

