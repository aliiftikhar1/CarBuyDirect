import { clearUserDetails, setUserDetails } from "@/store/UserSlice"
import { useDispatch } from "react-redux"


export async function getUserDetails(id,dispatch){
    // const dipatch = useDispatch()
    const response = await fetch(`api/user/getUserDetails/${id}`)
    const data = await response.json()
    console.log("data fetched is : ",data.user)
    dispatch(setUserDetails(data.user))
    return data.user
  }
  export async function getUserBids(id){
    const response = await fetch(`api/user/mybid/${id}`)
    const data = await response.json()
    console.log("data fetched is : ",data.data)
    return data.data
  }
 
  export async function updateUserDetails(formData,dispatch) {
    console.log("Formdata is ",formData)
    try {
      const response = await fetch(`/api/user/updateUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log('data fetched is:', data);
  
      if(data.status==true){
        dispatch(setUserDetails(data.user));
      }
      if(data.status==false){
        dispatch(clearUserDetails())
      }
     
      return data;
    } catch (error) {
      console.error('Error updating user details:', error);
      throw error;
    }
  }
  

  export async function uploadfiletoserver (file){
    try {
      if (!file) throw new Error('No file selected for upload');
      const formData = new FormData();
      formData.append('myFile', file);
  
      const response = await fetch('https://www.getcarbuydirect.com/uploadImage.php', {
        // https://file-upload-server-chi.vercel.app/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Image upload failed: ${errorData.error.message}`);
      }
  
      const data = await response.json();
      console.log("Data is", data);
      return data.file; // Uploaded image URL
    } catch (error) {
      console.error('Error during image upload:', error);
      throw error;
    }
  };