import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API}/admin/courses/?search=${search}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
    })
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(() => toast.error("Failed to load courses"));
  }, [search]);

  return (
    <div className="container">
      <h2>All Courses</h2>

      {/* 🔍 SEARCH BOX */}
      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      {courses.length === 0 && <p>No courses found</p>}

      {courses.map(course => (
        <div key={course.id} className="card">
          <h4>{course.title}</h4>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
}