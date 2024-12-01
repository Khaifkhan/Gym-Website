import React, { useEffect } from "react";
import GoogleAuth from "./GoogleAuth";
import { useUser } from "../../context/userContext";
import { toast } from "react-toastify";

const SignUpPage: React.FC = () => {
  const { setUser } = useUser();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
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
