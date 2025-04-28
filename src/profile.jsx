import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";
import { useCookies } from "react-cookie";

export function Profile() {
  const navigate = useNavigate();
  const[cookies] = useCookies(['adminUser']);
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    // Replace 'sumith' with dynamic username if needed
    axios.get('https://rashmiphotography.com/backend/profile.php', {
        params: { username: cookies.adminUser.toLowerCase()}
    })
    .then(response => {
        setProfile(response.data);
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });
}, [cookies.adminUser]);


  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          {profile.logo_url && (
            <img
              src={`https://rashmiphotography.com/${profile.logo_url}`}
              alt="Studio Logo"
              className="profile-logo"
            />
          )}
          <h1 className="studio-name">{profile.studio_name}</h1>
          <h2 className="profile-caption">{profile.caption}</h2>
        </div>

        <div className="profile-info">
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Address:</strong> {profile.address}</p>

          <div className="profile-links">
            {profile.whatsapp_link && (
              <a href={profile.whatsapp_link} target="_blank" rel="noreferrer" className="social-link whatsapp">WhatsApp</a>
            )}
            {profile.instagram_link && (
              <a href={profile.instagram_link} target="_blank" rel="noreferrer" className="social-link instagram">Instagram</a>
            )}
            {profile.facebook_link && (
              <a href={profile.facebook_link} target="_blank" rel="noreferrer" className="social-link facebook">Facebook</a>
            )}
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-btn" onClick={() => navigate('/edit-profile')}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
