import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import EditProfile from "./EditProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const SkeletonLoader = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-48 h-6 bg-gray-300 rounded animate-pulse"></div>
      </div>

      <div className="space-y-4 mt-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex justify-between">
            <div className="w-24 h-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-300 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { setUser, token } = useUser();  
  const navigate = useNavigate();

  const fetchUserData = async () => {
    if (!token) {
      toast.error("No token found. Please login.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/auth/user", {
        headers: { Authorization: `Bearer ${token}` },  
      });

      if (response.status === 200) {
        setUser(response.data.user);  
        setUserData(response.data.user);  
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data: " + error.message, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]); 

  const handleLogout = () => {
    setUser(null);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";  
    navigate("/login");
    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const handleSaveProfile = (updatedData: any) => {
    setUserData(updatedData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onLogout={handleLogout} />
      <div className="w-[700px] ml-[410px]">
        <section className="relative pt-28 pb-8 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-primary-500">
                Your Profile
              </h1>
            </div>

            {userData ? (
              <>
                {isEditing ? (
                  <EditProfile
                    userData={userData}
                    onSave={handleSaveProfile}
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        size="5x"
                        className="text-primary-500"
                      />
                      <h2 className="text-xl font-semibold text-gray-700">
                        {userData.first_name} {userData.last_name}
                      </h2>
                    </div>

                    <div className="space-y-4 mt-6">
                      <div className="flex justify-between">
                        <p className="text-gray-600">Email:</p>
                        <p className="font-medium text-gray-800">
                          {userData.email}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Age:</p>
                        <p className="font-medium text-gray-800">
                          {userData.age || "N/A"}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Gender:</p>
                        <p className="font-medium text-gray-800">
                          {userData.gender || "N/A"}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Weight:</p>
                        <p className="font-medium text-gray-800">
                          {userData.weight || "N/A"}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Height:</p>
                        <p className="font-medium text-gray-800">
                          {userData.height || "N/A"}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Fitness Goal:</p>
                        <p className="font-medium text-gray-800">
                          {userData.fitness_goal || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 text-gray-700 bg-secondary-500 rounded-md hover:bg-primary-500 hover:text-white transition-all duration-300"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <SkeletonLoader />  
            )}
          </div>
        </section>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
