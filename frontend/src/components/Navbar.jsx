import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* LOGO */}
      <div className="logo" onClick={() => navigate("/")}>
        Edu<span>Village</span>
      </div>

      {/* RIGHT MENU */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/verify">Verify</Link>

        {!token && <Link to="/login">Login</Link>}
        {!token && (
          <Link to="/signup" className="signup-btn">
            Sign Up
          </Link>
        )}

        {token && (
          <>
            <span className="nav-user">
              👋 Hello, {name}
            </span>
            <Link to="/student/dashboard">Dashboard</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </motion.nav>
  );
}