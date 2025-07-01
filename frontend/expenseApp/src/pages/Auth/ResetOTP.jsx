import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';

const ResetOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);

  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.SEND_RESET_OTP, {
        email,
      });

      toast.success(response.data.message || "OTP sent to your email.");
      setIsOTPSent(true);
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.SEND_RESET_PASSWORD, {
        email,
        OTP: otp,
        newPassword,
      });

      toast.success(res.data.message || "Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Reset failed");
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Forgot Your Password?</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          {isOTPSent
            ? "Please enter the OTP and your new password below."
            : "Don't worry! It happens. Enter your email and we'll send you an OTP to reset your password."}
        </p>

        {isOTPSent ? (
          <form onSubmit={handleResetPassword}>
            <Input
              value={otp}
              onChange={({ target }) => setOtp(target.value)}
              label="Enter OTP"
              placeholder="6-digit OTP"
              type="text"
            />
            <Input
              value={newPassword}
              onChange={({ target }) => setNewPassword(target.value)}
              label="New Password"
              placeholder="Enter your new password"
              type="password"
            />
            <button type="submit" className="btn-primary">
              Reset Password
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendOTP}>
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetOTP;
