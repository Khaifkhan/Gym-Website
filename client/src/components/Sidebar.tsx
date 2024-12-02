import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUtensils,
  faBullseye,
  faCalendarDay,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar = ({ onLogout }: SidebarProps) => {
  const itemStyles =
    "flex items-center text-red-800 hover:text-red-950 hover:cursor-pointer gap-3 py-3 px-4 rounded-lg hover:bg-primary-300 text-gray-800 hover:bg-opacity-80 transition duration-300 ease-in-out";

  return (
    <div className="fixed top-20 left-0 h-full w-60 sm:w-72 md:w-60 bg-primary-300 bg-opacity-40 backdrop-blur-lg shadow-xl rounded-r-xl">
      <div className="py-8 px-6 space-y-6">
        <ul className="space-y-6">
          <li className={itemStyles}>
            <FontAwesomeIcon icon={faTachometerAlt} className="text-xl" />
            <Link to="/dashboard" className="font-medium">
              Dashboard
            </Link>
          </li>
          <li className={itemStyles}>
            <FontAwesomeIcon icon={faUtensils} className="text-xl" />
            <span className="font-medium">Diet Plan</span>
          </li>
          <li className={itemStyles}>
            <FontAwesomeIcon icon={faBullseye} className="text-xl" />
            <span className="font-medium">Goals</span>
          </li>
          <li className={itemStyles}>
            <FontAwesomeIcon icon={faCalendarDay} className="text-xl" />
            <span className="font-medium">Schedule</span>
          </li>
        </ul>
      </div>
      <div className="p-6 ms-5 mt-36 bg-primary-400 rounded-t-lg">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-red-500 hover:text-red-600 w-full justify-start transition duration-300 ease-in-out"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
