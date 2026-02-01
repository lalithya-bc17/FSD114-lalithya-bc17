import { useState } from "react";

export default function Verify() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState(null);

  const verifyCertificate = async () => {
    const res = await fetch(
      `https://certificate-verification-backend-7gpb.onrender.com/api/certificate/verify/${certId}/`
    );
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>Verify Certificate</h2>

      <input
        placeholder="Enter Certificate ID"
        value={certId}
        onChange={(e) => setCertId(e.target.value)}
      />

      <button onClick={verifyCertificate}>Verify Certificate</button>

      {result && (
        <div>
          <p><b>Name:</b> {result.student_name}</p>
          <p><b>Course:</b> {result.course}</p>
          <p><b>Status:</b> Valid</p>
        </div>
      )}
    </div>
  );
}