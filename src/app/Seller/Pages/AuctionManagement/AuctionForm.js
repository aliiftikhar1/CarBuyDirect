"use client"

import { useState } from "react"
import { createAuction } from "./actions"

export default function AuctionForm({ carSubmissions }) {
  const [formData, setFormData] = useState({
    carSubmissionId: "",
    startDate: "",
    endDate: "",
    location: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createAuction(formData)
    // Reset form or show success message
    setFormData({
      carSubmissionId: "",
      startDate: "",
      endDate: "",
      location: "",
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Create New Auction</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="carSubmissionId" className="block text-sm font-medium text-gray-700">
            Car Submission
          </label>
          <select
            id="carSubmissionId"
            name="carSubmissionId"
            value={formData.carSubmissionId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select a car submission</option>
            {carSubmissions.map((submission) => (
              <option key={submission.id} value={submission.id}>
                {submission.vehicleMake} {submission.vehicleModel} ({submission.vehicleYear}) - {submission.User.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create Auction
      </button>
    </form>
  )
}

