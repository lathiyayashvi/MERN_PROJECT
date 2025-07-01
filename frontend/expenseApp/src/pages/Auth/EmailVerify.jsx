import React, { useEffect, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);

  const navigate = useNavigate();

  // Send OTP when component mounts
  useEffect(() => {
    handleSendOTP();
  }, []);

  const handleSendOTP = async () => {
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.VERIFY_EMAIL_OTP_SEND);
      toast.success(res.data.message || "OTP sent to your email");
      setResendDisabled(true);

      // Disable resend for 60 seconds
      setTimeout(() => setResendDisabled(false), 60000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.VERIFY_ACCOUNT, { OTP: otp });
      //console.log(res.data.message);
      toast.success(res.data.message || "Email verified successfully");
      navigate("/dashboard");
    } catch (err) {
      //console.log(err?.response?.data?.message);
      toast.error(err?.response?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Verify Your Email Address</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter the 6-digit OTP sent to your registered email to verify your account.
        </p>

        <form onSubmit={handleVerify}>
          <Input
            value={otp}
            onChange={({ target }) => setOtp(target.value)}
            label="OTP"
            placeholder="Enter OTP"
            type="text"
          />

          <button type="submit" className="btn-primary">
            Verify OTP
          </button>
        </form>

        <button
          onClick={handleSendOTP}
          className="mt-3 text-sm underline text-primary"
          disabled={resendDisabled}
        >
          {resendDisabled ? "Resend OTP in 60s" : "Resend OTP"}
        </button>
      </div>
    </AuthLayout>
  );
};

export default EmailVerify;
