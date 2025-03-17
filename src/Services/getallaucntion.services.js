export const getAllAuctionDataService = async () => {
    try {
        const response = await fetch(`/api/user/FetchAuctions/all/1`)
        const data = await response.json();
        return data
    } catch (error) {
        throw error
    }
}