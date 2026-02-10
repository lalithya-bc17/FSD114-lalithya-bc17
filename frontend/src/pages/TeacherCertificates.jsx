import { useEffect, useState } from "react";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherCertificates() {
  const [certs, setCerts] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetch(`${API}/teacher/certificates/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setCerts(data));
  }, [token]);

  const revoke = (id) => {
    fetch(`${API}/teacher/certificates/${id}/revoke/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setCerts(prev =>
        prev.map(c =>
          c.id === id ? { ...c, is_revoked: true } : c
        )
      );
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📜 Certificates</h2>
      <p style={{ color: "#666" }}>
        View & manage student certificates for your courses
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
        <thead>
          <tr>
            <th style={th}>Student</th>
            <th style={th}>Course</th>
            <th style={th}>Certificate ID</th>
            <th style={th}>Issued At</th>
            <th style={th}>Status</th>
            <th style={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {certs.map(c => (
            <tr key={c.id}>
              <td style={td}>{c.student}</td>
              <td style={td}>{c.course}</td>
              <td style={td}>
              
  <span
    title={c.id}
    style={{
      backgroundColor: c.is_revoked ? "#fecaca" : "transparent",
      color: c.is_revoked ? "#7f1d1d" : "inherit",
      opacity: c.is_revoked ? 0.7 : 1,
      color: "#1e40af",
      fontFamily:"monospace",
      fontSize: "15px",
      fontWeight: "500",
      whiteSpace: "normal",
      wordBreak: "break-all",
      userSelect: "text",
      cursor: "text",
    }}
  >
    {c.id}
  </span>
</td>
  


<td style={td}>
  {c.issued_at
    ? new Date(c.issued_at).toLocaleString()
    : "—"}
</td>
              <td style={td}>
  {c.is_revoked ? (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        backgroundColor: "#fee2e2",
        color: "#7f1d1d",
        fontSize: "13px",
        fontWeight: 600,
      }}
    >
      Revoked
    </span>
  ) : (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        backgroundColor: "#e6f4ea",
        color: "#166534",
        fontSize: "13px",
        fontWeight: 600,
      }}
    >
      Active
    </span>
  )}
</td>
              <td style={td}>
  {c.is_revoked ? (
    <span style={{ color: "#9ca3af", fontSize: "14px" }}>
      —
    </span>
  ) : (
    <button
      onClick={() => revoke(c.id)}
      style={{
        padding: "6px 14px",
        borderRadius: "8px",
        backgroundColor: "#0f766e",
        color: "#ffffff",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      Revoke
    </button>
  )}
</td>
            </tr>
          ))}

          {certs.length === 0 && (
            <tr>
              <td colSpan="6" style={td}>No certificates</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};