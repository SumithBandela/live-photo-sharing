import { useFormik } from 'formik';
import './auth.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import * as yup from "yup";
import { Link, useNavigate } from 'react-router-dom';
export function Signup() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [existingUsers, setExistingUsers] = useState([]);

  useEffect(() => {
    axios
      .get("https://rashmiphotography.com/backend/password_recover.php")
      .then((res) => {
        if (res.data.success && res.data.data) {
          setExistingUsers(res.data.data.map(user => user.username.toLowerCase()));
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    username: yup
    .string()
    .required("Username is required")
    .matches(/^[^.]*$/, "Username cannot contain a dot (.)")
    .test("unique-username", "Username already taken", function (value) {
      return !existingUsers.includes(value?.toLowerCase());
    }),
  
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (formData, { resetForm, setSubmitting }) => {
      formData.username = formData.username.toLowerCase();
      try {
        const response = await axios.post(
          "https://rashmiphotography.com/backend/signup.php",
          formData,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success) {
          setMessage("User registered successfully.");
          resetForm();
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setMessage(response.data.message || "Failed to register.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setMessage("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={formik.handleSubmit}>
        <h2 className="auth-title">Sign Up</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Full Name"
            className={`auth-input ${formik.touched.name && formik.errors.name ? "input-error" : ""}`}
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="auth-error">{formik.errors.name}</div>
          )}
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            className={`auth-input ${formik.touched.username && formik.errors.username ? "input-error" : ""}`}
            name="username"
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
            placeholder="Password"
            className={`auth-input ${formik.touched.password && formik.errors.password ? "input-error" : ""}`}
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="auth-error">{formik.errors.password}</div>
          )}
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Confirm Password"
            className={`auth-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "input-error" : ""}`}
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="auth-error">{formik.errors.confirmPassword}</div>
          )}
        </div>

        <button type="submit" className="auth-button" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Creating..." : "Create Account"}
        </button>

        {message && <p className="auth-success">{message}</p>}
        <div className="text-center">
        <span className="d-block m-2">
          Have an account? <Link to="/login" className='text-white'>Log in</Link>
        </span>
        </div>
      </form>
    </div>
  );
}
