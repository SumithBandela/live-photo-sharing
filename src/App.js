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
import { AddAlbum } from './add-album';
import { ForgotPassword } from './forgot-password';
import { Signup } from './sign-up';
import { AlbumPhotos } from './album-photos';
import { NotFound } from './not-found';
import { UpdateAlbum } from './update-album';
import { ContactAdmin } from './admin-contact';
import { Profile } from './profile';
import { EditProfile } from './edit-profile';
import { ProfileSetup } from './profile-setup';
import {SendOtp} from './send-otp';
//import {VerifyOtp} from './verify-otp';
import {getUserInfo} from './utils/auth';
import { PrivateRoute } from './utils/PrivateRoute';
import { NavBar } from './navbar';
function App() {
  const user = getUserInfo();
  return (
   <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path='*' element={<NotFound />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/send-email" element={<SendOtp />} />
          {/*<Route path="/reset-password/:email" element={<ResetPassword />} */}

        {/* Protected Routes (All require JWT) */}
        {user && (
          <>
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/profile-setup" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
            <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path="/contact-admin" element={<PrivateRoute><ContactAdmin /></PrivateRoute>} />
          </>
        )}

        {/* Admin-only Routes */}
        {user && (
          <>
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
            <Route path="/upload" element={<PrivateRoute><UploadPhotos /></PrivateRoute>} />
            <Route path="/albums" element={<PrivateRoute><Albums /></PrivateRoute>} />
            <Route path="/add-album" element={<PrivateRoute><AddAlbum /></PrivateRoute>} />
            <Route path="/edit-album/:id" element={<PrivateRoute><UpdateAlbum /></PrivateRoute>} />
            <Route path="/photos/:title" element={<PrivateRoute><Photos /></PrivateRoute>} />
            <Route path="/addphotos/:title" element={<PrivateRoute><AddPhotos /></PrivateRoute>} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
