"use client";

import { getAllLikesServices } from "@/Services/like.services";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa"; 

export default function LikeButton({ postId, commentId, userId }) {
    const [liked, setLiked] = useState(null); 
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const data= await getAllLikesServices(postId, commentId, userId)
                setLiked(data.liked);
            } catch (error) {
                console.error("Error fetching like status:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLikeStatus();
    }, [userId, postId, commentId]);

    const handleLike = async () => {
        try {
            const response = await fetch("/api/user/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    auctionId: postId || null,
                    commentId: commentId || null,
                    status: !liked,  
                }),
            });

            const data = await response.json();
            if (data.success) {
                setLiked(data.liked);
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    if (loading) return <p><Loader className="animate-spin" /></p>;

    return (
        <button onClick={handleLike} className="like-btn">
            {liked ? <FaThumbsUp color='black' /> : <FaRegThumbsUp color='black' />}
        </button>
    );
}
