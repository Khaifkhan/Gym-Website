import React, { useEffect } from "react";
import GoogleAuth from "./GoogleAuth";
import { useUser } from "../../context/userContext";
import { toast } from "react-toastify";
import axios from "axios";

const SignUpPage: React.FC = () => {
  const { setUser } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const tokenExpiry = localStorage.getItem("tokenExpiry");

      if (token && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
        try {
          const response = await axios.get("http://localhost:3000/auth/user", {
            withCredentials: true,
          });

          if (response.status === 200) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch user data.");
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        toast.error("Session expired. Please log in again.");
      }
    };

    fetchUserData();
  }, [setUser]);

  const handleSuccess = (user: any) => {
    setUser(user);
    toast.success(`Welcome, ${user.name}!`);
  };

  const handleFailure = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary-500">
          Sign Up
        </h1>
        <GoogleAuth onSuccess={handleSuccess} onFailure={handleFailure} />
      </div>
    </div>
  );
};

export default SignUpPage;
