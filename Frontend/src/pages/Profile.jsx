import { useState, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { Camera, Save, User } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

function Profile() {
  const { user, updateUser } = useAuthStore();
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosInstance.put("/auth/profile", {
        profileImage,
      });
      
      updateUser(res.data.user, res.data.token);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-text-primary mb-6">My Profile</h2>
      
      <div className="relative">
        
        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-bg-card flex items-center justify-center">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User size={48} className="text-text-secondary" />
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-3 bg-brand-500 text-white rounded-full shadow-lg hover:bg-brand-600 transition-colors"
                >
                  <Camera size={18} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                />
              </div>
              <p className="text-sm text-text-secondary">Allowed: JPG, PNG, WEBP (Max 2MB)</p>
            </div>

            {/* Profile Details Form */}
            <div className="flex-1 w-full space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Role</label>
                <div className="px-4 py-3 bg-bg-card border border-border-dark rounded-xl text-text-primary shadow-sm">
                  {user?.role}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                <div className="px-4 py-3 bg-bg-card border border-border-dark rounded-xl text-text-primary shadow-sm">
                  {user?.name || "N/A"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                <div className="px-4 py-3 bg-bg-card border border-border-dark rounded-xl text-text-primary shadow-sm">
                  {user?.email || "N/A"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                <div className="px-4 py-3 bg-bg-card border border-border-dark rounded-xl text-text-primary shadow-sm">
                  {user?.phone || "N/A"}
                </div>
              </div>



              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-400 text-white rounded-xl font-medium shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {isLoading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
