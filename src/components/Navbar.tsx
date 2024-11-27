import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const flexBetween = "flex items-center justify-between";

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
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
    
    

  return (
    <nav>
      <div
        className={`${flexBetween} fixed top-0 z-30 w-full py-6 ${
          hasScrolled ? "bg-primary-100 backdrop-filter backdrop-blur-md bg-opacity-30 border-b border-gray-100 shadow-md"  : "bg-transparent"
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
                  to="/classes"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link text-primary-500 font-semibold"
                      : "nav-link text-gray-500 hover:text-primary-500"
                  }
                >
                  Our Classes
                </NavLink>
              </div>
              <div className={`${flexBetween} gap-8`}>
                <Link
                  to="/registration"
                  className="border nav-link border-primary-500  px-3 py-2 rounded-md hover:text-white hover:bg-primary-500 transition-all duration-300"
                >
                  Sign Up
                </Link>
                <Link
                  to="/"
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
          <Link
            to="/"
            className="hover:text-primary-500 transition-all duration-300"
          >
            Sign Up
          </Link>
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
