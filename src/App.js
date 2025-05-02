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
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { AddAlbum } from './add-album';
import { ForgotPassword } from './forgot-password';
import { Signup } from './sign-up';
import { AlbumPhotos } from './album-photos';
import { NotFound } from './not-found';
import { UpdateAlbum } from './update-album';
import { ContactAdmin } from './admin-contact';
import axios from 'axios';
import { Profile } from './profile';
import { EditProfile } from './edit-profile';
import { ProfileSetup } from './profile-setup';
function App() {
  const [cookies,,removeCookie] = useCookies(['adminUser']);
  const [expanded, setExpanded] = useState(false);
  const[status, setStatus] = useState(null);
  const[profile,setProfile] = useState({});
  useEffect(()=>{
    axios.get("https://rashmiphotography.com/backend/subscription-status.php", {
      params: { username: cookies.adminUser }
    })
    .then(response=>{
      setStatus(response.data.subscription_status);
    })

    axios.get('https://rashmiphotography.com/backend/profile.php', {
      params: { username: cookies.adminUser }
  })
  .then(response => {
      setProfile(response.data);
  })
  .catch(error => {
      console.error('Error fetching profile:', error);
  });
  },[cookies.adminUser])
  
  const handleNavClick = () => {
    setExpanded(false); // Close the menu after clicking a nav link
  };

  const handleLogout = () => {
    removeCookie('adminUser', { path: '/' });
  };

  return (
    <BrowserRouter>
{(cookies.adminUser && cookies.adminUser!=="undefined" && status!=='active') && (
      <>
        <Navbar 
          collapseOnSelect 
          expand="lg"
          className="shadow-sm custom-navbar pt-3 pb-3" 
          expanded={expanded} 
        >
          <Container>
            {/* Logo Section */}
            <Navbar.Brand as={Link} to="/home" className="nav-link">
            <span className='logo'>{profile.studio_name || 'Rashmi photography'}</span>
            </Navbar.Brand>

            {/* Navbar Toggle for Mobile */}
            <Navbar.Toggle aria-controls="navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />

            {/* Navbar Links Section */}
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ms-auto">
                    
                        {/*<Nav.Item>
                          <Nav.Link as={Link} to="/gallery" onClick={handleNavClick} className="nav-link">Gallery</Nav.Link>
                        </Nav.Item> */}
                        <Nav.Item>
                          <Nav.Link as={Link} to="/admin" onClick={handleNavClick} className="nav-link">Admin Panel</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link as={Link} to="/profile" onClick={handleNavClick} className="nav-link">Profile</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link as={Link} to="/" onClick={handleLogout} className="nav-link">Logout</Nav.Link>
                      </Nav.Item>
                     
               {/* {cookies.adminUser ? "": (<Nav.Item>
                  <Nav.Link as={Link} to="/login" onClick={handleNavClick} className="nav-link">Admin Login</Nav.Link>
                </Nav.Item>)}*/}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        </>
       )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound/>}/>
        <Route path="home" element={<Home />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/album/:slug" element={<AlbumPhotos />} />
        {(cookies.adminUser && cookies.adminUser!=="undefined" && status==='active') && (
          <>
        <Route path="/admin" element={<Admin />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/profile-setup" element={<ProfileSetup/>}/>
        <Route path='/edit-profile' element={<EditProfile/>}/>
        <Route path="/upload" element={<UploadPhotos />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/add-album" element={<AddAlbum />} />
        <Route path="/edit-album/:id" element={<UpdateAlbum/>}/>
        <Route path="/photos/:title" element={<Photos />} />
        <Route path="/addphotos/:title" element={<AddPhotos />} />
        </>)}
        { (cookies.adminUser && cookies.adminUser!=='undefined') &&
        <Route path="/contact-admin" element={<ContactAdmin />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
