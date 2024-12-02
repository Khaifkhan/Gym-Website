import React, { useState } from "react";
import { validateForm } from "../../validations/formValidation";
import { auth, signInWithEmailAndPassword } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import logo from "../../assets/logo.png"
import "react-toastify/dist/ReactToastify.css";
import { setAuthToken } from "./Auth";
import { useUser } from "../../context/userContext";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm(formData, "login");
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const userDetails = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userDetails.user;
      const tokenId = await user.getIdToken();

      setUser({
        Id: user.uid,
        name: user.displayName || "No Name",
        email: user.email || "No Email",
        picture: user.photoURL || "",
      });


      setAuthToken(tokenId);

      document.cookie = `token=${tokenId}; path=/; expires=${new Date(
        Date.now() + 60 * 60 * 1000
      ).toUTCString()}`;
      
      setIsSubmitting(false);

      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setIsSubmitting(false);

      let errorMessage = "An error occurred. Please try again.";
      if (error instanceof Error && error.message) {
        if (error.message.includes("Firebase: Error (auth/wrong-password).")) {
          errorMessage = "Incorrect password. Please try again.";
        } else if (
          error.message.includes("Firebase: Error (auth/user-not-found).")
        ) {
          errorMessage = "User not found. Please check your email.";
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

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="relative bg-white/30 backdrop-blur-lg mt-28 rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-28" />
          <h1 className="text-3xl font-bold text-primary-500">
            Login to Your Account
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
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
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full p-3 rounded-md border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-xl text-primary-500"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-500 text-white font-bold py-3 rounded-lg hover:bg-primary-600 transition-all duration-300"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/registration"
              className="text-primary-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Login;
