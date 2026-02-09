import { useEffect, useState } from "react";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) return;

    fetch(`${API}/teacher/students/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch students");
        }
        return res.json();
      })
      .then((data) => setStudents(data))
      .catch((err) => {
        console.error(err);
        setStudents([]);
      });
  }, [token]);

  return (
    <div className="container">
      <h2>👨‍🎓 Enrolled Students</h2>

      {students.length === 0 ? (
        <p>No students enrolled</p>
      ) : (
        students.map((s, index) => (
          <div key={index} className="card">
            <p><b>Name:</b> {s.student}</p>
            <p><b>Course:</b> {s.course}</p>
            <p><b>Progress:</b> {s.progress}%</p>
          </div>
        ))
      )}
    </div>
  );
}