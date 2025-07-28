
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Booking", href: "/booking" },
    { name: "Contact", href: "/contact" },
    { name: "Client Portal", href: "/client-portal" }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-white py-4 shadow-sm sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/9d7a839e-573f-49ef-9e93-490b7f5dba20.png" 
            alt="ACT Boats & Licensing Logo" 
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold text-navy">ACT Boats & Licensing</h1>
            <p className="text-xs text-gray-600">Professional Boat Licence Services</p>
          </div>
        </Link>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={isActive(item.href) ? "active-nav-link" : "nav-link"}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <Link to="/booking">
            <Button className="bg-water-blue hover:bg-deep-blue">Book Now</Button>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-b border-gray-200 py-4 z-40">
          <div className="container-custom flex flex-col space-y-4">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={isActive(item.href) ? "active-nav-link" : "nav-link"}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <Link to="/booking" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="bg-water-blue hover:bg-deep-blue w-full">Book Now</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
