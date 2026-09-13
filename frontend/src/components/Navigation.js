import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Heart, CalendarCheck, Mail, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import little_wings_logo from "../images/little_wings_logo.jpeg";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, username, logout } = useAuth();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/events", label: "Events" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

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

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full border-2 border-[#4D96FF] text-[#4D96FF] hover:bg-[#4D96FF] hover:text-white"
                    data-testid="nav-account-btn"
                  >
                    <User className="mr-2 w-4 h-4" /> {username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin ? (
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")} data-testid="nav-admin-dashboard-link">
                      <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/account?tab=products")} data-testid="nav-product-wishlist-link">
                        <Heart className="w-4 h-4" /> Product Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/account?tab=events")} data-testid="nav-event-wishlist-link">
                        <CalendarCheck className="w-4 h-4" /> Event Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/account?tab=communications")} data-testid="nav-communications-link">
                        <Mail className="w-4 h-4" /> Communications
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="nav-logout-btn">
                    <LogOut className="w-4 h-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/admin/login">
                <Button
                  variant="outline"
                  className="rounded-full border-2 border-[#4D96FF] text-[#4D96FF] hover:bg-[#4D96FF] hover:text-white"
                  data-testid="nav-login-btn"
                >
                  Login
                </Button>
              </Link>
            )}
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
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link to="/admin/dashboard" className="block py-2 font-semibold text-[#2D3436]" onClick={() => setMobileMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link to="/account" className="block py-2 font-semibold text-[#2D3436]" onClick={() => setMobileMenuOpen(false)}>
                    My Account
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="w-full rounded-full border-2 border-[#FF6B6B] text-[#FF6B6B]"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-2 border-[#4D96FF] text-[#4D96FF]"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
