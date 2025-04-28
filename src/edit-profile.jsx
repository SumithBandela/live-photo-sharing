import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './edit-profile.css';
import { useCookies } from 'react-cookie';
import { useFormik } from 'formik';

export function EditProfile() {
    const [cookies] = useCookies(['adminUser']);
    const [profile, setProfile] = useState({});
    const [logoFile, setLogoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (cookies.adminUser) {
            axios.get('https://rashmiphotography.com/backend/profile.php', {
                params: { username: cookies.adminUser.toLowerCase() }
            })
            .then(response => {
                setProfile(response.data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
        }
    }, [cookies.adminUser]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            caption: profile.caption || '',
            whatsapp_link: profile.whatsapp_link || '',
            instagram_link: profile.instagram_link || '',
            facebook_link: profile.facebook_link || '',
            phone: profile.phone || '',
            email: profile.email || '',
            address: profile.address || ''
        },
        onSubmit: async (values) => {
            setLoading(true);
            setSuccessMessage('');
            setErrorMessage('');
            
            try {
                const formData = new FormData();
                formData.append('username', cookies.adminUser.toLowerCase());
                formData.append('caption', values.caption);
                formData.append('whatsapp_link', values.whatsapp_link);
                formData.append('instagram_link', values.instagram_link);
                formData.append('facebook_link', values.facebook_link);
                formData.append('phone', values.phone);
                formData.append('email', values.email);
                formData.append('address', values.address);
                if (logoFile) {
                    formData.append('logo', logoFile);
                }

                const response = await axios.post('https://rashmiphotography.com/backend/profile.php', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.success) {
                    setSuccessMessage('Profile updated successfully!');
                } else {
                    setErrorMessage(response.data.error || 'Failed to update profile.');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                setErrorMessage('Something went wrong. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setLogoFile(file);
        }
    };

    return (
        <div className="edit-profile-page">
            <div className="edit-profile-container">
                <h2>Edit Profile</h2>

                {successMessage && <div className="success-message">{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <label>Studio Logo</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="form-group">
                        <label>Caption</label>
                        <input type="text" name="caption" value={formik.values.caption} onChange={formik.handleChange} />
                    </div>

                    <div className="form-group">
                        <label>WhatsApp Link</label>
                        <input type="url" name="whatsapp_link" value={formik.values.whatsapp_link} onChange={formik.handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Instagram Link</label>
                        <input type="url" name="instagram_link" value={formik.values.instagram_link} onChange={formik.handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Facebook Link</label>
                        <input type="url" name="facebook_link" value={formik.values.facebook_link} onChange={formik.handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" value={formik.values.phone} onChange={formik.handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <textarea name="address" value={formik.values.address} onChange={formik.handleChange}></textarea>
                    </div>

                    <div className="form-group">
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
