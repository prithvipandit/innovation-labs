import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#2D3436] text-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <img
            src="https://customer-assets.emergentagent.com/job_dfb65b39-8dbe-4dfd-94f2-b15734a08e64/artifacts/rx6a5jtl_little_wings_logo.jpeg"
            alt="Little Wings Logo"
            className="h-16 w-auto mb-4"
          />
          <p className="text-sm text-gray-300 leading-relaxed">
            Inspiring young innovators through hands-on STEM education since
            2020.
          </p>
        </div>

        <div>
          <h3 className="font-bold font-heading text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Events
              </Link>
            </li>
            {/* <li>
              <Link
                to="/admin/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Admin
              </Link>
            </li> */}
          </ul>
        </div>

        <div>
          <h3 className="font-bold font-heading text-lg mb-4">Programs</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Robotics Workshops</li>
            <li>Coding Bootcamps</li>
            <li>Science Labs</li>
            <li>Wood Workshops</li>
            <li>Summer Camps</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold font-heading text-lg mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-[#FFD93D] flex-shrink-0 mt-0.5" />
              <a
                href="https://maps.app.goo.gl/FeF222iZarrk3Tuq8"
                target="_blank"
                rel="noopener noreferrer"
                className="leading-relaxed"
              >
                2nd floor, opposite BEL White Square Apartments, BEL Layout 5th
                Block, Vijay Nagar, BEL Layout, Vidyaranyapura, Bengaluru,
                Karnataka 560097
              </a>
            </li>
            <li className="flex gap-2">
              <Phone className="w-4 h-4 text-[#6BCB77] flex-shrink-0 mt-0.5" />
              <div className="flex flex-col space-y-1">
                <a
                  href="tel:+918553786456"
                  className="hover:text-white transition-colors"
                >
                  +91 85537 86456 (Rahul)
                </a>
                <a
                  href="tel:+919994009884"
                  className="hover:text-white transition-colors"
                >
                  +91 99940 09884 (Daniel)
                </a>
              </div>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#4D96FF]" />
              littlewingsflyinglabs@gmail.com
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="max-w-7xl mx-auto mt-12 pt-12 border-t border-gray-700">
        <div className="bg-gradient-to-r from-[#FF6B6B]/10 to-[#4D96FF]/10 rounded-3xl p-8 md:p-12">
          <h3 className="font-bold font-heading text-3xl md:text-4xl mb-8 text-white text-center">
            Connect With Us
          </h3>
          <div className="flex justify-center items-center gap-8">
            <a
              href="https://www.facebook.com/AVIONGEEKS/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label="Facebook"
            >
              <div className="bg-white rounded-full p-4 group-hover:bg-[#FF6B6B] transition-all transform group-hover:scale-110">
                <Facebook className="w-8 h-8 text-[#2D3436] group-hover:text-white transition-colors" />
              </div>
            </a>
            <a
              href="https://www.instagram.com/little_wings_innovation_labs/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label="Instagram"
            >
              <div className="bg-white rounded-full p-4 group-hover:bg-[#FF6B6B] transition-all transform group-hover:scale-110">
                <Instagram className="w-8 h-8 text-[#2D3436] group-hover:text-white transition-colors" />
              </div>
            </a>
          </div>
          <p className="text-center text-gray-300 mt-6 text-lg">
            Stay updated with our latest workshops, events and STEM innovations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
        <p>
          &copy; 2025 Little Wings Innovation Labs India. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
