"use client";
import { useState } from "react";

export default function BidModal({  onClose, onConfirm, loading }) {

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
                <h2 className="text-xl font-semibold mb-4">Confirm Your Bid</h2>
                <p className="text-gray-600">To place this bid, $500 will be held from your account.</p>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-700 text-gray-700 rounded-md hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-4 py-2 rounded-md text-white transition ${
                            loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                        }`}
                    >
                        {loading ? "Processing..." : "Accept & Hold $500"}
                    </button>
                </div>
            </div>
        </div>
    );
}
