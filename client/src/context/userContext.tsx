import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface User {
  Id: string;
  name: string;
  email: string;
  picture: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (token && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("http://localhost:3000/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            setUser(response.data.user);
          } else {
            toast.error("Session expired. Please login again.");
          }
        } catch (error) {
          toast.error("Unable to fetch user data. Please login.");
        }
      };

      fetchUserData();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      toast.error("Session expired. Please log in again.");
    }
  }, [setUser]);


  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
