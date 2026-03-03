import React from "react";
import "../css/WhatsAppButton.css";

const WhatsAppButton = () => {
  // Replace with your actual WhatsApp number (with country code, no spaces/dashes)
  const phoneNumber = "918553786456";
  const message = "Hi! I'd like to know more about Creative Kids.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
      id="whatsapp-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="whatsapp-icon"
        fill="#ffffff"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.96A15.89 15.89 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.32 22.616c-.39 1.1-1.932 2.014-3.17 2.28-.846.18-1.95.324-5.668-1.218-4.762-1.974-7.826-6.8-8.064-7.114-.23-.314-1.932-2.574-1.932-4.908s1.224-3.482 1.658-3.96c.434-.478.948-.596 1.264-.596.314 0 .632.002.908.016.292.016.682-.11 1.066.814.39.94 1.33 3.244 1.446 3.48.118.236.196.51.04.824-.158.314-.236.51-.472.786-.236.274-.498.614-.71.824-.236.236-.482.492-.208.964.274.472 1.218 2.01 2.616 3.258 1.796 1.602 3.31 2.098 3.782 2.334.472.236.748.196 1.024-.118.274-.314 1.184-1.382 1.5-1.858.314-.478.632-.394 1.066-.236.434.158 2.74 1.294 3.212 1.528.472.236.786.354.904.55.116.196.116 1.136-.274 2.234z" />
      </svg>
      <span className="whatsapp-tooltip">Chat with us!</span>
    </a>
  );
};

export default WhatsAppButton;