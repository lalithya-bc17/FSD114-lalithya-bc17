import React, { useEffect, useState } from "react";
import "../styles.css";

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState(null);

  useEffect(() => {
    fetch(
      "https://certificate-verification-backend-7gpb.onrender.com/api/admin/enrollments/",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setEnrollments(data))
      .catch(() => console.error("Failed to load enrollments"));
  }, []);

  if (!enrollments) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>All Enrollments</h2>

      {enrollments.map((enroll) => (
        <div key={enroll.id} className="card">
          <p><b>Student:</b> {enroll.student_name}</p>
          <p><b>Course:</b> {enroll.course_title}</p>
            <p><strong>Date:</strong> {new Date(enroll.enrolled_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}