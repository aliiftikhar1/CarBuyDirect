export const getAllLikesServices = async (postId, commentId, userId) => {
    try {
        const response = await fetch(`/api/user/like?userId=${userId}&auctionId=${postId || ""}&commentId=${commentId || ""}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('error', error.message)
        throw error;
    }
}