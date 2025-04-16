import './auth.css';

export function ForgotPassword() {
  return (
    <div className="auth-container">
      <form className="auth-form">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtext">Enter your registered email to reset your password</p>
        <input type="email" placeholder="Email" className="auth-input" required />
        <button type="submit" className="auth-button">Send Reset Link</button>
      </form>
    </div>
  );
}
