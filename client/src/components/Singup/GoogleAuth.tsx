import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import axios from "axios";
import { useUser } from "../../context/userContext"; 

interface GoogleAuthProps {
  onSuccess: (user: any) => void;
  onFailure: () => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSuccess, onFailure }) => {
  const { setUser, setToken } = useUser(); // Access the UserContext
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
    console.log("Received token:", token);

    if (!token) {
      toast.error("No credential token found.");
      return;
    }

    const decoded = decodeJWT(token);

    if (!decoded) {
      toast.error("Token is invalid.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/google",
        {
          token,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUser({
          Id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        });

        const expiryTime = Date.now() + 3600000; 
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiry", expiryTime.toString());

        setToken(token);

        onSuccess(decoded);
        toast.success(`Welcome, ${decoded.name}!`);
      } else {
        toast.error("Login failed, please try again.");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please check your credentials.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
      console.error(error);
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
