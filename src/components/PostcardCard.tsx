import { useState } from "react";
import { motion } from "motion/react";

interface PostcardCardProps {
  name: string;
  message: string;
  imageUrl: string;
  index: number;
}

export default function PostcardCard({
  name,
  message,
  imageUrl,
  index,
}: PostcardCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Vary rotation slightly per card for scattered feel
  const rotation = ((index % 5) - 2) * 2; // -4, -2, 0, 2, 4 degrees

  return (
    <motion.div
      className="postcard-wrapper"
      initial={{ opacity: 0, y: 80, rotate: rotation + 10 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.15,
        type: "spring",
        bounce: 0.3,
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        zIndex: 10,
      }}
      style={{ rotate: rotation }}
    >
      <div
        className={`postcard-card ${isFlipped ? "flipped" : ""}`}
        onClick={() => setIsFlipped(!isFlipped)}
        role="button"
        tabIndex={0}
        aria-label={`Postcard from ${name}. Click to ${isFlipped ? "see photo" : "read message"}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsFlipped(!isFlipped);
          }
        }}
      >
        {/* Front - Photo side */}
        <div className="postcard-front">
          <div className="postcard-photo-frame">
            <img src={imageUrl} alt={`Photo from ${name}`} loading="lazy" />
          </div>
          <div className="postcard-front-label">
            <span className="postcard-from">From {name}</span>
            <span className="postcard-tap-hint">tap to read →</span>
          </div>
        </div>

        {/* Back - Message side */}
        <div className="postcard-back">
          <div className="postcard-back-content">
            <div className="postcard-stamp">💌</div>
            <p className="postcard-message">{message}</p>
            <div className="postcard-signature">
              <span className="postcard-dash">—</span>
              <span className="postcard-signer">{name}</span>
            </div>
          </div>
          <span className="postcard-tap-hint back-hint">tap to flip back</span>
        </div>
      </div>
    </motion.div>
  );
}
