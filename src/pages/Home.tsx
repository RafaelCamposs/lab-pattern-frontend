import './Dashboard.css';

export default function Home() {
  return (
    <div className="page-container">
      <h1>Welcome to Your Dashboard</h1>
      <div className="content-grid">
        <div className="card">
          <h2>Getting Started</h2>
          <p>
            Welcome! Start your coding journey by exploring different sections
            of the platform.
          </p>
        </div>
        <div className="card">
          <h2>Recent Activity</h2>
          <p>Your recent activities will appear here.</p>
          <ul>
            <li>No recent activity</li>
          </ul>
        </div>
        <div className="card">
          <h2>Quick Stats</h2>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Challenges Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Practice Sessions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
