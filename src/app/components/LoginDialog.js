"use client"
import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { Bell, Heart, Loader, User } from 'lucide-react'
import { RegistrationDialog } from "./RegisterationDialog"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { clearUserDetails, setUserDetails } from "@/store/UserSlice"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@radix-ui/react-label"
import { toast } from "sonner"
import { set } from "jodit/esm/core/helpers"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@mui/material"
import { Skeleton } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { getAllUsersServices } from "@/Services/getallusers.services"
import Image from "next/image"
export function AuthDialogs() {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [isRegister, setIsRegister] = useState(false)
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const user = useSelector((data) => data.CarUser.userDetails) || []
  const userId = useSelector((data) => data.CarUser.userDetails?.id)
  const [watching, setWatching] = useState([])
  const [loadingAction, setLoadingAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notificationsData, setNotificationsData] = useState([])
  const [allUsersData, setAllUsersData] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();
  if (!user) {
    setOpen(true)
  }
  const dispatch = useDispatch()

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(clearUserDetails())
    setDropdownOpen(false)
    console.log("Logged out"); // Replace with your logout logic
  };
  const toggleAuth = () => {
    setIsLogin(!isLogin)
  }

  function handleRegisterDialog() {
    setIsRegister(true)
    setIsLogin(false)
    setOpen2(true)
  }

  async function handleEmailCheck() {
    try {
      setLoadingAction('checkEmail')
      const response = await fetch(`/api/checkEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
      })
      const data = await response.json()
      if (data.status === 200) {
        console.log('email is already registered')
        toast.error(data.message)
      }
      if (data.status === 201) {
        console.log('email is not registered')
        handleRegisterDialog()
      }
      setLoadingAction(null)
    } catch (error) {
      setLoadingAction(null)
      console.log("error checking email")
    }
  }
  async function handleLogin() {
    try {
      setLoadingAction("login")
      const response = await fetch(`/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password })
      })
      const data = await response.json()
      if (data.status === 200) {
        toast.success("User Logged In Successfully")
        // Dispatching the action to set user details
        dispatch(setUserDetails(data.user));
        setOpen(false)
        setOpen2(false)
      }
      else{
        toast.error(data.message)
      }
      setLoadingAction(null)

    } catch (error) {
      setLoadingAction(null)
      toast.error("Error logging in", error.message)
      console.log("error loggin in")
    }
  }

  async function fetchWatching() {
    const response = await fetch(`/api/user/watch/${userId}`)
    const data = await response.json()
    setWatching(data.data)
  }

  useEffect(() => {
    fetchWatching()
    fetchNotifications()
  }, [userId])

  async function fetchNotifications() {
    setLoading(true)
    try {
      const response = await fetch("/api/user/notifications"); // ✅ API Route Call
      const userData = await getAllUsersServices();
      setAllUsersData(userData.data)
      const data = await response.json();
      let filteredData
      if (user.type === 'seller') {
        filteredData = data.notifications.filter((data) => (data.receiverId === userId && (data.type === 'buyer' || data.type === 'customer')));
      }
      else (
        filteredData = data.notifications.filter((data) => (data.senderId === userId && data.type === 'seller'))
      )
      // const filteredData1 = data.notifications.filter((data) => (data.senderId === userId));
      setNotificationsData(filteredData)
      setLoading(false)
      if (data.success) {
        // setNotifications(data.notifications);
      } else {
        setLoading(false)
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching notifications:", error.message);
    } finally {
      setLoading(false)
      // setLoading(false);
    }
  }
  const [nLoading, setNLoading] = useState(true);

  useEffect(() => {
    if (notificationsData.length > 0) {
      setTimeout(() => setNLoading(false), 1000); // Simulate loading effect
    } else {
      setNLoading(false);
    }
  }, [notificationsData])

  const handleClick = async (notification, closeSheet) => {
    // If notification is already read, directly navigate to the page
    if (notification.isRead) {
      // Close the sheet first
      closeSheet();
      router.push(`/Notifications/${notification.id}`);
      return;
    }
  
    try {
      // Mark the notification as read
      const response = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: notification.id }),
      });
  
      // Update local state to mark as read
      setNotificationsData((prev) => 
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
  
      // Close the sheet first
      closeSheet();
  
      // Redirect to the single notification page
      router.push(`/Notifications/${notification.id}`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Optionally, show an error toast
      toast.error("Failed to mark notification as read");
    }
  }

  return (

    <Dialog open={open} onOpenChange={setOpen} className="p-4">
      <div className="relative">
        {user.id ? (
          <div className="flex gap-4 justify-center items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Badge
                  badgeContent={notificationsData?.filter(notification => !notification.isRead).length || 0}
                  color="primary"
                >
                  <Bell className="cursor-pointer hover:fill-black" />
                </Badge>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-start">Notifications</SheetTitle>
                </SheetHeader>
                <ScrollArea className=" mt-6">
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {nLoading ? (
                      [...Array(5)].map((_, index) => (
                        <ListItem key={index} alignItems="flex-start">
                          <ListItemAvatar>
                            <Skeleton variant="circular" width={40} height={40} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={<Skeleton variant="text" width={200} />}
                            secondary={<Skeleton variant="text" width={250} />}
                          />
                        </ListItem>
                      ))
                    ) : notificationsData.length > 0 ? (
                      notificationsData.slice().reverse().map((notification) => {
                        const matchedUser = allUsersData.find(user => user.id === notification.senderId);

                        return (
                          <div key={notification.id}>
                            <ListItem
                              alignItems="flex-start"
                              sx={{
                                backgroundColor: notification.isRead ? "transparent" : "#e3f2fd", // ✅ Unread ke liye light blue background
                                borderRadius: "8px",
                                padding: "10px",
                                transition: "background-color 0.3s",
                                "&:hover": { backgroundColor: "#bbdefb" }, // ✅ Hover effect
                              }}
                              onClick={() => { 
                                handleClick(notification, () => {
                                  // This assumes you're using a ref or state to control the sheet
                                  document.querySelector('[data-state="open"]')?.click();
                                }) 
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar alt={matchedUser?.name || "User"} src={matchedUser?.profileImage || "/default-avatar.png"} />
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{
                                      display: "block",
                                      fontSize: "1rem",
                                      color: "text.primary",
                                      fontWeight: notification.isRead ? "normal" : "bold", // ✅ Unread ke liye bold text
                                    }}
                                  >
                                    {notification.type === 'seller' ? "Seller" + " " + notification.receiver.name : "Buyer" + " " + notification.sender.name}
                                  </Typography>

                                }

                                secondary={
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{
                                      fontWeight: notification.isRead ? "normal" : "bold", // ✅ Unread ke liye bold message
                                    }}
                                  >
                                    {notification.message}
                                  </Typography>
                                }
                              />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                          </div>
                        );
                      })
                    ) : (
                      // ✅ No Notification Message
                      <Typography sx={{ textAlign: "center", padding: "20px", color: "gray" }}>
                        📭 No new notifications
                      </Typography>
                    )}
                  </List>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Heart className="cursor-pointer hover:fill-black" />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Watching</SheetTitle>
                  <SheetDescription>Here are the auctions you're currently watching.</SheetDescription>
                </SheetHeader>
                <ScrollArea className=" mt-6">
                  {(watching && watching.length > 0) ? (
                    watching.map((item) => (
                      <Card key={item.id} className="mb-4 hover:scale-[1.02] border" onClick={()=>window.location.href=`/Auction/${item.Auction.CarSubmission.webSlug}`}>
                        <CardContent className="p-4 flex">
                          <img
                            src={item.Auction.CarSubmission.SubmissionImages[0].data || "/placeholder.svg"}
                            alt={`${item.Auction.CarSubmission.vehicleMake} ${item.Auction.CarSubmission.vehicleModel}`}
                            className="w-24 h-full object-cover mr-4 rounded"
                          />
                          <div>
                            <h3 className="font-bold">
                              {item.Auction.CarSubmission.vehicleYear} {item.Auction.CarSubmission.vehicleMake} {item.Auction.CarSubmission.vehicleModel}
                            </h3>
                            {/* <p className="text-sm text-gray-500">{item.Auction.CarSubmission.vehicleYear}</p> */}
                            <p className="text-xs mt-1">
                              Status:<br></br> <span className="text-sm font-semibold">{item.Auction.status}</span>
                            </p>
                            <p className="text-xs mt-1">
                              Location: <br></br> <span className="text-sm font-semibold">{item.Auction.location}</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">You're not watching any auctions yet.</p>
                  )}
                </ScrollArea>
              </SheetContent>
            </Sheet>
            {user.image?
            <div
            ref={dropdownRef}
            className="cursor-pointer flex overflow-hidden items-center text-black-500 justify-center size-12 rounded-full  font-extrabold text-2xl bg-gray-200/70"
             onClick={toggleDropdown}>
             <Image 
             src={user.image}
             width={800}
             height={800}
           >
           </Image>
           </div>
           :
           <div ref={dropdownRef}
           className="cursor-pointer flex items-center text-black-500 justify-center size-12 rounded-full  font-extrabold text-2xl bg-gray-200/70"
           onClick={toggleDropdown}
         >
           {`${user?.name || ""}`.toUpperCase().slice(0, 1) || "?"}
         </div>
           }
            {/* <div ref={dropdownRef}
              className="cursor-pointer flex items-center text-black-500 justify-center size-12 rounded-full  font-extrabold text-2xl bg-gray-200/70"
              onClick={toggleDropdown}
            >
              {`${user?.name || ""}`.toUpperCase().slice(0, 1) || "?"}
            </div> */}
          </div>
        ) : (
          <DialogTrigger asChild>
            <button className="text-black hover:text-black/90">
              <p className="hidden md:flex">{isLogin ? "Sign In" : "Sign Up"}</p>
              <User className="flex md:hidden" />
            </button>
          </DialogTrigger>
        )}

        {/* Dropdown */}
        {dropdownOpen && user && (
          <div className="absolute right-0 mt-2 space-y-4 text-sm w-48 bg-white shadow-lg  overflow-hidden z-10">
            {user?.type === "seller" && (
              <a href="/Seller" className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100">
                Seller Panel
              </a>
            )}
            <a
              href="/my-profile"
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
            // onClick={() => console.log("Profile clicked")}
            >
              Profile
            </a>

            <a
              href="/my-listings"
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
            // onClick={() => console.log("Profile clicked")}
            >
              Listing
            </a>
            <a
              href="my-settings"
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
            // onClick={() => console.log("Profile clicked")}
            >
              Settings
            </a>
            <button
              className="block w-full px-4 py-2 text-left text-black bg-red-300/50 hover:bg-gray-100"
              onClick={handleLogout}
            >
              SignOut
            </button>
          </div>
        )}
      </div>


      {isLogin ? (
        <DialogContent className="max-w-xs md:max-w-sm p-4">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Log In</DialogTitle>
            <DialogDescription className="text-center">
              Please Log in to watch, bid, comment or sell
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              id="email"
              placeholder="Email"
              type="email"
              onChange={(e) => setemail(e.target.value)}
              className="col-span-3 px-4 py-6"
            />
            <div className="relative">
              <Input
                id="password"
                placeholder="Password"
                type="password"
                onChange={(e) => setpassword(e.target.value)}
                className="col-span-3 px-4 py-6"
              />
              <Button
                variant="link"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-sm"

              >
                Forgot?
              </Button>
            </div>
            <Button
              className="w-full bg-[#B69C66] hover:bg-[#B69C66]/90 px-4 py-6"
              onClick={handleLogin}
            >
              {loadingAction === 'login' ? <Loader className="animate-spin" /> : <>LOG IN</>}
              {/* LOG IN */}
            </Button>
            <div className="text-center text-sm">
              {"Don't have an account? "}
              <Button variant="link" className="p-0" onClick={toggleAuth}>
                Sign up here
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full px-4 py-6" onClick={() => signIn("google", { callbackUrl: "/", userType: "customer" })}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full px-4 py-6" onClick={() => { }}>
              <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
              </svg>
              Continue with Facebook
            </Button>
          </div>
        </DialogContent>
      ) : (
        // Sign Up Dialog Content
        <DialogContent className="max-w-xs md:max-w-sm p-4">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Sign Up</DialogTitle>
            <DialogDescription className="text-center">
              Already have an account?{" "}
              <Button variant="link" className="p-0" onClick={toggleAuth}>
                Log in here
              </Button>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Button variant="outline" className="w-full px-4 py-6" onClick={() => { }}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full px-4 py-6" onClick={() => { }}>
              <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
              </svg>
              Continue with Facebook
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>
            <Input
              id="signup-email"
              placeholder="Email"
              type="email"
              className="col-span-3 px-4 py-6"
              onChange={(e) => setemail(e.target.value)}
            />
            <Button onClick={handleEmailCheck} className="w-full bg-black hover:bg-black/90 text-white px-4 py-6">
              {loadingAction === 'checkEmail' ? <Loader className="animate-spin" /> : <>CREATE ACCOUNT</>}
              {/* CREATE ACCOUNT */}
            </Button>
          </div>
        </DialogContent>
      )}
      {open2 && (
        <RegistrationDialog
          open={open2}
          onClose={() => setOpen2(false)}
          email={email}
        />
      )}
    </Dialog>
  )
}

