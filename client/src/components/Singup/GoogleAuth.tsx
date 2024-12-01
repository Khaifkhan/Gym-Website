import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import axios from "axios";

interface GoogleAuthProps {
  onSuccess: (user: any) => void;
  onFailure: () => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSuccess, onFailure }) => {
  const decodeJWT = (token: string): any => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    const token = response.credential;

    if (!token) {
      toast.error("No credential token found.");
      return;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
      toast.error("Failed to decode the JWT.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/google", { token });

      if (res.status !== 200) {
        throw new Error("Failed to authenticate with backend.");
      }

      onSuccess(decoded);
      toast.success(`Welcome, ${decoded.name}!`);
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleGoogleFailure = () => {
    onFailure();
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
      />
    </div>
  );
};

export default GoogleAuth;
