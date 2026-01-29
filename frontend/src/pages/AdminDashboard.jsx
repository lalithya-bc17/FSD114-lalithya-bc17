export default function AdminDashboard() {
  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <div className="card">
        <h3>System Management</h3>

        <ul>
          <li>
            <a
              href="https://certificate-verification-backend-7gpb.onrender.com/admin/"
              target="_blank"
              rel="noreferrer"
            >
              Open Django Admin
            </a>
          </li>

          <li>Manage Users</li>
          <li>Manage Courses</li>
          <li>View Enrollments</li>
        </ul>
      </div>
    </div>
  );
}