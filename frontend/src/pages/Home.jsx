import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import "../styles.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
{/* HERO */}
<section className="hero-clean">
  <div className="hero-overlay">

    {/* Line 1 */}
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1 }}
    >
    <h1 className="hero-title">Welcome to <span className="edu">Edu</span><span className="village">Village</span></h1> 
    </motion.h1>

    {/* Line 2 */}
    <motion.h3
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 1.0 }}
      className="hero-tagline"
    >
      Online Learning Platform
    </motion.h3>

    {/* Line 3 */}
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.6 }}
      className="hero-subtitle"
    >
      Empowering learners through structured courses,
      real-world skills, and guided learning paths.
    </motion.p>

    {/* Buttons */}
    <motion.div
      className="hero-actions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
    >
      <button className="primary-btn" onClick={() => navigate("/signup")}>
        Sign Up
      </button>

      <button className="outline-btn" onClick={() => navigate("/courses")}>
        Explore Courses
      </button>
    </motion.div>

  </div>
</section>

      {/* STATS */}
<section className="stats">
  <motion.div
    className="stat-card"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    whileHover={{ y: -6 }}
    viewport={{ once: true }}
  >
    <h2>20+</h2>
    <p>Active Courses</p>
  </motion.div>

  <motion.div
    className="stat-card"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.25 }}
    whileHover={{ y: -6 }}
    viewport={{ once: true }}
  >
    <h2>100+</h2>
    <p>Learners Enrolled</p>
  </motion.div>

  <motion.div
    className="stat-card"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    whileHover={{ y: -6 }}
    viewport={{ once: true }}
  >
    <h2>95%</h2>
    <p>Success Rate</p>
  </motion.div>

  <motion.div
    className="stat-card"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.55 }}
    whileHover={{ y: -6 }}
    viewport={{ once: true }}
  >
    <h2>10+</h2>
    <p>Expert Mentors</p>
  </motion.div>
</section>

      {/* WHY SECTION */}
      <section className="why">
  <h2>Why Choose EduVillage?</h2>

  <div className="why-grid">
    <motion.div
      className="why-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
    >
      <h3>🎯 Career-Focused Learning</h3>
      <p>Structured courses aligned with industry needs.</p>
    </motion.div>

    <motion.div
      className="why-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
    >
      <h3>📜 Verified Certificates</h3>
      <p>Secure certificate verification for authenticity.</p>
    </motion.div>

    <motion.div
      className="why-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
    >
      <h3>⏱ Self-Paced Learning</h3>
      <p>Learn anytime with guided lesson flow.</p>
    </motion.div>

    <motion.div
      className="why-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.55 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
    >
      <h3>🔐 Secure Platform</h3>
      <p>JWT-based authentication & role-based access.</p>
    </motion.div>
  </div>
</section>

      {/* CONTACT */}
      <section className="contact">
        <h2>Contact Us</h2>
        <p>Have questions? We’d love to help.</p>

        <div className="contact-box">
          <p>📧 support@eduvillage.com</p>
          <p>📍 India</p>
          <p>📞 +91 XXXXX XXXXX</p>
        </div>
      </section>

      {/* FOOTER */}
     <motion.footer
  className="footer"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  viewport={{ once: true }}
>
  <div className="footer-grid">

    {/* BRAND */}
    <div className="footer-brand">
      <h3 className="footer-logo">
        <span className="footer-edu">Edu</span>
        <span className="footer-village">Village</span>
      </h3>

      <p>
        A modern learning platform designed to help learners build
        skills through structured, guided courses.
      </p>

      {/* SOCIAL ICONS */}
      <div className="social-icons">
       <a href="https://linkedin.com" target="_blank" rel="noreferrer">🔗</a>
       <a href="https://github.com" target="_blank" rel="noreferrer">🐙</a>
  <a href="https://instagram.com" target="_blank" rel="noreferrer">📸</a>
</div>
    </div>

    {/* QUICK LINKS */}
    <div>
      <h4>Quick Links</h4>
      <p onClick={() => navigate("/")}>Home</p>
      <p onClick={() => navigate("/courses")}>Courses</p>
      <p onClick={() => navigate("/verify")}>Verify Certificate</p>
    </div>

    {/* CONTACT */}
    <div>
      <h4>Contact</h4>
      <p>📧 support@eduvillage.com</p>
      <p>📍 India</p>
    </div>

  </div>

  <div className="footer-bottom">
    Built with ❤️ for learners • © {new Date().getFullYear()} EduVillage
  </div>
</motion.footer>
    </>
  );
}