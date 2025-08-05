import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './reset-password.css'; // ✅ Import the matching CSS

export function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const email = localStorage.getItem('otpVerifiedEmail');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
        email,
        new_password: newPassword,
      });

      setMessage(response.data.message || 'Password reset successful');
      localStorage.removeItem('otpVerifiedEmail');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2s
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleSubmit} className="reset-password-form">
        <h2 className="reset-password-title">Reset Password</h2>

        <input
          type="password"
          className="reset-password-input"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          className="reset-password-input"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="reset-password-button">Reset Password</button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
