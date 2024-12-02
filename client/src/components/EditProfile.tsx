import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../context/userContext";

interface EditProfileProps {
  userData: any;
  onSave: (updatedData: any) => void;
  onCancel: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
  userData,
  onSave,
  onCancel,
}) => {
  const { token } = useUser();

  const [age, setAge] = useState<string>(userData.age || "");
  const [gender, setGender] = useState<string>(userData.gender || "");
  const [weight, setWeight] = useState<string>(userData.weight || "");
  const [height, setHeight] = useState<string>(userData.height || "");
  const [fitnessGoal, setFitnessGoal] = useState<string>(
    userData.fitness_goal || ""
  );

  const handleSave = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3000/auth/user",
        {
          age,
          gender,
          weight,
          height,
          fitness_goal: fitnessGoal,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        onSave(response.data.user); // Pass updated data back to parent
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

  return (
    <div className="space-y-6">
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
      <div className="flex justify-end space-x-4 mt-8">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-secondary-500 rounded-md hover:bg-primary-500 hover:text-white transition-all duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 text-white bg-primary-500 rounded-md hover:bg-primary-700 transition-all duration-300"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
