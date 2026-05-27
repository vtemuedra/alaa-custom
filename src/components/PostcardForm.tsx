import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { uploadImage, addPostcard, isFirebaseConfigured } from "../firebase";

export default function PostcardForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !imageFile) return;

    if (!isFirebaseConfigured()) {
      alert(
        "Firebase is not configured yet! Check the README for setup instructions."
      );
      return;
    }

    setSubmitting(true);
    try {
      const imageUrl = await uploadImage(imageFile);
      await addPostcard({ name: name.trim(), message: message.trim(), imageUrl });

      // Celebration confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#B5EAD7", "#FFB7C5", "#C7CEEA", "#AEC6CF"],
      });

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setName("");
        setMessage("");
        setImageFile(null);
        setImagePreview(null);
      }, 2500);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong — please try again!");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsOpen(false);
    setSubmitted(false);
    setName("");
    setMessage("");
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <section className="form-section">
      <motion.button
        className="add-postcard-btn"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.97 }}
      >
        📮 Add Your Postcard
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) resetForm();
            }}
          >
            <motion.div
              className="modal-card"
              initial={{ opacity: 0, y: 60, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: 60, rotate: 3 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              {submitted ? (
                <div className="submit-success">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="success-emoji"
                  >
                    🎉
                  </motion.div>
                  <h3>Pinned to the wall!</h3>
                  <p>Thank you, {name}! Your postcard is now on the wall.</p>
                </div>
              ) : (
                <>
                  <button
                    className="modal-close"
                    onClick={resetForm}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                  <h3 className="modal-title">
                    Write your postcard ✍️
                  </h3>
                  <p className="modal-subtitle">
                    For Alaa, Dinah & baby Moussa
                  </p>

                  <form onSubmit={handleSubmit} className="postcard-form">
                    <div className="form-group">
                      <label htmlFor="name">Your name</label>
                      <input
                        id="name"
                        type="text"
                        placeholder="e.g. Sarah"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={50}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Your message</label>
                      <textarea
                        id="message"
                        placeholder="Write something heartfelt for the new family..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        maxLength={500}
                        rows={4}
                      />
                      <span className="char-count">
                        {message.length}/500
                      </span>
                    </div>

                    <div className="form-group">
                      <label>Upload a photo</label>
                      <div
                        className={`upload-area ${imagePreview ? "has-preview" : ""}`}
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            fileInputRef.current?.click();
                          }
                        }}
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="upload-preview"
                          />
                        ) : (
                          <div className="upload-placeholder">
                            <span className="upload-icon">📷</span>
                            <span>Click to upload a photo</span>
                            <span className="upload-hint">Max 5MB</span>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          hidden
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      className="submit-btn"
                      disabled={
                        submitting ||
                        !name.trim() ||
                        !message.trim() ||
                        !imageFile
                      }
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {submitting ? "Pinning..." : "📌 Pin it to the wall!"}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
