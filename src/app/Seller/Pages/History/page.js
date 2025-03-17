"use client";
import React from "react";
import { useSelector } from "react-redux";

function TransactionHistory() {
  const user = useSelector((data) => data.CarUser.userDetails);

  // Dummy transaction data
  const transactions = [
    {
      id: "TXN12345",
      date: "2024-03-10",
      amount: 150.0,
      status: "Completed",
      buyer: "John Doe",
      seller: "Car Store Ltd",
    },
    {
      id: "TXN67890",
      date: "2024-03-08",
      amount: 250.0,
      status: "Pending",
      buyer: "Alice Smith",
      seller: "Auto Traders",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {user.type === "seller" ? "Transaction History" : "Purchase History"}
      </h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr className="text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6">Transaction ID</th>
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6">Amount ($)</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">
                {user.type === "seller" ? "Buyer" : "Seller"}
              </th>
              <th className="py-3 px-6">Receipt</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {transactions.map((txn, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="py-3 px-6">{txn.id}</td>
                <td className="py-3 px-6">{txn.date}</td>
                <td className="py-3 px-6">${txn.amount.toFixed(2)}</td>
                <td
                  className={`py-3 px-6 font-medium ${
                    txn.status === "Completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {txn.status}
                </td>
                <td className="py-3 px-6">
                  {user.type === "seller" ? txn.buyer : txn.seller}
                </td>
                <td className="py-3 px-6">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionHistory;
