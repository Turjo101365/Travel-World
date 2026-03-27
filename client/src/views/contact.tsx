import React, { useState } from 'react';
import '../css/contact.css'; // CSS import
import ApiClient from '../api';
import { secrets } from '../secrets';

const Contact: React.FC = () => {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Success / Error messages
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setSubmitting(true);

    try {
      const api = new ApiClient();
      const response = await api.submitContactMessage(name.trim(), email.trim(), message.trim());

      if (response?.status === 'success') {
        setSuccess(response.message || 'Message sent successfully!');
        // Clear form
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setError(response?.message || 'Something went wrong!');
      }
    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = err.response.data.errors as Record<string, string[]>;
        const firstError = Object.values(errors)[0]?.[0];
        setError(firstError || 'Please check your form input.');
      } else {
        setError(
          err.response?.data?.message ||
            `Cannot connect to server at ${secrets.backendEndpoint}. Please start backend and try again.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-container">

      {/* LEFT SIDE */}
      <div className="contact-left">
        <h1>Contact TravelWorld ✈️</h1>
        <p>
          Have questions about destinations, bookings or tour guides?  
          We're here to help you plan your perfect journey.
        </p>

        <div className="contact-info">
          📧 Email: support@travelworld.com <br />
          📞 Phone: +880 1234-567890 <br />
          📍 Location: Dhaka, Bangladesh
        </div>

        <a href="/" className="btn-home">← Back to Homepage</a>
      </div>

      {/* RIGHT SIDE */}
      <div className="contact-right">
        <div className="form-box">
          <h2>Send Us a Message</h2>
          <p>We’ll get back to you as soon as possible.</p>

          {success && <div className="alert success">{success}</div>}
          {error && <div className="alert error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={255}
                required
              />
            </div>

            <div className="form-group">
              <label>Your Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                required
              />
            </div>

            <div className="form-group">
              <label>Your Message</label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={2000}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};

export default Contact;
