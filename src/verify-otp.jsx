import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './verify-otp.css';

export function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Get email from localStorage
  const email = localStorage.getItem('reset_email');

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/verify-otp', {
        email,
        otp,
      });

      setMessage(response.data.message);

      // ✅ Store email to use in Change Password page
      localStorage.setItem('otpVerifiedEmail', email);

      // ✅ Navigate to Change Password page
      navigate('/reset-password');
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="verify-otp-container">
      <form onSubmit={handleVerifyOTP} className="verify-otp-form">
        <h2 className="verify-otp-title">Verify OTP</h2>

        <input
          type="text"
          className="verify-otp-input"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit" className="verify-otp-button">Verify OTP</button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
