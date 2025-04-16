import './auth.css';

export function Signup() {
  return (
    <div className="auth-container">
      <form className="auth-form">
        <h2 className="auth-title">Sign Up</h2>
        <input type="text" placeholder="Full Name" className="auth-input" required />
        <input type="email" placeholder="Email" className="auth-input" required />
        <input type="password" placeholder="Password" className="auth-input" required />
        <button type="submit" className="auth-button">Create Account</button>
      </form>
    </div>
  );
}
