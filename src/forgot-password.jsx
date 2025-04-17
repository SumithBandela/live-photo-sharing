import { useFormik } from 'formik';
import './auth.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { useState } from 'react';
export function ForgotPassword() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setError("");
      setSuccess("");

      if (values.username.toLowerCase() === "admin") {
        setError("Password change for admin is not allowed.");
        return;
      }

      try {
        const userResponse = await axios.get(
          `https://rashmiphotography.com/backend/password_recover.php`,
          {
            params: { username: values.username },
          }
        );

        if (userResponse.data.success && userResponse.data.exists) {
          const updateResponse = await axios.post(
            "https://rashmiphotography.com/backend/password_recover.php",
            {
              username: values.username,
              password: values.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (updateResponse.data.success) {
            setSuccess("Password updated successfully.");
            resetForm();
            setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
          } else {
            setError(updateResponse.data.message || "Failed to update password.");
          }
        } else {
          setError("Username not found.");
        }
      } catch (err) {
        setError("Server error. Please try again later.");
      }
    },
  });

  return (
    <div className="auth-container input-group">
      <form className="auth-form" onSubmit={formik.handleSubmit}>
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtext">Enter your username to reset your password</p>

        <input
          type="text"
          placeholder="Username"
          className={`auth-input ${formik.touched.username && formik.errors.username ? "input-error" : ""}`}
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && (
          <div className="auth-error">{formik.errors.username}</div>
        )}

        <input
          type="password"
          placeholder="New Password"
          className="auth-input"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="auth-error">{formik.errors.password}</div>
        )}

        <input
          type="password"
          placeholder="Confirm New Password"
          className="auth-input"
          name="confirmPassword"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="auth-error">{formik.errors.confirmPassword}</div>
        )}

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <button type="submit" className="auth-button">Reset Password</button>
        <div className="text-center mt-3">
                <Link to="/signup" className='text-white'>Create new account</Link>
                <Link to="/login" className="d-block my-2 text-white">Back to login</Link>
        </div>
      </form>
    </div>
  );
}