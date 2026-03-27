import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ApiClient from '../api';
import { secrets } from '../secrets';
import '../css/reset-password.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get('email') || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const normalizeCode = (value: string) => value.replace(/\s+/g, '').trim().toLowerCase();

  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    setResendMsg("");

    if (!email.trim()) {
      setError("Enter your email first to resend code.");
      return;
    }

    setResending(true);
    try {
      const api = new ApiClient();
      const response = await api.requestPasswordResetCode(email.trim());
      setResendMsg(
        response?.message || "A new reset code has been sent to your email. Use the latest email code only."
      );
    } catch (err: any) {
      if (err?.response?.status === 422 && err?.response?.data?.errors) {
        const errors = err.response.data.errors as Record<string, string[]>;
        const firstError = Object.values(errors)[0]?.[0];
        setError(firstError || "Please check your email.");
      } else {
        setError(
          err?.response?.data?.message ||
            `Cannot connect to backend at ${secrets.backendEndpoint}. Start backend server and try again.`
        );
      }
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResendMsg("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    const normalizedCode = normalizeCode(code);

    if (!normalizedCode) {
      setError("Reset code is required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const api = new ApiClient();
      const response = await api.resetPassword(
        email.trim(),
        normalizedCode,
        password,
        confirmPassword
      );

      setSuccess(response?.message || "Password reset successful! You can now log in.");
      setCode("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (err: any) {
      if (err?.response?.status === 422 && err?.response?.data?.errors) {
        const errors = err.response.data.errors as Record<string, string[]>;
        const firstError = Object.values(errors)[0]?.[0];
        setError(firstError || "Please check your input.");
      } else {
        setError(
          err?.response?.data?.message ||
            `Cannot connect to backend at ${secrets.backendEndpoint}. Start backend server and try again.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>
          Reset <span>Password</span>
        </h2>
        <p className="subtitle">Create a new secure password</p>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        {resendMsg && <div className="alert success">{resendMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email Address</label>
          </div>

          <div className="form-group">
            <span className="input-icon">🔢</span>
            <input
              type="text"
              placeholder=" "
              value={code}
              onChange={(e) => setCode(normalizeCode(e.target.value))}
              required
            />
            <label>Reset Code</label>
          </div>

          <button
            type="button"
            className="btn-resend-code"
            onClick={handleResendCode}
            disabled={resending || submitting}
          >
            {resending ? "Resending..." : "Resend Code To Email"}
          </button>

          <div className="form-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>New Password</label>
          </div>

          <div className="form-group">
            <span className="input-icon">🔑</span>
            <input
              type="password"
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm Password</label>
          </div>

          <button type="submit" className="btn-reset" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className="bottom-text">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
