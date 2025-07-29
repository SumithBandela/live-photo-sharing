import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo, removeToken } from './utils/auth';
import './navbar.css';

export function NavBar() {
  const navigate = useNavigate();
  const user = getUserInfo();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-custom shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/profile">
          {user.name}'s Dashboard
        </Link>

        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-logout ms-3" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
