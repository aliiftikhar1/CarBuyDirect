"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { toast } from "react-toastify" // or your preferred toast library
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Clock, MessageSquare, X, Reply } from "lucide-react"
import { getAllUsersServices } from "@/Services/getallusers.services"
import { getAllAuctionDataService } from "@/Services/getallaucntion.services"
import Payment from "../components/Payment"
import DealDonePayment from "../components/DealDonePayment"

export default function Notifications() {
    const { id } = useParams()
    const router = useRouter()
    const [allNotifications, setAllNotifications] = useState([])
    const [mainNotifications, setMainNotifications] = useState([])
    const [replyNotifications, setReplyNotifications] = useState([])
    const [selectedNotification, setSelectedNotification] = useState(null)
    const [loading, setLoading] = useState(false)
    const [allUsersData, setAllUsersData] = useState([])
    const [replyDialogOpen, setReplyDialogOpen] = useState(false)
    const [replyMessage, setReplyMessage] = useState("")
    const [replyPrice, setReplyPrice] = useState("")
    const [auctionData, setAuctionData] = useState([])

    // Get logged in user ID from Redux store
    const userdetails = useSelector((data) => data.CarUser.userDetails)
    const userId = useSelector((data) => data.CarUser.userDetails?.id)

    useEffect(() => {
        if (userId) {
            fetchNotifications()
            fetchAllData()
        }
    }, [userId, id])

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/user/notifications")
            const data = await res.json()

            if (!data.notifications) {
                setAllNotifications([])
                setMainNotifications([])
                return
            }

            // Filter notifications for the current user
            const userNotifications = data.notifications.filter(
                (notif) => notif.senderId === userId || notif.receiverId === userId,
            )

            const filterSelectedNotifications = data.notifications.find(
                (notif) => notif.id == id,
            )
            if (filterSelectedNotifications.replyOf !== null) {

                const ReplyOfFilteredSelectedNotifications = data.notifications.find(
                    (notif) => notif.id === filterSelectedNotifications.replyOf,
                )
                setSelectedNotification(ReplyOfFilteredSelectedNotifications)
                markAsRead(filterSelectedNotifications.id, filterSelectedNotifications)
                filterReplyNotifications(ReplyOfFilteredSelectedNotifications.id, userNotifications)
                console.log("ReplyOfFilteredNotifications", ReplyOfFilteredSelectedNotifications)
                //do filteration properly
            }
            else {
                filterReplyNotifications(filterSelectedNotifications.id, userNotifications)
                setSelectedNotification(filterSelectedNotifications)
                markAsRead(filterSelectedNotifications.id, filterSelectedNotifications)
            }
            console.log("Filter notification is : ", filterSelectedNotifications)


            setAllNotifications(userNotifications)


            // Filter main notifications (those with replyOf === null)
            const mainNotifs = userNotifications.filter((notif) => notif.replyOf === null)
            setMainNotifications(mainNotifs)



        } catch (error) {
            console.error("Error fetching notifications:", error)
            toast.error("Failed to load notifications")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log("Selected Notification", selectedNotification)
        console.log("Filtered Reply Notifications", replyNotifications)
    }, [selectedNotification, replyNotifications])

    const fetchAllData = async () => {
        try {
            // Fetch users and auction data in parallel
            const [usersResponse, auctionResponse] = await Promise.all([getAllUsersServices(), getAllAuctionDataService()])

            setAllUsersData(usersResponse.data)

            if (auctionResponse.data) {
                setAuctionData(auctionResponse.data)
            }
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("Failed to load user or auction data")
        }
    }

    const filterReplyNotifications = (notificationId, notifications = allNotifications) => {
        const replies = notifications.filter((notif) => notif.replyOf === notificationId)
        console.log("Replies are : ", replies)
        setReplyNotifications(replies)
    }

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification)
        markAsRead(notification.id, notification)
        filterReplyNotifications(notification.id)
    }

    const markAsRead = async (notificationId, notification) => {
        if (notification.isRead) return

        try {
            await fetch("/api/user/notifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId }),
            })

            // Update local state
            setAllNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))

            setMainNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
        } catch (error) {
            console.error("Error marking notification as read:", error)
        }
    }

    const handleReply = async () => {
        if (!selectedNotification || !replyMessage) {
            toast.error("Please enter a message")
            return
        }
        let Finalpayload
        replyNotifications.length > 0 ? Finalpayload = {
            price: replyPrice || selectedNotification.price,
            message: replyMessage,
            auctionId: selectedNotification.auctionId,
            receiverId: selectedNotification.receiverId,
            senderId: selectedNotification.senderId,
            userType: userdetails.type,
            userName: selectedNotification?.sender?.name,
            receiverEmail: selectedNotification?.sender?.email,
            replyOf: selectedNotification.id,
            vehicleYear: selectedNotification?.auction?.vehicleYear,
            vehicleModel: selectedNotification?.auction?.vehicleModel,
        } : Finalpayload = {
            price: replyPrice || selectedNotification.price,
            message: replyMessage,
            auctionId: selectedNotification.auctionId,
            receiverId: selectedNotification.receiverId,
            senderId: selectedNotification.senderId,
            userType: userdetails.type,
            userName: selectedNotification?.sender?.name,
            receiverEmail: selectedNotification?.sender?.email,
            replyOf: selectedNotification.id,
            vehicleYear: selectedNotification?.auction?.vehicleYear,
            vehicleModel: selectedNotification?.auction?.vehicleModel,
        }


        try {
            const response = await fetch("/api/user/notifications/deal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Finalpayload),
            })

            if (response.ok) {
                toast.success("Reply sent successfully")
                setReplyDialogOpen(false)
                setReplyMessage("")
                setReplyPrice("")
                fetchNotifications() // Refresh notifications
            } else {
                toast.error("Failed to send reply")
            }
        } catch (error) {
            console.error("Error sending reply:", error)
            toast.error("Failed to send reply")
        }
    }

    const handleDealDone = async (senderId) => {
        if (!selectedNotification?.auctionId) {
            toast.error("Auction information is missing")
            return
        }

        // const buyerName = selectedNotification?.sender?.name || "Unknown"

        const payload = {
            price: replyNotifications.length > 0 ? replyNotifications[replyNotifications.length - 1].price : selectedNotification.price,
            auctionId: selectedNotification.auctionId,
            userId: selectedNotification.senderId,
            sellerId: selectedNotification.receiverId,
            userType: userdetails.type,
            receiverEmail: selectedNotification?.sender?.email,
            replyOf: selectedNotification.id,
            userName: selectedNotification?.sender?.name,
            holdPayments: selectedNotification.auction?.HoldPayments,
        }

        try {
            const latestBid = selectedNotification.auction?.Bids[selectedNotification.auction?.Bids.length - 1]
            // const response = await fetch("/api/user/endAuction/postUpdation", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({
            //       auction: selectedNotification.auction,
            //        latestBid: latestBid,
            //         notificationId: selectedNotification.id
            //     }),
            //   })
        
            //   const data = await response.json()
            const response = await fetch("/api/user/dealdone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                toast.success("Deal completed successfully!")
                setSelectedNotification(null)
                fetchNotifications() // Refresh notifications
            } else {
                toast.error("Failed to complete deal")
            }
        } catch (error) {
            console.error("Error completing deal:", error)
            toast.error("Failed to complete deal")
        }
    }

    const handleDealDecline = async (senderId) => {
        if (!selectedNotification?.auctionId) {
            toast.error("Auction information is missing")
            return
        }

        const buyerName = allUsersData.find((user) => user.id === senderId)?.name || "Unknown"

        const payload = {
            price: replyNotifications.length > 0 ? replyNotifications[replyNotifications.length - 1].price : selectedNotification.price,
            auctionId: selectedNotification.auctionId,
            userId: selectedNotification.senderId,
            sellerId: selectedNotification.receiverId,
            userType: userdetails.type,
            replyOf: selectedNotification.id,
            buyerName,
        }

        console.log("Payload", payload)
        try {
            const response = await fetch("/api/user/notifications/decline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                toast.success("Deal completed successfully!")
                setSelectedNotification(null)
                fetchNotifications() // Refresh notifications
            } else {
                toast.error("Failed to complete deal")
            }
        } catch (error) {
            console.error("Error completing deal:", error)
            toast.error("Failed to complete deal")
        }
    }

    const getSenderName = (senderId) => {
        return allUsersData.find((user) => user.id === senderId)?.name || "Unknown User"
    }

    const getAuctionTitle = (auctionId) => {
        if (!auctionId) return "Unknown Auction"
        return auctionData.find((auction) => auction.id === auctionId)?.title || "Auction Item"
    }

    const formatDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Notifications List (replyOf === null) */}
                <div className="md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell className="h-5 w-5" />
                        <h2 className="text-2xl font-bold">Notifications</h2>
                    </div>

                    <div className="bg-card rounded-lg shadow-sm">
                        {loading ? (
                            <div className="p-4 space-y-4">
                                {[1, 2, 3].map((_, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : mainNotifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <p>No notifications found</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {mainNotifications.reverse().map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 cursor-pointer transition-colors hover:bg-accent/50 ${selectedNotification?.id === notification.id
                                            ? "bg-accent/30"
                                            : !notification.isRead
                                                ? "bg-accent/20"
                                                : ""
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-medium">
                                                        {notification.type === 'seller' ? notification.receiver?.name : notification.sender?.name}
                                                    </p>
                                                    {!notification.isRead && (
                                                        <Badge variant="default" className="text-xs">
                                                            New
                                                        </Badge>
                                                    )}
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{notification.message}</p>

                                                {notification.price && (
                                                    <p className="text-sm font-medium text-green-600 mt-1">${notification.price}</p>
                                                )}

                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {getAuctionTitle(notification.auctionId)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Selected Notification and Replies */}
                <div className="md:col-span-2">
                    <div className="sticky top-32">
                        {!selectedNotification ? (
                            <div
                                className="flex items-center justify-center bg-card rounded-lg shadow-sm p-8"
                                style={{ minHeight: "400px" }}
                            >
                                <div className="text-center text-muted-foreground">
                                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg font-medium mb-2">No notification selected</h3>
                                    <p>Select a notification from the list to view details</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* Selected Notification */}
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold">
                                                    Message from {selectedNotification.type === 'seller' ? selectedNotification.receiver?.name : selectedNotification.sender?.name}
                                                </h3>
                                                <p className="text-muted-foreground text-sm">
                                                    Regarding: {selectedNotification.auction?.CarSubmission?.vehicleYear + " " + selectedNotification.auction?.CarSubmission?.vehicleMake + " " + selectedNotification.auction?.CarSubmission?.vehicleModel || "Unknown Auction"}
                                                </p>
                                                <p className="text-muted-foreground text-sm">
                                                    Buy Price: {selectedNotification.regarding !== "buynow" ? selectedNotification.auction?.CarSubmission?.reservedPrice : selectedNotification.auction?.CarSubmission?.buyPrice || "Unknown Price"}
                                                </p>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => setSelectedNotification(null)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <Separator className="my-0" />

                                        <div className="bg-accent/20 rounded-lg p-2 mb-2">
                                            <p className="text-lg">{selectedNotification.message}</p>
                                        </div>

                                        {selectedNotification.price && (
                                            <div className="flex items-center gap-2 ">
                                                <p className="text-lg font-medium">Offered Price:</p>
                                                <p className="text-xl font-bold text-green-600">${selectedNotification.price}</p>
                                            </div>
                                        )}

                                        {selectedNotification.type === "done" ? (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle className="h-5 w-5" />
                                                <p>This deal has been completed</p>
                                            </div>
                                        ) : (
                                            <>
                                                {(replyNotifications.length < 1) && ((selectedNotification.type === "seller" && userdetails.type === "seller") || (selectedNotification.type === "buyer" && userdetails.type === "customer")) ? (
                                                    <div className="flex gap-2 text-amber-500">
                                                        <Clock className="h-5 w-5" />
                                                        <p>Waiting for {selectedNotification.type === 'buyer' ? "Seller" : "Buyer"}'s reply</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {(replyNotifications.length < 1 && (selectedNotification.regarding === "reserve-met"||selectedNotification.regarding === "without-reserve")) && <>
                                                            <Payment auction={selectedNotification.auction} notificationId={selectedNotification.id}/>
                                                        </>}

                                                        {(replyNotifications.length < 1 && (selectedNotification.regarding !== "reserve-not-met" && selectedNotification.regarding !== "without-reserve" && selectedNotification.regarding !== "reserve-met")) &&
                                                            <div className="flex flex-col sm:flex-row gap-3 mt-8">

                                                                <Button onClick={() => setReplyDialogOpen(true)} className="flex-1">
                                                                    <Reply className="mr-2 h-4 w-4" />
                                                                    Reply
                                                                </Button>

                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => handleDealDone(selectedNotification.senderId)}
                                                                    className="flex-1"
                                                                >
                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                    Complete Deal
                                                                </Button>

                                                                <Button
                                                                    variant="destructive"
                                                                    onClick={() => setSelectedNotification(null)}
                                                                    className="flex-1"
                                                                >
                                                                    <X className="mr-2 h-4 w-4" />
                                                                    Decline
                                                                </Button>
                                                            </div>
                                                        }
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Reply Notifications Section */}
                                {replyNotifications.length > 0 && (
                                    <div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <Reply className="h-5 w-5" />
                                            <h3 className="text-lg font-semibold">Replies</h3>
                                        </div>

                                        <div className="space-y-4">
                                            {replyNotifications.filter((item) => (item.message !== 'decline' && item.message !== 'done')).map((reply) => (
                                                <Card key={reply.id} className={`${reply.type === 'seller' ? 'border-l-primary' : 'border-l-blue-500'} border-l-4 `}>
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback>{reply.type === 'seller' ? reply.receiver?.name.charAt(0) : reply.sender?.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <p className="font-medium">{reply.type === 'seller' ? reply.receiver?.name : reply.sender?.name}</p>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</span>
                                                        </div>

                                                        <p className="mt-2">{reply.message}</p>

                                                        {reply.price && (
                                                            <div className="mt-2 flex items-center gap-2">
                                                                <p className="text-sm font-medium">Price:</p>
                                                                <p className="text-sm font-bold text-green-600">${reply.price}</p>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}

                                            {replyNotifications.length > 0 ?
                                                <>
                                                    {replyNotifications[replyNotifications.length - 1].message !== 'decline' && <>
                                                        <div className="flex items-center gap-2 mb-6">
                                                            <p className="text-lg font-medium">Offered Price:</p>
                                                            <p className="text-xl font-bold text-green-600">${replyNotifications[replyNotifications.length - 1].price}</p>
                                                        </div>
                                                    </>}
                                                    {replyNotifications[replyNotifications.length - 1]?.type === "done" ? (
                                                        <div className="flex items-center gap-2 text-green-600">
                                                            <CheckCircle className="h-5 w-5" />
                                                            <p>This deal has been completed</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {replyNotifications[replyNotifications.length - 1].message === 'decline' ? <><p className="py-2 text-center text-xl rounded px-4 bg-red-500 text-white">Your Offer has been declined!!</p></> : <>
                                                                {replyNotifications[replyNotifications.length - 1].message === 'done' ? <>
                                                                {replyNotifications[replyNotifications.length - 1].regarding === 'payment-pending'? 
                                                                <DealDonePayment amount={replyNotifications[replyNotifications.length - 1].price} auction={selectedNotification.auction} notificationId={selectedNotification.id}/> : <>
                                                                <p className="py-2 text-center text-xl rounded px-4 bg-green-500 text-white">Deal is done!!</p>
                                                                </>}
                                                                </> : <>
                                                                    {(replyNotifications[replyNotifications.length - 1]?.type === "seller" && userdetails.type === "seller") || (replyNotifications[replyNotifications.length - 1]?.type === "customer" && userdetails.type === "customer") ? (
                                                                        <div className="flex gap-2 text-amber-500">
                                                                            <Clock className="h-5 w-5" />
                                                                            <p>Waiting for {replyNotifications[replyNotifications.length - 1]?.type === 'customer' ? "Seller" : "Buyer"}'s reply</p>
                                                                        </div>
                                                                    ) : (
                                                                        <>

                                                                            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                                                                                {replyNotifications.length > 2 ?
                                                                                    <></>
                                                                                    : <Button onClick={() => setReplyDialogOpen(true)} className="flex-1">
                                                                                        <Reply className="mr-2 h-4 w-4" />
                                                                                        Reply
                                                                                    </Button>}


                                                                                <Button
                                                                                    variant="outline"
                                                                                    onClick={() => handleDealDone(replyNotifications[replyNotifications.length - 1]?.senderId)}
                                                                                    className="flex-1"
                                                                                >
                                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                                    Complete Deal
                                                                                </Button>

                                                                                <Button
                                                                                    variant="destructive"
                                                                                    // onClick={() => setSelectedNotification(null)}
                                                                                    className="flex-1"
                                                                                    onClick={() => handleDealDecline(replyNotifications[replyNotifications.length - 1]?.senderId)}

                                                                                >
                                                                                    <X className="mr-2 h-4 w-4" />
                                                                                    Decline
                                                                                </Button>
                                                                            </div>

                                                                        </>
                                                                    )}
                                                                </>
                                                                }
                                                            </>}
                                                        </>
                                                    )}
                                                </> :
                                                <>
                                                    {selectedNotification.price && (
                                                        <div className="flex items-center gap-2 mb-6">
                                                            <p className="text-lg font-medium">Offered Price:</p>
                                                            <p className="text-xl font-bold text-green-600">${selectedNotification.price}</p>
                                                        </div>
                                                    )}
                                                </>

                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reply Dialog */}
            <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Reply to {selectedNotification ? getSenderName(selectedNotification.senderId) : ""}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">
                                Message
                            </label>
                            <Textarea
                                id="message"
                                placeholder="Type your reply message here..."
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price" className="text-sm font-medium">
                                Price ($)
                            </label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="Enter your price"
                                value={replyPrice}
                                onChange={(e) => setReplyPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleReply}>Send Reply</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

