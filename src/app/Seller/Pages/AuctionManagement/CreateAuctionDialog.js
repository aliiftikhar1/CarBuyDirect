"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { createAuction } from "./actions";

export default function CreateAuctionDialog({ carSubmissions, fetchData }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    carSubmissionId: "",
    startDate: "",
    endDate: "",
    location: "",
    status: "",
    featured:"",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { carSubmissionId, startDate, endDate, location, status,featured } = formData;
    if (!carSubmissionId || !startDate || !endDate || !location || !status || !featured) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const result = await createAuction(formData);
      if (result.success) {
        setError("");
        setFormData({ carSubmissionId: "", startDate: "", endDate: "", location: "", status: "", featured: "" });
        setOpen(false);
        fetchData(); // Refresh data after successful submission
      } else {
        setError(result.error || "Failed to create auction.");
      }
    } catch (err) {
      console.error("Error creating auction:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log("Form Data:", formData);
  // }, [formData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Auction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Auction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <Label htmlFor="carSubmissionId">Car Submission</Label>
            <select
              id="carSubmissionId"
              name="carSubmissionId"
              value={formData.carSubmissionId}
              onChange={(e) => setFormData((prev) => ({ ...prev, carSubmissionId: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" disabled>
                Select a car submission
              </option>
              {carSubmissions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.vehicleYear} {item.vehicleMake} {item.vehicleModel} - {item.firstname} ({item.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Coming-Soon">Coming Soon</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Live">Live</option>
              <option value="Ended">Ended</option>
            </select>
          </div>
          <div>
            <Label htmlFor="status">Featured</Label>
            <select
              id="status"
              name="featured"
              value={formData.featured}
              onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" disabled>
                Select
              </option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Auction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
