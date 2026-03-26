import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApiClient from "../api";
import { secrets } from "../secrets";
import "../css/forgot-password.css";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [validationMsg, setValidationMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setValidationMsg("");

    if (!email) {
      setValidationMsg("Email is required");
      return;
    }

    setSubmitting(true);
    try {
      const api = new ApiClient();
      const data = await api.requestPasswordResetCode(email.trim());

      setSuccessMsg(data?.message || "Reset code sent to your email address.");
      navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`);
    } catch (err: any) {
      if (err?.response?.status === 422 && err?.response?.data?.errors) {
        const errors = err.response.data.errors as Record<string, string[]>;
        const firstError = Object.values(errors)[0]?.[0];
        setErrorMsg(firstError || "Please check your email address.");
      } else {
        setErrorMsg(
          err?.response?.data?.message ||
            `Cannot connect to backend at ${secrets.backendEndpoint}. Start backend server and try again.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side - Travel Background - Sunset/City Theme for Forgot Password */}
      <motion.div 
        className="auth-left auth-left-forgot"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="auth-left-bg"></div>
        <div className="auth-left-overlay"></div>
        <div className="travel-elements">
          <span>✈️</span>
          <span>🌍</span>
          <span>🏝️</span>
          <span>🗺️</span>
          <span>🌅</span>
          <span>🏙️</span>
        </div>
        <div className="brand-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            TravelWorld ✈️
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Forgot your password? No worries! Reset it and continue your journey with us.
          </motion.p>
          <motion.div 
            className="brand-features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="feature-item">
              <span>🌟</span> Premium Guides
            </div>
            <div className="feature-item">
              <span>🛡️</span> Safe Travel
            </div>
            <div className="feature-item">
              <span>💫</span> Unforgettable Experiences
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side Form */}
      <motion.div 
        className="auth-right"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="form-box">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Forgot <span>Password?</span></h2>
            <p className="subtitle">Enter your email to receive a reset code in your inbox</p>
          </motion.div>

          {successMsg && <motion.div 
            className="alert success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >{successMsg}</motion.div>}
          
          {errorMsg && <motion.div 
            className="alert error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >{errorMsg}</motion.div>}

          <form onSubmit={handleSubmit}>
            <motion.div 
              className={`form-group ${validationMsg ? 'has-error' : ''}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className={validationMsg ? 'error' : ''}
                id="forgot-email"
              />
              <label htmlFor="forgot-email">Email Address</label>
              <span className="input-icon">📧</span>
              {validationMsg && <small className="error-text">{validationMsg}</small>}
            </motion.div>

            <motion.button 
              type="submit" 
              className="btn-login"
              disabled={submitting}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? "Sending..." : "Get Reset Code"}
            </motion.button>

            {successMsg && (
              <motion.div
                className="bottom-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>
                  Already received the code?{" "}
                  <Link to={`/reset-password?email=${encodeURIComponent(email.trim())}`}>
                    Continue to Reset Password
                  </Link>
                </p>
              </motion.div>
            )}

            <motion.div 
              className="bottom-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p>Remembered your password? <Link to="/login">Login</Link></p>
              <Link to="/" className="back-home">← Back to Homepage</Link>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
