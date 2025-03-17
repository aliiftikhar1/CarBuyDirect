'use client';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails, uploadfiletoserver } from "../Actions";
import { toast } from "sonner";

export default function MyProfileSection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [bio, setBio] = useState(null);
  const fileInputRef = useRef(null);
  const data = useSelector((state) => state.CarUser.userDetails);
const dispatch = useDispatch()
  useEffect(() => {
    if (data?.bio) {
      setBio(data.bio);
    }
  }, [data]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // const handleImageChange = (event) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setSelectedImage(imageUrl);
  //   }
  // };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await uploadfiletoserver(file)
        setSelectedImage(result); 
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  

    const formData = {
      id: data.id||'',
      bio: bio || "",
      image: selectedImage || "", // If needed, you can upload the image to a server or convert it to a base64 string
    };
  
    try {
      const updatedData = await updateUserDetails(formData,dispatch); // Ensure `updateUserDetails` expects JSON data
      if(updatedData.status==true){
      console.log("Profile updated successfully:", updatedData);
      toast.success("Profile updated successfully!");}
      else{
        toast.error(updatedData.message||"Failed to update profile");
      }

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };
  

  return (
    <div className="w-full mx-auto">
      <h2 className="text-3xl font-semibold mb-2">
        My <span className="text-[#B08968]">Profile</span>
      </h2>
      <p className="text-muted-foreground mb-4">Manage your profile from here</p>

      <div className="border p-4 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <div className="space-y-3">
              <h3 className="font-medium">Profile Image</h3>
              <div
                onClick={handleImageClick}
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 min-h-[250px] bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors relative overflow-hidden"
              >
                {data?.image || selectedImage ? (
                  <Image
                    src={ selectedImage ||data?.image || "/placeholder.svg"}
                    alt="Profile"
                    accept=' image/*'
                    fill
                    className="object-cover"
                  />
                ) : (
                  <>
                    <User className="w-16 h-16 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload profile picture
                    </p>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Public username</h3>
                <Input
                  placeholder="Not set"
                  disabled
                  value={data?.username || "Not Set"}
                  className="max-w-md"
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Bio</h3>
                <Textarea
                  placeholder="What do you want other users to know about? What cars do you like etc."
                  className="min-h-[150px]"
                  onChange={(e) => setBio(e.target.value)}
                  value={bio || ""}
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button type="submit" variant="secondary" className="bg-muted/60 hover:bg-muted">
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
