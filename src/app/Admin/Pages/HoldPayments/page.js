"use client"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

function HoldPaymentHistory() {
  const user = useSelector((data) => data.CarUser.userDetails)
  const [holdPayments, setHoldPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchHoldPayments() {
    try {
      const response = await fetch(`/api/admin/holdPayments/1`)

      if (!response.ok) {
        throw new Error(`Failed to fetch hold payments: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error("Error fetching hold payments:", err)
      setError(err.message)
      return { success: false, data: [] }
    }
  }

  useEffect(() => {
    let isMounted = true

    const getHoldPayments = async () => {
      setLoading(true)
      try {
        const data = await fetchHoldPayments()
        console.log("hold payments data:", data)
        if (isMounted && data.success) {
          setHoldPayments(data.data || [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getHoldPayments()

    return () => {
      isMounted = false
    }
  }, [user.id])

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return <div className="w-full h-screen flex justify-center items-center"><Loader className="animate-spin" /></div>
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Hold Payments History</h2>

      {holdPayments.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No hold payments found.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr className="text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">No.</th>
                <th className="py-3 px-6">Payment ID</th>
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-6">Vehicle</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {holdPayments.map((payment, index) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6">{payment.paymentIntentId}</td>
                  <td className="py-3 px-6">
                    {payment.user ? `${payment.user.name}` : "N/A"}
                  </td>
                  <td className="py-3 px-6">
                    {payment.auction?.CarSubmission
                      ? `${payment.auction.CarSubmission.vehicleMake} ${payment.auction.CarSubmission.vehicleModel} (${payment.auction.CarSubmission.vehicleYear})`
                      : "N/A"}
                  </td>
                  <td className="py-3 px-6">{formatDate(payment.createdAt)}</td>
                  <td
                    className={`py-3 px-6 font-medium ${
                      payment.status === "succeeded" || payment.status === "completed"
                        ? "text-green-600"
                        : payment.status === "failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default HoldPaymentHistory

