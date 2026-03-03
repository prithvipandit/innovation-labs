import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import little_wings_logo from "../images/little_wings_logo.jpeg";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/events", label: "Events" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-1.5">
            <img
              src={little_wings_logo}
              alt="Little Wings Logo"
              className="h-10 md:h-12 w-auto object-contain"
              data-testid="nav-logo"
            />
            <h1 className="text-2xl md:text-3xl font-semibold text-[#2D3436] tracking-tight">
              little wings
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-semibold font-body transition-colors ${
                  isActive(link.path)
                    ? "text-[#FF6B6B]"
                    : "text-[#2D3436] hover:text-[#FF6B6B]"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
            {/* <Link to="/admin/login">
              <Button
                variant="outline"
                className="rounded-full border-2 border-[#4D96FF] text-[#4D96FF] hover:bg-[#4D96FF] hover:text-white"
                data-testid="nav-admin-btn"
              >
                Admin
              </Button>
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 font-semibold ${
                  isActive(link.path) ? "text-[#FF6B6B]" : "text-[#2D3436]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full rounded-full border-2 border-[#4D96FF] text-[#4D96FF]"
              >
                Admin
              </Button>
            </Link> */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
