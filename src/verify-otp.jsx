import React, { useState } from 'react';
import axios from 'axios';
import './verify-otp.css';
export function VerifyOTP() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/verify-otp', {
        email,
        otp,
        new_password: newPassword
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="verify-otp-container">
      <form onSubmit={handleVerifyOTP} className="verify-otp-form">
        <h2 className="verify-otp-title">Verify OTP</h2>
        <input
          type="email"
          className="verify-otp-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          className="verify-otp-input"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <input
          type="password"
          className="verify-otp-input"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="verify-otp-button">Verify & Change</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

