import { useFormik } from 'formik';
import './auth.css';
import axios from 'axios';
import { useState } from 'react';

export function Signup() {
  const [message, setMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      password: ''
    },
    onSubmit: async (formData) => {
      try {
        const response = await axios.post(
          'https://rashmiphotography.com/backend/signup.php',
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    
        const data = response.data;
    
        if (data.success) {
          setMessage('User registered successfully!');
          formik.resetForm();
        } else {
          setMessage(data.message || 'Registration failed.');
          console.warn('Server Response:', data);
        }
    
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error('Server Error:', error.response.data);
          setMessage(error.response.data.message || 'Server Error');
        } else if (error.request) {
          // Request made but no response received
          console.error('No response:', error.request);
          setMessage('No response from server');
        } else {
          console.error('Error', error.message);
          setMessage('Unexpected error occurred');
        }
      }
    }
    
    
  });

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={formik.handleSubmit}>
        <h2 className="auth-title">Sign Up</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="auth-input"
          required
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />

        <input
          type="text"
          placeholder="Username"
          className="auth-input"
          required
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
        />

        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          required
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />

        <button type="submit" className="auth-button">Create Account</button>

        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
}
