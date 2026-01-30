import { useEffect, useState } from "react";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetch(`${API}/courses/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, [token]);

  return (
    <div className="container">
      <h2>My Courses</h2>

      {courses.map(course => (
        <div key={course.id} className="card">
          <h3>{course.title}</h3>
        </div>
      ))}
    </div>
  );
}