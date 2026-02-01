import { useEffect, useState } from "react";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(
      "https://certificate-verification-backend-7gpb.onrender.com/api/courses/"
    )
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  return (
    <div>
      <h2>Available Courses</h2>

      {courses.length === 0 && <p>No courses available</p>}

      {courses.map(course => (
        <div key={course.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <button>Enroll</button>
        </div>
      ))}
    </div>
  );
}