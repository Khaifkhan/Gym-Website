export const validatePassword = (password: string): string => {
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  if (!password) {
    return "Password is required";
  }

  if (!passwordPattern.test(password)) {
    return "Password must contain at least one uppercase letter, one number, and one special character.";
  }

  return "";
};
