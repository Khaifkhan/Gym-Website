export const validateEmail = (email: string): string => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return "Email is required";
  }

  if (!emailPattern.test(email)) {
    return "Enter a valid email address";
  }

  return "";
};
