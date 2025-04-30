import { useCookies } from 'react-cookie';
import './admin-contact.css'
import { useNavigate } from 'react-router-dom';
export function ContactAdmin() {
   const[,removeCookie] = useCookies(['adminUser']);
   let navigate = useNavigate();
   function handleLogout()
   {
    removeCookie('adminUser');
    navigate('/home');
   }
    return (
      <div className="contact-admin-container">
        <h2 className="contact-admin-header">Subscription Required</h2>
        <p className="contact-admin-message">
          Your account does not have an active subscription. Please contact admin to activate your access.
          If you believe this is an error or need assistance, feel free to reach out to us via email at 
          <a href="contactus@rashmiphotography.com" className="contact-admin-email ms-2">contactus@rashmiphotography.com</a> or use the 
          contact form below. We will assist you promptly to ensure your account gets back online.
        </p>
        <button className="btn-complete-profile" onClick={handleLogout}>
          logout
          </button>
      </div>
    );
  }
  