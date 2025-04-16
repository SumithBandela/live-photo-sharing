import { Link } from 'react-router-dom';
import './admin.css';

export function Admin() {
  return (
    <div className="admin-container">
      <div className="admin-panel">
        <h1 className="admin-title">🖼️ Gallery Management</h1>
        <p className="admin-subtitle">Create and manage photo albums.</p>

        <div className="admin-options">
          <Link to="/albums" className="admin-card text-white text-decoration-none">📁 Manage Albums</Link>
        </div>
      </div>
    </div>
  );
}
