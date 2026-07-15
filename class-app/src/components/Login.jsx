import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === "admin" && password === "ganesh123") {
      onLogin(username);
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card-container">
        <div className="login-brand">
          <div className="login-logo-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="login-logo-svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h1>GANESH FINANCE</h1>
          <p className="login-tagline">LOAN HUMARA • TENSION AAPKA</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-form-title">Portal Sign In</h2>
          <p className="login-form-subtitle">Enter your administrative credentials to manage accounts.</p>

          {error && (
            <div className="login-error-alert">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="error-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="login-field-group">
            <label htmlFor="username">Username</label>
            <div className="login-input-wrapper">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="e.g. admin"
                required
              />
            </div>
          </div>

          <div className="login-field-group">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            Secure Log In
          </button>
        </form>

        <div className="login-helper-box">
          <h3>🔐 Development credentials</h3>
          <p>
            Username: <strong>admin</strong> <br />
            Password: <strong>ganesh123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
