import React, { useEffect, useState } from 'react';
import '../css/tourguide.css';
import ApiClient from '../api';
import { TourDestinationSummary } from '../types/travel';
import { buildAppUrl } from '../utils/app-url';

const TourGuide: React.FC = () => {
  const [destinations, setDestinations] = useState<TourDestinationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      setError(null);

      try {
        const api = new ApiClient();
        const response = await api.getDestinations();

        if (response?.status === 'success' && Array.isArray(response?.data)) {
          setDestinations(response.data);
          return;
        }

        setDestinations([]);
        setError(response?.message || 'Failed to load destinations right now.');
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setDestinations([]);
        setError('Failed to load destinations right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="tourguide-page">
      <section className="tourguide-hero">
        <div className="tourguide-hero-overlay"></div>
        <div className="tourguide-hero-content">
          <span className="tourguide-eyebrow">Choose Your Destination</span>
          <h1>5 Tour Places, Local Guides, Better Travel Decisions</h1>
          <p>
            Pick a destination first, then open a dedicated page for that place. Customers can
            view the destination image, description, and the local guide list fetched directly
            from the database.
          </p>

          <div className="tourguide-stats">
            <div className="tourguide-stat-card">
              <strong>{loading ? '...' : destinations.length}</strong>
              <span>Tour Places</span>
            </div>
            <div className="tourguide-stat-card">
              <strong>3+</strong>
              <span>Guides Per Destination</span>
            </div>
            <div className="tourguide-stat-card">
              <strong>DB</strong>
              <span>Live Destination Data</span>
            </div>
          </div>
        </div>
      </section>

      <section className="tourguide-destinations-section">
        <div className="tourguide-section-heading">
          <span className="section-tag">Destination Based Booking</span>
          <h2>Select a Place, Then Open the Full Destination Page</h2>
          <p>
            Each card below opens a separate page where customers can see the destination details
            and the available tour guides for that exact location.
          </p>
        </div>

        {error && (
          <div className="tourguide-inline-alert">
            <strong>Destination data could not be loaded.</strong>
            <span>{error}</span>
          </div>
        )}

        <div className="destination-grid">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <article className="destination-select-card" key={`loading-${index}`}>
                <div className="destination-select-image"></div>
                <div className="destination-select-body">
                  <div className="destination-select-topline">
                    <span>Loading</span>
                    <span>...</span>
                  </div>
                  <h3>Loading destination...</h3>
                  <p>Please wait while we load destination data from the database.</p>
                </div>
              </article>
            ))
          ) : destinations.length === 0 ? (
            <div className="tourguide-preview-status">
              <h4>No destinations found</h4>
              <p>Run the destination and guide seeders so the page can show the database data.</p>
            </div>
          ) : (
            destinations.map((destination) => (
              <article className="destination-select-card" key={destination.id}>
                <div className="destination-select-image">
                  <img src={destination.image} alt={destination.title} />
                  <div className="destination-select-badge">⭐ {destination.rating}</div>
                </div>

                <div className="destination-select-body">
                  <div className="destination-select-topline">
                    <span>{destination.country}</span>
                    <span>{destination.duration}</span>
                  </div>

                  <h3>{destination.title}</h3>
                  <p>{destination.short_description}</p>

                  <div className="destination-select-meta">
                    <span>📍 {destination.location_label}</span>
                    <span>{destination.guides_count || 0} guide{destination.guides_count === 1 ? '' : 's'} available</span>
                  </div>

                  <div className="destination-select-actions">
                    <a href={buildAppUrl(`/destinations/${destination.slug}`)} className="btn-contact">
                      View Destination
                    </a>
                    <span className="destination-price">{destination.price}</span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-wrapper">
          <div className="footer-box">
            <h2 className="footer-logo">TRAVEL<span>WORLD</span></h2>
            <p>Pick the right place. Meet the right guide. Travel with confidence.</p>
            <p>Destination-first planning helps customers compare guides with real local context.</p>

            <div className="footer-social">
              <a href="#">Y</a>
              <a href="#">T</a>
              <a href="#">F</a>
              <a href="#">I</a>
            </div>
          </div>

          <div className="footer-box">
            <h3>Destinations</h3>
            <ul>
              <li>Paris</li>
              <li>Tokyo</li>
              <li>Cape Town</li>
            </ul>
          </div>

          <div className="footer-box">
            <h3>Guide Flow</h3>
            <ul>
              <li>Choose a place</li>
              <li>Compare local guides</li>
              <li>Select and book</li>
            </ul>
          </div>

          <div className="footer-box">
            <h3>Support</h3>
            <ul>
              <li>📍 Travel planning support</li>
              <li>📧 support@travelworld.com</li>
              <li>📞 +880 1700 000000</li>
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
