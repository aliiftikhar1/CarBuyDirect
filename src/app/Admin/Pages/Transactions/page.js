"use client"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

function TransactionHistory() {
  const user = useSelector((data) => data.CarUser.userDetails)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchTransactions() {
    try {
      // Include user ID in the request to filter transactions
      const response = await fetch(`/api/admin/transactions/1`)

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError(err.message)
      return []
    }
  }

  useEffect(() => {
    let isMounted = true

    const getTransactions = async () => {
      setLoading(true)
      try {
        const data = await fetchTransactions()
        console.log("transaction data :", data)
        if (isMounted) {
          setTransactions(data.data || [])
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

    getTransactions()

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
      <h2 className="text-2xl font-semibold mb-4">
        {user.type === "seller" ? "Transaction History" : "Purchase History"}
      </h2>

      {transactions.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No transactions found.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr className="text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">No.</th>
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-6">Details</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Receipt</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {transactions.slice().reverse().map((txn,id) => (
                <tr key={txn.id} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="py-3 px-6">{id+1}</td>
                  <th className="py-3 px-6">{txn.user.name}</th>
                  <td className="py-3 px-6">{txn.order_id}</td>
                  <td className="py-3 px-6">{formatDate(txn.createdAt)}</td>
                  <td className="py-3 px-6">
                    {txn.currency} {txn.amount.toFixed(2)}
                  </td>
                  <td
                    className={`py-3 px-6 font-medium ${
                      txn.status === "completed"
                        ? "text-green-600"
                        : txn.status === "failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                  </td>
                  <td className="py-3 px-6 capitalize">{txn.type}</td>
                  <td className="py-3 px-6">
                    {txn.receipts && txn.receipts.length > 0 ? (
                      <a
                        href={txn.receipts[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400">Not available</span>
                    )}
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

export default TransactionHistory

