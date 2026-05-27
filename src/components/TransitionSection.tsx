import { motion } from "motion/react";

export default function TransitionSection() {
  return (
    <section className="transition-section">
      <motion.div
        className="transition-content"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <p className="transition-text">
          Your friends & teammates
          <br />
          have something to say...
        </p>
        <div className="transition-divider">
          <span>🍼</span>
        </div>
      </motion.div>
    </section>
  );
}
