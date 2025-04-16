import './admin-login.css';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export function AdminLogin() {
  const [, setCookie] = useCookies(['adminUser']);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Example login logic (replace with real authentication later)
    if (username === 'admin' && password === 'admin123') {
      // Set a cookie with key "adminUser" and value as username
      setCookie('adminUser', username, { path: '/', maxAge: 3600 }); // 1 hour expiry
      navigate('/admin');
    } else {
      alert('Invalid username or password!');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">🔐 Admin Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}
