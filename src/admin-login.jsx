import { useFormik } from 'formik';
import './admin-login.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as yup from "yup";
import axios from 'axios';

export function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Invalid email").required("Email is required"),
      password: yup.string().required("Password is required")
    }),
    onSubmit: async (user) => {
      setError(false);
      try {
        const response = await axios.post("http://localhost:8080/auth/login", user); // 👈 Update with your actual backend URL
        if (response.data.success) {
          // Store token in localStorage
          localStorage.setItem('token', response.data.token);
          // Optionally store user data
          localStorage.setItem('userEmail', response.data.email);
          localStorage.setItem('userName', response.data.name);

          // ✅ Navigate to dashboard
          navigate("/admin");
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Login error:", err);
        setError(true);
      }
    }
  });

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={formik.handleSubmit}>
        <h2 className="login-title">🔐 Admin Login</h2>

        <div className="input-group">
          <input
            type="text"
            name="email"
            placeholder="Email"
            className={`login-input ${formik.touched.email && formik.errors.email ? 'input-error' : ''}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="auth-error">{formik.errors.email}</div>
          )}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`login-input ${formik.touched.password && formik.errors.password ? 'input-error' : ''}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="auth-error">{formik.errors.password}</div>
          )}
        </div>

        {error && (
          <div className="auth-error text-center">Invalid email or password</div>
        )}

        <button type="submit" className="login-button">Login</button>

        <div className="text-center m-2">
          <Link className="d-block mb-2 text-white" to='/send-email'>Forgotten your password?</Link>
          <span>Don't have an account? <Link className="text-white" to='/signup'>Sign up</Link></span>
        </div>
      </form>
    </div>
  );
}
