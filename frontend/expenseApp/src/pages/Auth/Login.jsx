import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    try {
      setIsLoading(true);
      window.location.href =
        "https://expensetracker-12ws.onrender.com/api/v1/auth/google";
    } catch (error) {
      console.error("Error login with google", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { user, token } = response.data;
      console.log("User: ", user);

      updateUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.isAccountVerified) {
        navigate("/dashboard");
      } else {
        navigate("/email-verify");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please Enter Your Details to Log In
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <div className="flex justify-end">
            <Link
              className="text-sm text-primary underline font-medium"
              to="/reset-otp"
            >
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn-primary">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signUp">
              SignUp
            </Link>
          </p>
        </form>

        {/* ✅ Google login button is placed outside the form */}
        <div className="my-3 text-center">
          <p className="text-sm text-slate-700 mb-2">or</p>
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100 transition w-full"
          >
            <span className="flex items-center justify-center rounded-full h-6 w-6 border-2 border-t-blue-500 border-r-red-500 border-b-yellow-500 border-l-green-500">
              <FaGoogle className="text-gray-700 text-sm" />
            </span>
            <span className="text-sm font-medium">Login with Google</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
