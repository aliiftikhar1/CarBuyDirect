"use client"
import { addCommentsServices, getAllCommentsDataservies } from '@/Services/comments.services';
import { getAllUsersServices } from '@/Services/getallusers.services';
import { Loader } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { formatDistanceToNow } from "date-fns";
import LikeButton from './LikeButton';
import CommentSkeleton from '@/app/components/CommentSkeleton';

function Comments({ data }) {
    const [commentValue, setCommentValue] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const [comments, seComments] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const user = useSelector((data) => data.CarUser.userDetails);
    const [loading, setLoading] = useState(false);
    const fetchComments = useCallback(async () => {
        setLoading(true)
        try {
            const result = await getAllCommentsDataservies(data);
            const allUserData = await getAllUsersServices();
            setUsersData(Array.isArray(allUserData.data) ? allUserData.data : []);
            if (result.success) {
                setLoading(false)
                seComments(result.comments)
            } else {
                setLoading(false)
                alert("Failed to load comments!");
            }
        } catch (error) {
            setLoading(false)
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        fetchComments()
    }, [fetchComments])
    const handleComment = async () => {
        setBtnLoading(true)
        if (!commentValue.trim()) {
            setBtnLoading(false)
            toast.error("Comment cannot be empty!")
            return;
        }
        try {
            const obj = {
                text: commentValue,
                auctionId: data.id,
                userId: user.id
            };
            const result = await addCommentsServices(obj)
            if (result.success) {
                setBtnLoading(false)
                toast.success("Comment added successfully!")
                setCommentValue("");
                fetchComments()
            } else {
                setBtnLoading(false)
                toast.error("Failed to add comment. Please try again.")
            }
        } catch (error) {
            setBtnLoading(false)
            console.error("Error submitting comment:", error.message);
            toast.error("Something went wrong!")
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h4 className="text-lg font-semibold mb-4">Comments</h4>
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <h6 className="font-semibold mb-2">Add a Comment</h6>
                <textarea
                    className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring focus:border-blue-400"
                    rows="3"
                    value={commentValue}
                    placeholder="Write your comment..."
                    onChange={(e) => { setCommentValue(e.target.value) }}
                    onKeyDown={(e) => { setCommentValue(e.target.value) }}
                ></textarea>
                <button
                    onClick={handleComment}
                    className="mt-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                >
                    {btnLoading ? <Loader className="animate-spin" /> : "Comment"}
                </button>
            </div>

            <div className="bg-white p-4 mb-3">
                {
                    loading ?  Array(3).fill(0).map((_, index) => <CommentSkeleton key={index} />) : (
                        comments && comments.length > 0 ? (
                            comments?.map((comment) => {
                                const user = usersData.find((data) => data.id === comment.userId);
                                return (
                                    <div key={comment.id} className="flex items-start mb-4">
                                        <img
                                            src={comment?.User?.image || '/bydeault.jpg'}
                                            alt="User"
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <h6 className="font-semibold">{comment.User.name || "Unknown User"}</h6>
                                            <p className="text-sm text-gray-500">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
                                            <p className="mt-2 text-gray-700">{comment.text}</p>
                                            <div className="flex items-center mt-2 space-x-4">
                                                <LikeButton postId={data?.id} commentId={comment?.id} userId={user?.id} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500">No comments found</p>
                        )
                    )
                }
            </div>
        </div>
    );
}

export default Comments;
