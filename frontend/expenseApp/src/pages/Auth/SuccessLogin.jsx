import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AuthLayout from "../../components/layouts/AuthLayout";

const SuccessLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("access_token");

      if (!token) {
        return navigate("/login");
      }

      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO, {
          withCredentials: true,
        });

        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard", {replace: true});
      } catch (error) {
        console.error("Error fetching user", error);
        navigate("/login", {replace: true});
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow">
          <div className="flex justify-center mb-4">
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-black mb-2">
            Logging you in...
          </h3>
          <p className="text-sm text-slate-600">
            Please wait while we verify your account.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SuccessLogin;
