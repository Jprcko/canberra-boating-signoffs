
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sailboat } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  children?: ReactNode;
}

const Hero = ({
  title,
  subtitle,
  backgroundImage,
  showButton = true,
  buttonText = "Book Now",
  buttonLink = "/booking",
  children,
}: HeroProps) => {
  return (
    <div className="relative">
      <div 
        className="relative h-[60vh] min-h-[400px] max-h-[600px] flex items-center justify-center bg-cover bg-center text-white"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})` }}
      >
        <div className="container-custom text-center px-4 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">{title}</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white">{subtitle}</p>
          
          {/* Move children outside conditional rendering to fix button placement */}
          {children}
          
          {showButton && (
            <div className="mt-6">
              <Link to={buttonLink}>
                <Button className="bg-water-blue hover:bg-deep-blue text-white px-8 py-6 text-lg">
                  {buttonText}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="waves relative h-24 md:h-32">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" />
            <use xlinkHref="#gentle-wave" x="48" y="3" />
            <use xlinkHref="#gentle-wave" x="48" y="5" />
            <use xlinkHref="#gentle-wave" x="48" y="7" />
          </g>
        </svg>
        
        {/* Boat silhouette - positioned lower with updated positioning */}
        <Sailboat 
          className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 text-white/70 animate-wave" 
          size={48} 
        />
      </div>
    </div>
  );
};

export default Hero;
