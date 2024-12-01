import { useEffect, useState } from "react";
import { auth, db, updateDoc, doc, getDoc } from "../firebase";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  age?: string;
  gender?: string;
  weight?: string;
  height?: string;
  fitness_goal?: string;
}

const capitalizeName = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [fitnessGoal, setFitnessGoal] = useState<string>("");

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          setAge(data.age || "");
          setGender(data.gender || "");
          setWeight(data.weight || "");
          setHeight(data.height || "");
          setFitnessGoal(data.fitness_goal || "");

          localStorage.setItem("userData", JSON.stringify(data));
        }
      }
    } catch (error) {
      toast.error("Error fetching user data.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  });

  useEffect(() => {
    const savedData = localStorage.getItem("userData");
    if (savedData) {
      const parsedData = JSON.parse(savedData) as UserData;
      setUserData(parsedData);
      setAge(parsedData.age || "");
      setGender(parsedData.gender || "");
      setWeight(parsedData.weight || "");
      setHeight(parsedData.height || "");
      setFitnessGoal(parsedData.fitness_goal || "");
    } else {
      fetchUserData();
    }
  }, []);

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          age,
          gender,
          weight,
          height,
          Desired_weight: fitnessGoal,
        });

        setIsEditing(false);

        toast.success("Profile updated successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Error updating profile.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      toast.success("Logged out successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
    });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onLogout={handleLogout} />
      <div className=" w-[700px] ml-[410px]">
        <section className="relative pt-28 pb-8 px-6">
          <div className="max-w-4xl  mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-primary-500">
                Your Profile
              </h1>
            </div>

            {isLoading ? (
              <p className="text-center text-lg text-gray-600">Loading...</p>
            ) : (
              userData && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        size="5x"
                        className="text-primary-500"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-700">
                        {capitalizeName(userData.first_name)}{" "}
                        {capitalizeName(userData.last_name)}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    {isEditing ? (
                      <>
                        <div className="flex flex-col space-y-2">
                          <label className="text-gray-700">Age</label>
                          <input
                            type="text"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-gray-700">Gender</label>
                          <input
                            type="text"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-gray-700">Weight</label>
                          <input
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-gray-700">Height</label>
                          <input
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-gray-700">Fitness Goal</label>
                          <input
                            type="text"
                            value={fitnessGoal}
                            onChange={(e) => setFitnessGoal(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Email:</p>
                          <p className="font-medium text-gray-800">
                            {userData.email}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Age:</p>
                          <p className="font-medium text-gray-800">
                            {age || "N/A"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Gender:</p>
                          <p className="font-medium text-gray-800">
                            {gender || "N/A"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Weight:</p>
                          <p className="font-medium text-gray-800">
                            {weight || "N/A"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Height:</p>
                          <p className="font-medium text-gray-800">
                            {height || "N/A"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Desired Weight:</p>
                          <p className="font-medium text-gray-800">
                            {fitnessGoal || "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4 mt-8">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-6 py-2 text-gray-700 bg-secondary-500 rounded-md hover:bg-primary-500 hover:text-white transition-all duration-300"
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                    {isEditing && (
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                      >
                        Save Changes
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
          <ToastContainer />
        </section>
      </div>
    </div>
  );
};

export default Profile;
