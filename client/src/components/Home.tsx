import HomePageText from "../assets/HomePageText.png";
import HomePageGraphic from "../assets/HomePageGraphic.png";
import SponsorRedBull from "../assets/SponsorRedBull.png";
import SponsorForbes from "../assets/SponsorForbes.png";
import SponsorFortune from "../assets/SponsorFortune.png";

const Home: React.FC = () => {
  return (
    <section className="gap-16 bg-gray-20 py-10 md:h-full md:pb-0">
      <div className="md:flex m-auto w-5/6 justify-center items-center h-5/6">
        <div className="z-10 mt-32 md:basis-3/5">
          <div className="md:-mt-20">
            <div className="relative">
              <div className="before:absolute before:-top-20 before:-left-20 before:z-[-1] md:before:content-evolveText">
                <img src={HomePageText} alt="heroImg" />
              </div>
            </div>
            <p className="mt-8 text-sm text-red-950">
              Unrivaled Gym. Unparalleled Training Fitness Classes. World Class
              Studios to get the Body Shapes That you Dream of.. Get Your Dream
              Body Now.
            </p>
          </div>
          <div>
            <button className="mt-5 px-4 py-2 bg-secondary-400 rounded-md font-medium hover:bg-primary-500 hover:text-white transition-all duration-300 text-red-950">
              Join Now
            </button>
          </div>
        </div>

        <div className="">
          <img alt="girl" src={HomePageGraphic} />
        </div>
      </div>

      <div className="h-[150px] w-full bg-primary-100 py-10 flex items-center xs:hidden sm:hidden md:flex">
        <div className="mx-auto w-5/6">
          <div className="flex w-4/5 justify-between items-center gap-10">
            <img src={SponsorRedBull} alt="redBull" />
            <img src={SponsorForbes} alt="forbes" />
            <img src={SponsorFortune} alt="fortune" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
