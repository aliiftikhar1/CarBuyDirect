export const getAllUsersServices=async()=>{
    try {
      const allUsers = await fetch("/api/user/getAllUsersData"); // ✅ API Route Call
      const data = await allUsers.json(); 
      return data
    } catch (error) {
        throw error;
    }
}