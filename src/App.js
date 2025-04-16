import './App.css';

import {HashRouter as BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import { Home } from './home';
import { Admin } from './admin';
import { Gallery } from './gallery';
import { AdminLogin } from './admin-login';
import { UploadPhotos } from './upload-photos';
import { Albums } from './albums';
import { AddPhotos } from './add-photos';
import { Photos } from './photos';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState } from 'react';
function App() {
  const [expanded, setExpanded] = useState(false);
  const handleNavClick = () => {
    setExpanded(false); // Close the menu after clicking a nav link
  };
  return (
    <BrowserRouter>

        <Navbar 
          collapseOnSelect 
          expand="lg"
          className="shadow-sm custom-navbar pt-3 pb-3" 
          expanded={expanded} 
        >
          <Container>
            {/* Logo Section */}
            <Navbar.Brand as={Link} to="/home" className="nav-link">
            <span className='logo'>Rashmi Photography</span>
            </Navbar.Brand>

            {/* Navbar Toggle for Mobile */}
            <Navbar.Toggle aria-controls="navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />

            {/* Navbar Links Section */}
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ms-auto">
                <Nav.Item>
                  <Nav.Link as={Link} to="/home" onClick={handleNavClick} className="nav-link">Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/gallery" onClick={handleNavClick} className="nav-link">Gallery</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/albums" onClick={handleNavClick} className="nav-link">Albums</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/login" onClick={handleNavClick} className="nav-link">Admin Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/admin" onClick={handleNavClick} className="nav-link">Admin Panel</Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/upload" element={<UploadPhotos />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/add" element={<AddPhotos />} />
        <Route path="/photos/:albumId" element={<Photos />} />
        <Route path="/addphotos/:albumId" element={<AddPhotos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
