export const addCommentsServices = async (obj) => {
    try {
        const response = await fetch("/api/user/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

export const getAllCommentsDataservies=async(data)=>{
    try {
        const response = await fetch(`/api/user/comments?auctionId=${parseInt(data.id)}`);
        const result = await response.json();
        return result
    } catch (error) {
        throw error;
    }
}