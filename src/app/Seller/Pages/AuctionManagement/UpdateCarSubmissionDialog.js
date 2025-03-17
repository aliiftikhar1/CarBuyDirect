"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Pencil } from 'lucide-react';
import { updateAuction } from "./actions";

export default function UpdateCarSubmissionDialog({ auction, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: auction.id,
    carSubmissionId: auction.carId,
    startDate: auction.startDate,
    endDate: auction.endDate,
    location: auction.location,
    status: auction.status,
    featured:auction.featured,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { carSubmissionId, startDate, endDate, location, status, featured } = formData;
    if (!carSubmissionId || !startDate || !endDate || !location || !status || !featured) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const result = await updateAuction(formData);
      if (result.success) {
        setError("");
        setOpen(false);
        onUpdate(result.data);
      } else {
        setError(result.error || "Failed to update auction.");
      }
    } catch (err) {
      console.error("Error updating auction:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log("Form Data:", formData);
  // }, [formData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // This ensures the format is yyyy-MM-ddThh:mm
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit auction</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Auction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <Label htmlFor="carSubmissionId">Car Submission</Label>
            <Input
              type="text"
              id="carSubmissionId"
              name="carSubmissionId"
              value={formData.carSubmissionId}
              onChange={(e) => setFormData((prev) => ({ ...prev, carSubmissionId: e.target.value }))}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formatDate(formData.startDate)}
              onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formatDate(formData.endDate)}
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
              id="featured"
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
            {loading ? "Updating..." : "Update Auction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
