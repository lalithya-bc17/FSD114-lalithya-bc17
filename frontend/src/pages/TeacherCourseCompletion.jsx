import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherCourseCompletion() {
  const [rows, setRows] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetch(`${API}/teacher/course-completion/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch(() => {});
  }, [token]);

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📊 Course-wise Completion</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "12px",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr style={{ background: "#f5f7fa" }}>
            <th style={th}>Course</th>
            <th style={th}>Students</th>
            <th style={th}>Completed %</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {/* COURSE COLUMN */}
              <td style={td}>
                <div style={{ fontWeight: 600 }}>{r.course}</div>

                {/* analytics link (UI only, no logic change) */}
                <Link
                  to={`/teacher/course/${r.course_id}/analytics`}
                  style={{
                    fontSize: "12px",
                    color: "#0f766e",
                    textDecoration: "none",
                  }}
                >
                  View analytics →
                </Link>
              </td>

              {/* STUDENTS */}
              <td style={td}>{r.students}</td>

              {/* COMPLETION */}
              <td style={td}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "8px",
                      background: "#e5e7eb",
                      borderRadius: "6px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${r.completion}%`,
                        height: "100%",
                        background: "#1B9AAA",
                      }}
                    />
                  </div>
                  <span>{r.completion}%</span>
                </div>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan="3" style={td}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};