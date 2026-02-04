import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users/", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => toast.error("Failed to load users"));
  }, []);

  return (
    <div className="container">
      <h2>All Users</h2>
      {users.map(u => (
        <div key={u.id} className="card">
          <p><b>{u.username}</b></p>
          <p>{u.email}</p>
          <p>Role: {u.is_staff ? "Admin" : "Student"}</p>
        </div>
      ))}
    </div>
  );
}