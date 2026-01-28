import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import "../styles.css";
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(username, password);

      // ✅ JWT received
      if (data.access) {
        // ✅ Store tokens correctly
        localStorage.setItem("access", data.access);
        if (data.refresh) {
          localStorage.setItem("refresh", data.refresh);
        }

        // ✅ Store role (student / teacher / admin)
        localStorage.setItem("role", data.role);

        // ✅ Role-based redirect
        if (data.role === "student") {
          navigate("/student/dashboard");
        } else if (data.role === "teacher") {
          navigate("/teacher/dashboard");
        } else if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          // fallback
          navigate("/");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="container">
      <h2>EduVillage Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}