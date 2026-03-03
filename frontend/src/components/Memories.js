import { useState } from "react";
import "../css/Gallery.css";
import gal_1 from "../images/gal_1.png";
import gal_2 from "../images/gal_2.png";
import gal_3 from "../images/gal_3.png";
import gal_4 from "../images/gal_4.png";
import gal_5 from "../images/gal_5.png";
import gal_6 from "../images/gal_6.png";
import gal_7 from "../images/gal_7.png";
import gal_8 from "../images/gal_8.png";
import gal_9 from "../images/gal_9.png";
import gal_10 from "../images/gal_10.png";
import gal_11 from "../images/gal_11.png";
import gal_12 from "../images/gal_12.png";
import gal_13 from "../images/gal_13.png";
import gal_14 from "../images/gal_14.png";


export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const gallery = [
    gal_1,
    gal_2,
    gal_3,
    gal_4,
    gal_5,
    gal_6,
    gal_7,
    gal_8,
    gal_9,
    gal_10,
    gal_11,
    gal_12,
    gal_13,
    gal_14
  ];

  return (
    <section id="gallery" className="gallery">

      <div className="gallery-masonry">
        {gallery.map((img, idx) => (
          <div
            key={idx}
            className="gallery-item"
            onClick={() => setSelectedImage(img)}
          >
            <img src={img} alt={`Gallery ${idx + 1}`} loading="lazy" />
            <div className="gallery-overlay">
              <span>👁️ View</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedImage} alt="Full view" />
            <button
              className="lightbox-close"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
