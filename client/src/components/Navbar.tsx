import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../firebase";
import { useUser } from "../context/userContext";

const capitalizeName = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const { user, setUser } = useUser();

  const flexBetween = "flex items-center justify-between";

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      const parsedUser = JSON.parse(loggedUser);
      setUser(parsedUser);
    }

    const handleScroll = (): void => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      if (parsedUser !== user) {
        setUser(parsedUser);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [user]);

  const handleLogout = (): void => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("userData");
    setUser(null);
    auth.signOut();
    closeMobileMenu();
    navigate("/registration");
  };

  const isnotHome = location.pathname !== "/";

  return (
    <nav>
      <div
        className={`${flexBetween} fixed top-0 z-30 w-full py-6 ${
          hasScrolled
            ? "bg-primary-100 backdrop-filter backdrop-blur-md bg-opacity-30 border-b border-gray-100 shadow-md"
            : isnotHome
            ? "bg-primary-100 backdrop-filter backdrop-blur-md bg-opacity-30 border-b border-gray-100 shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className={`${flexBetween} mx-auto w-5/6`}>
          <div className={`${flexBetween} w-full gap-20`}>
            <NavLink to="/">
              <img src={logo} alt="logo" />
            </NavLink>
            <div className={`${flexBetween} w-full hidden md:flex`}>
              <div className={`${flexBetween} gap-8 text-[16px]`}>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link text-primary-500 font-semibold"
                      : "nav-link text-gray-500 hover:text-primary-500"
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link text-primary-500 font-semibold"
                      : "nav-link text-gray-500 hover:text-primary-500"
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to="/benefits"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link text-primary-500 font-semibold"
                      : "nav-link text-gray-500 hover:text-primary-500"
                  }
                >
                  Benefits
                </NavLink>
                <NavLink
                  to="/workout"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link text-primary-500 font-semibold"
                      : "nav-link text-gray-500 hover:text-primary-500"
                  }
                >
                  Start Workout
                </NavLink>
              </div>
              <div className={`${flexBetween} gap-8`}>
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:bg-primary-100 px-3 py-2 hover:cursor-pointer rounded-md transition-all duration-300"
                    >
                      {capitalizeName(user.name)}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/registration"
                      className="nav-link text-primary-500 px-10 py-2 rounded-md hover:bg-primary-500 hover:text-white transition-all duration-300"
                    >
                      Sign In
                    </Link>
                  </>
                )}
                <Link
                  to="/registration"
                  className="nav-link bg-secondary-400 text-primary-500 px-10 py-2 rounded-md hover:bg-primary-500 hover:text-white transition-all duration-300"
                >
                  Become a Member
                </Link>
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-primary-500 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faBars} size="sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:hidden fixed top-0 right-0 w-[70%] h-full bg-primary-100 py-6 px-4 z-40`}
      >
        <div className="absolute top-6 right-8">
          {isMobileMenuOpen && (
            <button
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-primary-500 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faTimes} size="sm" />
            </button>
          )}
        </div>

        <div className="flex flex-col items-start ml-2 gap-6 text-lg mt-16">
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              isActive
                ? "text-primary-500 font-semibold"
                : "text-gray-500 hover:text-primary-500"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              isActive
                ? "text-primary-500 font-semibold"
                : "text-gray-500 hover:text-primary-500"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/benefits"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              isActive
                ? "text-primary-500 font-semibold"
                : "text-gray-500 hover:text-primary-500"
            }
          >
            Benefits
          </NavLink>
          <NavLink
            to="/classes"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              isActive
                ? "text-primary-500 font-semibold"
                : "text-gray-500 hover:text-primary-500"
            }
          >
            Our Classes
          </NavLink>
          {user ? (
            <div className="flex flex-col items-start gap-4">
              <Link
                onClick={closeMobileMenu}
                to="/profile"
                className="text-gray-700 hover:bg-primary-100"
              >
                {capitalizeName(user.name)}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/registration"
              onClick={closeMobileMenu}
              className="text-red-950 hover:text-primary-500 transition-all duration-300"
            >
              Sign Up
            </Link>
          )}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="bg-secondary-400 text-primary-500 px-9 py-2 rounded-md hover:bg-primary-500 hover:text-white transition-all duration-300"
          >
            Become a Member
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
