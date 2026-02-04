import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("/api/courses/", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
    })
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(() => toast.error("Failed to load courses"));
  }, []);

  return (
    <div className="container">
      <h2>All Courses</h2>
      {courses.map(course => (
        <div key={course.id} className="card">
          <h4>{course.title}</h4>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
}