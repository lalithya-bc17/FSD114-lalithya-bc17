import React, { useEffect, useState } from "react";
import "../styles.css";

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState(null);

  useEffect(() => {
    fetch(
      "https://certificate-verification-backend-7gpb.onrender.com/api/admin/certificates/",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setCertificates(data))
      .catch(() => console.error("Failed to load certificates"));
  }, []);

  if (!certificates) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>All Certificates</h2>

      {certificates.map((cert) => (
        <div key={cert.id} className="card">
          <p><b>Student:</b> {cert.student_name}</p>
          <p><b>Course:</b> {cert.course_title}</p>
          <p><b>Issued On:</b> {new Date(cert.issued_at).toLocaleDateString()}</p>
          <p style={{color: cert.is_revoked ? "red" : "green"}}><b>Status:</b> {cert.is_revoked ? "❌Revoked" : "✅Valid"}</p>
        </div>
      ))}
    </div>
  );
}