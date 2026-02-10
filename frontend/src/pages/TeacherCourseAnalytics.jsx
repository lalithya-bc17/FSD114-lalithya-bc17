import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherCourseAnalytics() {
  const { courseId } = useParams();
  const [rows, setRows] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetch(`${API}/teacher/course/${courseId}/analytics/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRows(data);
        } else {
          setRows([]);
        }
      });
  }, [courseId, token]);

  return (
    <div style={{ padding: "24px" }}>
      <h2>📊 Course Analytics</h2>
      <p style={{ color: "#6b7280" }}>
        Student-wise progress & certificate status
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr>
            <th style={th}>Student</th>
            <th style={th}>Progress</th>
            <th style={th}>Completed</th>
            <th style={th}>Certificate</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={td}>{r.student}</td>

              {/* Progress bar */}
              <td style={td}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={barBg}>
                    <div
                      style={{
                        ...barFill,
                        width: `${r.completion_percent}%`,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 13 }}>
                    {r.completion_percent}%
                  </span>
                </div>
              </td>

              {/* Completed badge */}
              <td style={td}>
                {r.completed ? (
                  <Badge text="Completed" type="success" />
                ) : (
                  <Badge text="Not completed" type="neutral" />
                )}
              </td>

              {/* Certificate status */}
              <td style={td}>
                {r.certificate_status === "issued" && (
                  <Badge text="Issued" type="success" />
                )}
                {r.certificate_status === "revoked" && (
                  <Badge text="Revoked" type="danger" />
                )}
                {r.certificate_status === "not_issued" && (
                  <Badge text="Not issued" type="neutral" />
                )}
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan="4" style={td}>
                No students enrolled
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- UI Helpers ---------- */

function Badge({ text, type }) {
  const styles = {
    success: {
      background: "#e6f4ea",
      color: "#166534",
    },
    danger: {
      background: "#fee2e2",
      color: "#7f1d1d",
    },
    neutral: {
      background: "#f3f4f6",
      color: "#374151",
    },
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        ...styles[type],
      }}
    >
      {text}
    </span>
  );
}

/* ---------- Styles ---------- */

const th = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #e5e7eb",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #f1f5f9",
};

const barBg = {
  width: 120,
  height: 8,
  background: "#e5e7eb",
  borderRadius: 999,
  overflow: "hidden",
};

const barFill = {
  height: "100%",
  background: "#0f766e",
  borderRadius: 999,
};