import { useFormik } from 'formik';
import './admin-login.css';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from "yup";
import axios from 'axios';

export function AdminLogin() {
  const [, setCookie] = useCookies(['adminUser']);
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object({
      username: yup.string().required("Username is required"),
      password: yup.string().required("Password is required")
    }),
    onSubmit: async (user) => {
      setError(false);
      try {
        const response = await axios.post("https://rashmiphotography.com/backend/photosharelogin.php", user);
    
        if (response.data.success) {
          // Set cookie with username
          setCookie("adminUser", response.data.username, { path: '/' });
          // 🔁 Now check subscription status
          const subResponse = await axios.get("https://rashmiphotography.com/backend/subscription-status.php", {
            params: { username: response.data.username }
          });
          if (subResponse.data.subscription_status === "active") {
            navigate("/profile");
          } else {
            navigate("/contact-admin");
          }
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
            name="username"
            placeholder="Username"
            className={`login-input ${formik.touched.username && formik.errors.username ? 'input-error' : ''}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="auth-error">{formik.errors.username}</div>
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
          <div className="auth-error text-center">Invalid username or password</div>
        )}

        <button type="submit" className="login-button">Login</button>

        <div className="text-center m-2">
          <Link className="d-block mb-2 text-white" to='/forgot-password'>Forgotten your password?</Link>
          <span>Don't have an account? <Link className="text-white" to='/signup'>Sign up</Link></span>
        </div>
      </form>
    </div>
  );
}
