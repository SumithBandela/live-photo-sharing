import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './home';
import { Admin } from './admin';
import { Gallery } from './gallery';
import { AdminLogin } from './admin-login';
import { UploadPhotos } from './upload-photos';
import { Albums } from './albums';
import { AddPhotos } from './add-photos';
import { Photos } from './photos';

function App() {
  return (
    <Router>
      {/* NavBar */}
      <nav className="custom-navbar">
        <div className="logo">
          <Link to="/" className="nav-link">RSPhotography</Link>
        </div>
        <ul className="nav-list">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/gallery" className="nav-link">Gallery</Link>
          </li>
          <li>
            <Link to="/albums" className="nav-link">Albums</Link>
          </li>
          <li>
            <Link to="/login" className="nav-link">Admin Login</Link>
          </li>
          <li>
            <Link to="/admin" className="nav-link">Admin Panel</Link>
          </li>
        </ul>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/upload" element={<UploadPhotos />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/add" element={<AddPhotos />} />
        <Route path="/photos/:albumId" element={<Photos />} />
        <Route path="/addphotos/:albumId" element={<AddPhotos />} />
      </Routes>
    </Router>
  );
}

export default App;
