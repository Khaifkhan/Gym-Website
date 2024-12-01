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
    "flex items-center ps-3 py-3 gap-2 hover:bg-primary-300 rounded-md hover:cursor-pointer text-gray-800 hover:text-gray-950 hover:backdrop-blur-md hover:bg-opacity-30";

  return (
    <div className="fixed top-20 left-0 h-full bg-primary-300 backdrop-blur-md bg-opacity-30 border-b border-gray-100 shadow-md w-52 rounded-lg">
      <div className="py-8 px-2">
        <ul className="mt-2 space-y-5">
          <li className={`${itemStyles}`}>
            <FontAwesomeIcon icon={faTachometerAlt} />
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className={`${itemStyles}`}>
            <FontAwesomeIcon icon={faUtensils} />
            <span>Diet Plan</span>
          </li>
          <li className={`${itemStyles}`}>
            <FontAwesomeIcon icon={faBullseye} />
            <span>Goals</span>
          </li>
          <li className={`${itemStyles}`}>
            <FontAwesomeIcon icon={faCalendarDay} />
            <span>Schedule</span>
          </li>
        </ul>
      </div>
      <div className="absolute bottom-0 left-0 p-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-red-500 w-full"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
