import { useState } from "react";
import { Camera, User, Mail, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdateProfile } = useAuthStore();
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [profilePic, setProfilePic] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setProfilePic(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateName = async () => {
    if (!fullName.trim()) return;
    if (fullName === authUser?.fullName) return;
    await updateProfile({ fullName });
  };

  const displayPic = profilePic || authUser?.profilePic;

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="size-32 rounded-full border-4 overflow-hidden bg-base-200 flex items-center justify-center">
                {displayPic ? (
                  <img
                    src={displayPic}
                    alt="Profile"
                    className="size-32 object-cover"
                  />
                ) : (
                  <User className="size-16 text-base-content/50" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdateProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdateProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdateProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered w-full px-4 py-2.5 bg-base-200 rounded-lg border"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <button
                  className="btn btn-primary btn-sm self-center"
                  onClick={handleUpdateName}
                  disabled={isUpdateProfile || fullName === authUser?.fullName}
                >
                  {isUpdateProfile ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <input
                type="email"
                className="input input-bordered w-full px-4 py-2.5 bg-base-200 rounded-lg border"
                value={authUser?.email || ""}
                readOnly
              />
            </div>
          </div>

          {/* Account Info */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                  {authUser?.createdAt
                    ? new Date(authUser.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
