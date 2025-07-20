import React, { useState } from 'react';
import axios from 'axios';
import './send-email.css'; 
function SendEmail() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/send-otp', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
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
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default SendEmail;
