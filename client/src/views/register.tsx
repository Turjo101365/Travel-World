import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../css/register.css';
import ApiClient from '../api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
  }>({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Please confirm your password';
    } else if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    if (validate()) {
      setLoading(true);
      try {
        const api = new ApiClient();
        const response = await api.register(
          formData.name,
          formData.email,
          formData.password,
          formData.passwordConfirmation
        );

        if (response.status === 'success') {
          setSuccess("Registration successful! Redirecting...");
          setError('');
          // Redirect to profile after successful registration
          setTimeout(() => navigate('/profile'), 1500);
        } else {
          setError(response.message || "Something went wrong!");
          setSuccess('');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Registration failed! Please try again.");
        setSuccess('');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-background">
      {/* Background Image with zoom animation - Beach Theme for Register */}
      <div className="auth-background-image"></div>
      
      {/* Overlay for readability */}
      <div className="auth-background-overlay"></div>
      
      {/* Floating travel elements - Beach themed */}
      <div className="travel-elements">
        <span>✈️</span>
        <span>🌍</span>
        <span>🏝️</span>
        <span>⛵</span>
        <span>🌅</span>
      </div>
      
      {/* Centered Form Container */}
      <motion.div 
        className="auth-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="auth-right"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="form-box">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2>Create Account 🌟</h2>
              <p className="subtitle">Register to start your journey</p>
            </motion.div>

            {success && <motion.div 
              className="alert success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >{success}</motion.div>}
          
            {error && <motion.div 
              className="alert error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >{error}</motion.div>}

            <form onSubmit={handleSubmit}>
              <motion.div 
                className={`form-group ${errors.name ? 'has-error' : ''}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.name ? 'error' : ''}
                  id="register-name"
                />
                <label htmlFor="register-name">Full Name</label>
                <span className="input-icon">👤</span>
                {errors.name && <small className="error-text">{errors.name}</small>}
              </motion.div>

              <motion.div 
                className={`form-group ${errors.email ? 'has-error' : ''}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                  id="register-email"
                />
                <label htmlFor="register-email">Email Address</label>
                <span className="input-icon">📧</span>
                {errors.email && <small className="error-text">{errors.email}</small>}
              </motion.div>

              <motion.div 
                className={`form-group password-group ${errors.password ? 'has-error' : ''}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={errors.password ? 'error' : ''}
                  id="register-password"
                />
                <label htmlFor="register-password">Password</label>
                <span className="input-icon">🔒</span>
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
                {errors.password && <small className="error-text">{errors.password}</small>}
              </motion.div>

              <motion.div 
                className={`form-group password-group ${errors.passwordConfirmation ? 'has-error' : ''}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.passwordConfirmation ? 'error' : ''}
                  id="register-confirm-password"
                />
                <label htmlFor="register-confirm-password">Confirm Password</label>
                <span className="input-icon">🔒</span>
                <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </span>
                {errors.passwordConfirmation && <small className="error-text">{errors.passwordConfirmation}</small>}
              </motion.div>

              <motion.button 
                type="submit" 
                className="btn-login"
                disabled={loading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Registering...' : 'Register'}
              </motion.button>
            </form>

            <motion.div 
              className="bottom-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              <p>Already have an account? <Link to="/login">Login</Link></p>
              <Link to="/" className="back-home">← Back to Homepage</Link>
            </motion.div>

          </div>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default Register;
