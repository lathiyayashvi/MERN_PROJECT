import React, { useContext, useEffect, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { useUserAuth } from "../../hooks/useUserAuth";

const EditProfile = () => {
  useUserAuth();
  const { user, updateUser } = useContext(UserContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setProfilePic(user.profileImageUrl);
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", fullName);

    if (profilePic && typeof profilePic !== "string") {
      formData.append("image", profilePic);
    }
    else if(typeof profilePic === "string"){
      formData.append("profileImageUrl", profilePic);
    }

    try {
      const res = await axiosInstance.put(API_PATHS.AUTH.EDIT_PROFILE, formData);
      updateUser(res.data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill all password fields");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      const formData = new FormData();
      formData.append("fullName", fullName); // optional, but keeps payload consistent
      if (profilePic && typeof profilePic !== "string") {
        formData.append("image", profilePic);
      }
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);

      const res = await axiosInstance.put(API_PATHS.AUTH.EDIT_PROFILE, formData);
      updateUser(res.data.user);
      toast.success("Password updated successfully");

      setChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      toast.error(err?.response?.data?.message || "Password update failed");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full flex flex-col justify-center items-start p-6">
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black">Edit Profile</h2>
          <p className="text-sm text-slate-600 mt-1">
            You can update your name, photo, and optionally change your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="w-full space-y-4">
          <div className="flex justify-center">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />
            <Input
              value={email}
              disabled
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />
          </div>

          {/* Password Section Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="changePassword"
              checked={changePassword}
              onChange={(e) => setChangePassword(e.target.checked)}
              className="w-4 h-4"
            />
            <label
              htmlFor="changePassword"
              className="text-sm font-medium text-slate-700"
            >
              Do you want to change your password?
            </label>
          </div>

          {changePassword && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <Input
                  value={currentPassword}
                  onChange={({ target }) => setCurrentPassword(target.value)}
                  label="Current Password"
                  placeholder="Enter current password"
                  type="password"
                />
                <Input
                  value={newPassword}
                  onChange={({ target }) => setNewPassword(target.value)}
                  label="New Password"
                  placeholder="Min 8 characters"
                  type="password"
                />
                <div className="md:col-span-2">
                  <Input
                    value={confirmPassword}
                    onChange={({ target }) => setConfirmPassword(target.value)}
                    label="Confirm New Password"
                    placeholder="Repeat new password"
                    type="password"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="bg-primary text-white text-sm px-4 py-1.5 rounded-md shadow-sm hover:bg-primary/90 transition"
                >
                  Change Password
                </button>
              </div>
            </>
          )}

          <button type="submit" className="btn-primary mt-4">
            Update Profile
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default EditProfile;
