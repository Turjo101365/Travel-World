import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/tourguide.css';
import ApiClient from '../api';

interface Guide {
  id: number;
  name: string;
  photo: string;
  description: string;
  rating: number;
  location: string;
  experience_years: number;
  languages: string;
  hire_cost?: number;
  phone?: string;
  email?: string;
}

const TourGuide: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuides = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const api = new ApiClient();
      const response = await api.getTourGuides();

      if (response?.status === 'success' && Array.isArray(response?.data)) {
        setGuides(response.data);
        return;
      }

      setGuides([]);
      setError(response?.message || 'Failed to load tour guides. Please try again.');
    } catch (err) {
      console.error('Error fetching tour guides:', err);
      setGuides([]);
      setError('Failed to load tour guides. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  if (loading) {
    return (
      <div className="tourguide-page">
        <div className="tourguide-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div className="loading-message">Loading tour guides...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="tourguide-page">
      <div className="tourguide-container">

        {/* Left side: Branding / Info */}
        <div className="tourguide-left">
          <div className="brand-content">
            <h1>Meet Our Tour Guides</h1>
            <p>Explore destinations with the experts who know them best.</p>
          </div>
        </div>

        {/* Right side: Tour Guide Cards */}
        <div className="tourguide-right">
          <div className="cards-container">
            {error ? (
              <div className="error-state" style={{textAlign: 'center', padding: '4rem 2rem', color: '#dc3545' }}>
                <h3>Error</h3>
                <p>{error}</p>
                <button
                  type="button"
                  className="btn-contact"
                  onClick={fetchGuides}
                  style={{ marginTop: '1rem', display: 'inline-block' }}
                >
                  Retry
                </button>
              </div>
            ) : guides.length === 0 ? (
              <div className="empty-state" style={{textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
                <h3>No Tour Guides Available</h3>
                <p>Populate database with seeder on backend.</p>
              </div>
            ) : (
              guides.map((guide) => (
                <div className="tour-card" key={guide.id}>
                  <img 
                    src={guide.photo || '/images/img.jpg'} 
                    alt={guide.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/img.jpg';
                    }}
                  />
                  <h3>{guide.name}</h3>
                  <p>{guide.description}</p>

                  <div className="rating">
                    {Array.from({ length: Math.max(0, Math.min(5, guide.rating || 0)) }).map((_, i) => (
                      <span key={i}>⭐️</span>
                    ))}
                  </div>

                  <Link to={`/guide/${guide.id}`} className="btn-contact">
                    Guide Details
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-wrapper">

          <div className="footer-box">
            <h2 className="footer-logo">TRAVEL<span>WORLD</span></h2>
            <p>It's time to travel the world</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

            <div className="footer-social">
              <a href="#">Y</a>
              <a href="#">T</a>
              <a href="#">F</a>
              <a href="#">I</a>
            </div>
          </div>

          <div className="footer-box">
            <h3>Discover</h3>
            <ul>
              <li>Home</li>
              <li>About</li>
              <li>Tours</li>
            </ul>
          </div>

          <div className="footer-box">
            <h3>Quick Links</h3>
            <ul>
              <li>Gallery</li>
              <li>Login</li>
              <li>Register</li>
            </ul>
          </div>

          <div className="footer-box">
            <h3>Contact</h3>
            <ul>
              <li>📍 Address : Lorem</li>
              <li>📧 Email : xyz@mail.com</li>
              <li>📞 Phone : 00022200222</li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          © 2024 TravelWorld. All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default TourGuide;
