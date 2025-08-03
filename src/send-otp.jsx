import React, { useState } from 'react';
import axios from 'axios';
import './send-otp.css';

export function SendOtp() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/send-otp',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage(response.data.message || 'OTP sent successfully');
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.errors?.email ||
        'Failed to send OTP. Please try again.';
      setError(errMsg);
    }
  };

  return (
    <div className="send-email-container">
      <form onSubmit={handleSendEmail} className="send-email-form">
        <h2 className="send-email-title">Forgot Password</h2>

        <input
          type="email"
          className="send-email-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="send-email-button">Send OTP</button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
