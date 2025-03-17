import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function Settings() {
  const userId = useSelector((data)=>data.CarUser?.userDetails?.id)
  const [notifications, setNotifications] = useState(false);

  // Fetch the current notification status when the component mounts
  useEffect(() => {
    const fetchNotificationStatus = async () => {
      try {
        const response = await fetch(`/api/settings/notifications/${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("data is : ",data)
          setNotifications(data.data.getEmails); // Assuming API returns { getEmails: true/false }
        }
      } catch (error) {
        console.error("Error fetching notification status:", error);
      }
    };

    fetchNotificationStatus();
  }, []);

  const handleToggle = async () => {
    const newStatus = !notifications;
    setNotifications(newStatus); // Optimistic UI update

    try {
      const response = await fetch(`/api/settings/notifications/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ getEmails: newStatus }),
      });
      if(newStatus){
        toast.success("Email notification enabled!")
    }
    else{
        toast.success("Email notification disabled!")
    }

      if (!response.ok) {
        throw new Error("Failed to update setting");
        
      }
    } catch (error) {
      console.error("Error updating notification setting:", error);
      setNotifications(!newStatus); 
    }
  };

  return (
    <div className=" bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>

      <div className="space-y-4">
        {/* Notification Toggle */}
        <div className="flex justify-between items-center">
          <span className="text-lg">Enable Email Notifications</span>
          <button
            onClick={handleToggle}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              notifications ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                notifications ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
