import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react"; // 🔴 NEW
import "../styles.css";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api"; // 🔴 NEW

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const [unreadCount, setUnreadCount] = useState(0); // 🔴 NEW

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔴 NEW — fetch unread notification count
  useEffect(() => {
    if (!token) return;

    fetch(`${API}/notifications/unread-count/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.count || 0))
      .catch(() => {});
  }, [token]);

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

        <Link to={role === "teacher" ? "/teacher/courses" : "/courses"}>
          Courses
        </Link>

        

        {/* 🔔 NOTIFICATIONS WITH RED BADGE */}
          <Link to="/notifications" style={{ position: "relative", fontSize: "18px" }}
           className={unreadCount > 0 ? "bell-animate" : ""}
          >
           🔔

          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-14px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              {unreadCount}
            </span>
          )}
        </Link>

        {!token && <Link to="/login">Login</Link>}
        {!token && (
          <Link to="/signup" className="signup-btn">
            Sign Up
          </Link>
        )}

        {token && (
          <>
            <span className="nav-user">👋 Hello, {name}</span>

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

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </motion.nav>
  );
}