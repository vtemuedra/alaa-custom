import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";

export default function Hero() {
  const hasConfettied = useRef(false);

  useEffect(() => {
    if (hasConfettied.current) return;
    hasConfettied.current = true;

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#B5EAD7", "#FFB7C5", "#C7CEEA", "#AEC6CF"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#B5EAD7", "#FFB7C5", "#C7CEEA", "#AEC6CF"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <section className="hero">
      {/* Floating decorative elements */}
      <div className="hero-floating">
        {["✨", "⭐", "💛", "🌙", "✨", "⭐", "💫", "🤍"].map((emoji, i) => (
          <motion.span
            key={i}
            className="floating-emoji"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              fontSize: `${1.2 + (i % 3) * 0.8}rem`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.p
          className="hero-pretext"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Welcome to the world
        </motion.p>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1, type: "spring", bounce: 0.3 }}
        >
          Moussa
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          A little collection of love from the
          <br />
          <strong>your team at MAI</strong>
        </motion.p>

        <motion.div
          className="hero-parents"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          Congratulations Alaa & Dinah! 🎉
        </motion.div>
      </motion.div>

      <motion.div
        className="scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
        <span className="scroll-hint-text">scroll to see the messages</span>
      </motion.div>
    </section>
  );
}
