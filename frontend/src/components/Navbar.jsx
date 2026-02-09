import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role"); // student | teacher | admin

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

      {/* LINKS */}
      <div className="nav-links">
        <Link to="/">Home</Link>

        {/* ⭐ ROLE-BASED COURSES (TEXT LINK, NOT BUTTON) */}
        <Link to={role === "teacher" ? "/teacher/courses" : "/courses"}>
          Courses
        </Link>

        <Link to="/verify">Verify</Link>
        <Link to="/notifications">Notifications</Link>

        {!token && <Link to="/login">Login</Link>}
        {!token && (
          <Link to="/signup" className="signup-btn">
            Sign Up
          </Link>
        )}

        {token && (
          <>
            {/* 👋 TEXT ONLY — NO BUTTON */}
            <span className="nav-user">👋 Hello, {name}</span>

            {/* ROLE-BASED DASHBOARD */}
            <Link
              to={
                role === "teacher"
                  ? "/teacher/dashboard"
                  : role === "admin"
                  ? "/admin/dashboard"
                  : "/student/dashboard"
              }
            >
              Dashboard
            </Link>

            {/* LOGOUT can stay button or link */}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </motion.nav>
  );
}