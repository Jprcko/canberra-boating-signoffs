
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-navy text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/434df73e-5e4b-4e6d-9307-347d261ef73f.png" 
              alt="ACT Boats & Licensing Logo" 
              className="h-10 w-auto"
            />
            <h3 className="text-xl font-semibold text-white">ACT Boats & Licensing</h3>
          </div>
            <p className="mb-4 text-gray-300">
              Professional boating logbook supervision and sign-off services in the Canberra region.
              Making the boat license process fast, easy, and stress-free.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons would go here */}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-water-blue transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-water-blue transition-colors">Our Services</Link></li>
              <li><Link to="/booking" className="text-gray-300 hover:text-water-blue transition-colors">Book a Session</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-water-blue transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-water-blue" />
                <span>0400 123 456</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-water-blue" />
                <span>team@actboatsandlicensing.com.au</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-water-blue" />
                <span>Lake Ginninderra, Canberra ACT</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6">
          <p className="text-sm text-center text-gray-400">
            &copy; {currentYear} ACT Boats & Licensing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
