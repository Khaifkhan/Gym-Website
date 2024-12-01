import React, { useState } from "react";
import { validateForm } from "../../validations/formValidation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import {
  auth,
  createUserWithEmailAndPassword,
  setDoc,
  doc,
  db,
} from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import logo from "../../assets/logo.png";
import { toast, ToastContainer } from "react-toastify";
import GoogleAuth from "./GoogleAuth";
import axios from "axios";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Registration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm(formData, "registration");
    setErrors(formErrors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredentials.user;

      await updateProfile(user, {
        displayName: `${formData.first_name} ${formData.last_name}`,
        photoURL: null,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        photoURL: null,
      });

      setIsSubmitting(false);

      toast.success("Registration successful!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        Navigate("/login");
      });
    } catch (error) {
      setIsSubmitting(false);

      let errorMessage = "An error occurred. Please try again.";
      if (error instanceof Error && error.message) {
        if (
          error.message.includes("Firebase: Error (auth/email-already-in-use).")
        ) {
          errorMessage = "Email already in use. Please use a different email.";
        }
      }

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    console.log("Google login successful:", response);
    const user = response?.profileObj;

    if (user) {
      try {
        const res = await axios.post("api/auth/google", {
          token: response.credential,
        });
        
        if (res.status === 200) {
          toast.success(`Welcome, ${user.name}!`);
        } else {
          toast.error("Google login failed. Please try again.");
        }

        Navigate("/");
      } catch (error) {
        toast.error("Google login failed. Please try again.");
      }
    }
  };

  const handleGoogleFailure = () => {
    toast.error("Google login failed. Please try again.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="relative bg-white/30 backdrop-blur-lg mt-28 rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-28" />
          <h1 className="text-3xl font-bold text-primary-500">
            Create Your Account
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full p-3 rounded-md border ${
                errors.first_name ? "border-red-500" : "border-gray-300"
              } bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">{errors.first_name}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full p-3 rounded-md border ${
                errors.last_name ? "border-red-500" : "border-gray-300"
              } bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 rounded-md border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 rounded-md border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-xl text-primary-500"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 rounded-md border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-xl text-primary-500"
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
              />
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-500 text-white font-bold py-3 rounded-lg hover:bg-primary-600 transition-all duration-300"
          >
            {isSubmitting ? "Submitting..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
        <div className="text-center mt-4">
          <GoogleAuth
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
          />
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Registration;
