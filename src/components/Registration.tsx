import React, { useState } from "react";
import { validateForm } from "../validations/formValidation";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface errors {
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
  const [errors, setErrors] = useState<errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputStyles = `w-full p-2 border rounded-md mb-5 focus:outline-primary-300`;

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
  };

  return (
    <section className="m-auto mt-32 rounded-md w-3/6 shadow-md">
      <h1 className="text-center text-primary-500 pt-5 mb-5">Create Your Account</h1>
      <form onSubmit={handleSubmit} className="md:w-5/6 mx-auto pb-10">
        <div>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className={`${inputStyles} ${
              errors.first_name ? "border-red-500" : ""
            }`}
          />
          {errors.first_name && (
            <p className="text-red-500">{errors.first_name}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className={`${inputStyles} ${
              errors.last_name ? "border-red-500" : ""
            }`}
          />
          {errors.last_name && (
            <p className="text-red-500">{errors.last_name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={`${inputStyles} ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={`${inputStyles} ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>

        <div>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={`${inputStyles} ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-secondary-400 text-primary-500 font-medium p-2 rounded-md hover:bg-primary-500 hover:text-white transition-all duration-300"
        >
          {isSubmitting ? "Submitting..." : "Register"}
        </button>
      </form>
    </section>
  );
};

export default Registration;
