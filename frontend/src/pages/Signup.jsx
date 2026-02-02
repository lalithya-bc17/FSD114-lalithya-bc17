import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import civoraLogo from "../assets/civora-logo.png";
import "./Signup.css";


export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://certificate-verification-backend-7gpb.onrender.com/api/signup/student/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <img
         src={civoraLogo}
         alt="Civora Nexus"
         className="civora-logo"
        />

        {/* LOGO */}
        <div className="logo">
          <span className="edu">Edu</span>
          <span className="village">Village</span>
        </div>

        <p className="subtitle">Start your learning journey 🚀</p>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD WITH EYE */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
             className={`toggle-eye ${showPassword ? "open" : ""}`}
            onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <button type="submit">Create Account</button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}