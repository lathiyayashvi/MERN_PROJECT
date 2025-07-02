import React from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {Toaster} from "react-hot-toast";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import UserProvider from "./context/UserContext.jsx";
import EmailVerify from "./pages/Auth/EmailVerify";
import ResetOTP from "./pages/Auth/ResetOTP";
import EditProfile from "./pages/Dashboard/EditProfile";
import SuccessLogin from "./pages/Auth/SuccessLogin";

function App() {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Home />} />} />
            <Route path="/income" element={<PrivateRoute element={<Income />} />} />
            <Route path="/expense" element={<PrivateRoute element={<Expense />} />} />
            <Route path="/edit-profile" element={<PrivateRoute element={<EditProfile />} />}/>
            <Route path="/email-verify" element={<EmailVerify/>}/>
            <Route path="/reset-otp" element={<ResetOTP />} />
            <Route path="success-login" element={<SuccessLogin/>}/>
          </Routes>
        </Router>
      </div>

      <Toaster
      toastOptions={{
        className: "",
        style: {
          fontSize: '13px'
        },
      }}
      />
    </UserProvider>
  );
}

export default App;

const Root = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
};