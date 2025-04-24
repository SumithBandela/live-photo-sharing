import './home.css';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">📸 Rashmi Photography - Live Photo Sharing Platform</h1>
        <p className="home-subtitle">
          Instantly share and access your captured memories online — fast, secure, and beautifully presented.
        </p>

        <div className="home-section">
          <h2 className="section-title">📂 Admin Upload & Control</h2>
          <p>
            <Link to="/login" className="nav-link text-decoration-underline">Log in as an Admin</Link> to upload event photos, create private albums,
            manage user access, and respond to client enquiries in real time.
          </p>
        </div>

        <div className="home-section">
          <h2 className="section-title">📤 Live Photo Sharing</h2>
          <p>
            Experience your special moments in real time! We offer instant photo sharing during events, so you and your guests can view, download, and relive memories on the spot. No waiting — just click, capture, and cherish.
          </p>
        </div>


        <div className="home-section">
          <h2 className="section-title">🎉 Why Choose Rashmi Photography?</h2>
          <ul>
            <li>Real-time photo sharing during events</li>
            <li>Secure, private, and personalized galleries</li>
            <li>Instant QR-code based access</li>
            <li>Mobile-friendly, modern dashboard</li>
            <li>Custom permission management for every client</li>
            <li>High-resolution photo downloads</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
