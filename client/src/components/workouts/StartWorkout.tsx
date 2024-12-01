import running from "../../assets/running.jpg";
import cycling from "../../assets/cycling.jpg";
import weightlifting from "../../assets/weightlifting.jpg";
import cardio from "../../assets/cardio.jpg";
import yoga from "../../assets/image2.png";
import { useNavigate } from "react-router-dom";

interface Activity {
  name: string;
  image: string;
}

const activities: Activity[] = [
  {
    name: "Running",
    image: running
  },
  {
    name: "Cycling",
    image: cycling
    
  },
  {
    name: "Cardio",
    image: cardio,
  },
  {
    name: "Weightlifting",
    image: weightlifting,
  },
  {
    name: "Yoga",
    image: yoga,
  },
];

const StartWorkout: React.FC = () => {

  const navigate = useNavigate();

  const handleClick = (activityName:string) => {
    navigate(`/${activityName.toLocaleLowerCase}`)
    console.log(activityName);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-center text-primary-300 mb-8 mt-16">
        Choose Your Workout
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="bg-white hover:cursor-pointer rounded-lg shadow-lg overflow-hidden transform transition duration-300  hover:scale-105 hover:shadow-xl"
          >
            <div className="relative group">
              <div
              onClick={() => handleClick(activity.name)}
              className="w-full h-48 bg-cover"
              style={{ backgroundImage: `url(${activity.image})` }}
            >

              <div className="absolute inset-0 flex items-end p-4 justify-start bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300">
                <h3 className="text-white text-2xl font-semibold text-shadow-lg  group-hover:text-xl group-hover:text-primary-300 group-hover:uppercase transition-all duration-300">
                  {activity.name}
                  </h3>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartWorkout;
