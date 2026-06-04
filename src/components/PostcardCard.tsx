import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

interface PostcardCardProps {
  name: string;
  message: string;
  imageUrl: string;
  index: number;
  onDelete: () => Promise<void>;
}

export default function PostcardCard({
  name,
  message,
  imageUrl,
  index,
  onDelete,
}: PostcardCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Vary rotation slightly per card for scattered feel
  const rotation = ((index % 5) - 2) * 2; // -4, -2, 0, 2, 4 degrees

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setConfirmOpen(false);
    try {
      await onDelete();
    } catch {
      // If deletion failed, restore the card so the user can try again
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      className="postcard-wrapper"
      initial={{ opacity: 0, y: 80, rotate: rotation + 10 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, amount: 0.2 }}
      exit={{
        opacity: 0,
        scale: 0.6,
        y: 40,
        rotate: rotation + 20,
        transition: { duration: 0.45, ease: "easeIn" },
      }}
      animate={
        isDeleting
          ? {
              opacity: 0,
              scale: 0.6,
              y: 40,
              rotate: rotation + 20,
              transition: { duration: 0.45, ease: "easeIn" },
            }
          : undefined
      }
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.15,
        type: "spring",
        bounce: 0.3,
      }}
      whileHover={
        isDeleting
          ? undefined
          : {
              y: -8,
              scale: 1.03,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              zIndex: 10,
            }
      }
      style={{ rotate: rotation, pointerEvents: isDeleting ? "none" : undefined }}
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
          <div className="postcard-actions">
            <button
              type="button"
              className="postcard-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
            >
              Delete
            </button>
          </div>
          <span className="postcard-tap-hint back-hint">tap to flip back</span>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {confirmOpen && (
            <motion.div
              key="confirm-overlay"
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setConfirmOpen(false);
              }}
            >
              <motion.div
                className="modal-card confirm-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={`confirm-delete-title-${name}`}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.9 }}
                transition={{ type: "spring", bounce: 0.3 }}
              >
                <h3
                  id={`confirm-delete-title-${name}`}
                  className="modal-title confirm-dialog-title"
                >
                  Delete this postcard?
                </h3>
                <p className="modal-subtitle confirm-dialog-message">
                  Are you sure you want to remove {name}'s postcard? This
                  can't be undone.
                </p>
                <div className="confirm-dialog-actions">
                  <button
                    type="button"
                    className="confirm-dialog-cancel"
                    onClick={() => setConfirmOpen(false)}
                    autoFocus
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="confirm-dialog-confirm"
                    onClick={() => void handleConfirmDelete()}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
