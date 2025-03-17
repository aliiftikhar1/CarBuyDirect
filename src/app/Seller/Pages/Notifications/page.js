"use client";

import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";


function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };
  for (let key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval >= 1) {
      return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const userId = useSelector((data) => data.CarUser.userDetails?.id);

  async function fetchNotifications() {
    try {
      const response = await fetch("/api/user/notifications");
      const data = await response.json();
      const filteredData = data.notifications.filter((data) => data.receiverId === userId)
      setNotifications(data.notifications);
      console.log(filteredData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch("/api/user/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });

      setNotifications((prev) =>
        prev.map((noti) =>
          noti.id === id ? { ...noti, isRead: true } : noti
        )
      );
    } catch (error) {
      console.error("ERROR FROM NOTIFICATION", error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:w-full w-full mx-auto p-2 bg-white border rounded-lg dark:bg-gray-800 h-[600px]">
      <div className={`w-full md:max-w-[25rem] p-4 border-r ${selectedNotification ? 'hidden md:block' : ''}`}>
        <div className="flex items-center justify-between border-b pb-2 mb-2">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Notifications</h2>
          <Bell className="text-gray-500 dark:text-gray-400" />
        </div>
        <div className="space-y-2" style={{ overflow: "auto", scrollbarWidth: "none", height: "90%" }}>
          {notifications.length > 0 ? (
            notifications.map((noti) => (
              <div
                key={noti.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer 
                ${noti.isRead ? "bg-gray-100 dark:bg-gray-700" : "bg-blue-100 dark:bg-blue-700"}`}
                onClick={() => {
                  markAsRead(noti.id);
                  setSelectedNotification(noti);
                }}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{noti.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">{timeAgo(noti.createdAt)}</p>
                </div>
                {noti.isRead ? <CheckCircle className="text-green-500" size={18} /> : null}
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">No new notifications</p>
          )}
        </div>
      </div>

      {selectedNotification && (
        <div className="w-full p-4 ">
          <button
            className="mb-2 flex items-center text-gray-600 dark:text-gray-300 md:hidden"
            onClick={() => setSelectedNotification(null)}
          >
            <ChevronLeft size={20} /> Back
          </button>
          <span className="text-xl font-bold">Message:</span> 
          <h3 className="text-lg text-gray-800 dark:text-gray-200">"{selectedNotification.message}"</h3>
          <span className="text-xl font-bold">Price:</span>
          <h3 className="text-lg indent-4 text-gray-800 dark:text-gray-200">{selectedNotification.price}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{timeAgo(selectedNotification.createdAt)}</p>
          {/* <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">{selectedNotification.details}</p>
          </div> */}
          <div className="w-full flex justify-end">
            <div className="flex gap-4">
            <Button className="bg-blue-500 text-white">
              Send Counter Offer
             </Button>
            <Button variant="destructive">
              Reject
             </Button>
             <Button >
              Accept
             </Button>

            </div>

        </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
