import { validateEmail } from "./emailValidation";
import { validatePassword } from "./passwordValidation";

interface formData {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  confirmPassword?: string; 
}

export const validateForm = (
  formData: formData,
  formType: "login" | "registration" = "login"
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  const emailError = validateEmail(formData.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  if (formType === "registration") {
    if (!formData.first_name) {
      errors.first_name = "First name is required.";
    }

    if (!formData.last_name) {
      errors.last_name = "Last name is required.";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirmation Password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  return errors;
};
