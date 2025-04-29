import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import './profile-setup.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
export function ProfileSetup() {
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [message, setMessage] = useState('');
  const[cookies] = useCookies(['adminUser']);
  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      studioName: '',
      caption: '',
      whatsapp_link: '',
      instagram_link: '',
      facebook_link: '',
      email: '',
      phone: '',
      address: '',
    },validationSchema:yup.object({
      studioName:yup.string().required('Studio Name is required'),
      caption:yup.string().required('Caption is required'),
      email: yup.string().email("Invalid email").required("Email is required"),
      phone: yup.string().matches(/^\d{10}$/, "Invalid phone number").required("Phone number is required"),
      address:yup.string().required('Address is required')
    }),
    onSubmit: async (values) => {
      const form = new FormData();
      form.append('studio_name', values.studioName);
      form.append('caption', values.caption);
      form.append('whatsapp_link', values.whatsapp_link);
      form.append('instagram_link', values.instagram_link);
      form.append('facebook_link', values.facebook_link);
      form.append('email', values.email);
      form.append('phone', values.phone);
      form.append('address', values.address);
      if (logoFile) {
        form.append('logo', logoFile);
      }

      try {
        const res = await axios.post(`https://rashmiphotography.com/backend/profile-setup.php?username=${cookies.adminUser.toLowerCase()}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        alert(res.data.success);
        navigate('/profile');
      } catch (err) {
        setMessage('Failed to submit. Please try again.');
        console.error(err);
      }
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-setup-wrapper">
      <div className="profile-setup-card">
        <h2>Profile Setup</h2>
        {message && <p className="profile-setup-message">{message}</p>}
        <form onSubmit={formik.handleSubmit} className="profile-setup-form">

          <div className="profile-setup-field">
            <label>Studio Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoChange} />
            {logoPreview && (
              <img src={logoPreview} alt="Logo Preview" className="profile-logo-preview" />
            )}
          </div>

          <div className="profile-setup-field">
            <label>Studio Name *</label>
            <input type="text" name="studioName" value={formik.values.studioName} onChange={formik.handleChange} />
            {formik.touched.studioName && formik.errors.studioName && (
            <div className="profile-error">{formik.errors.studioName}</div>
          )}
          </div>

          <div className="profile-setup-field">
            <label>Caption *</label>
            <input type="text" name="caption" value={formik.values.caption} onChange={formik.handleChange} />
            {formik.touched.caption && formik.errors.caption && (
            <div className="profile-error">{formik.errors.caption}</div>
          )}
          </div>

          <div className="profile-setup-field">
            <label>WhatsApp Link</label>
            <input type="url" name="whatsapp_link" value={formik.values.whatsapp_link} onChange={formik.handleChange} />
          </div>

          <div className="profile-setup-field">
            <label>Instagram Link</label>
            <input type="url" name="instagram_link" value={formik.values.instagram_link} onChange={formik.handleChange} />
          </div>

          <div className="profile-setup-field">
            <label>Facebook Link</label>
            <input type="url" name="facebook_link" value={formik.values.facebook_link} onChange={formik.handleChange} />
          </div>

          <div className="profile-setup-field">
            <label>Email *</label>
            <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} />
            {formik.touched.email && formik.errors.email && (
            <div className="profile-error">{formik.errors.email}</div>
          )}
          </div>

          <div className="profile-setup-field">
            <label>Phone *</label>
            <input type="tel" name="phone" value={formik.values.phone} onChange={formik.handleChange} />
            {formik.touched.phone && formik.errors.phone && (
            <div className="profile-error">{formik.errors.phone}</div>
          )}
          </div>

          <div className="profile-setup-field">
            <label>Address *</label>
            <textarea name="address" value={formik.values.address} onChange={formik.handleChange}></textarea>
            {formik.touched.address && formik.errors.address && (
            <div className="profile-error">{formik.errors.address}</div>
          )}
          </div>

          <button type="submit" className="profile-setup-button">Save Profile</button>
        </form>
      </div>
    </div>
  );
}
