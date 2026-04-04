import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiClient from '../api';
import { TourDestinationSummary } from '../types/travel';
import '../css/destination-details.css';
import { buildAppUrl } from '../utils/app-url';

const DestinationDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [destination, setDestination] = useState<TourDestinationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestination = async () => {
      if (!slug) {
        setDestination(null);
        setError('Destination not found.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const api = new ApiClient();
        const response = await api.getDestination(slug);

        if (response?.status === 'success' && response?.data) {
          setDestination(response.data);
          return;
        }

        setDestination(null);
        setError(response?.message || 'Destination not found.');
      } catch (err) {
        console.error('Error fetching destination:', err);
        setDestination(null);
        setError('Failed to load destination details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [slug]);

  if (loading) {
    return (
      <div className="destination-details-page">
        <div className="destination-details-shell">
          <div className="destination-status-card">
            <h2>Loading destination...</h2>
            <p>Please wait while we load the destination details and local guide list.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="destination-details-page">
        <div className="destination-details-shell">
          <div className="destination-status-card">
            <h2>Destination not found</h2>
            <p>The place you are looking for is not available right now.</p>
            <a href={buildAppUrl('/tourguide')} className="destination-primary-btn">
              Back to Destinations
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="destination-details-page">
      <div className="destination-details-shell">
        <div className="destination-page-actions">
          <a href={buildAppUrl('/tourguide')} className="destination-back-link">
            ← Back to Destinations
          </a>
        </div>

        <section className="destination-hero-card">
          <div className="destination-hero-image-wrap">
            <img src={destination.image} alt={destination.title} />
          </div>

          <div className="destination-hero-content">
            <span className="destination-badge">{destination.country}</span>
            <h1>{destination.title}</h1>
            <p className="destination-location">📍 {destination.location_label}</p>
            <p className="destination-description">{destination.description}</p>

            <div className="destination-summary-row">
              <div className="destination-summary-card">
                <strong>{destination.duration}</strong>
                <span>Suggested Stay</span>
              </div>
              <div className="destination-summary-card">
                <strong>{destination.price}</strong>
                <span>Starting Budget</span>
              </div>
              <div className="destination-summary-card">
                <strong>{loading ? '...' : destination.guides_count || destination.guides?.length || 0}</strong>
                <span>Matching Guides</span>
              </div>
            </div>

            <div className="destination-highlight-chips">
              {[
                `Top-rated ${destination.city} experience`,
                `${destination.duration} suggested itinerary`,
                `${destination.guides_count || destination.guides?.length || 0}+ local guides available`,
              ].map((highlight) => (
                <span key={highlight}>{highlight}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="destination-guides-section">
          <div className="destination-guides-heading">
            <div>
              <span className="guide-section-tag">Local Guide Selection</span>
              <h2>Tour Guides for {destination.city}</h2>
              <p>
                Customers can compare the local guide profiles below and choose the best match for
                this destination.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="destination-status-card">
              <h3>Loading guides for {destination.city}...</h3>
              <p>Please wait while we fetch the local guide list for this destination.</p>
            </div>
          ) : error ? (
            <div className="destination-status-card">
              <h3>Could not load guide list</h3>
              <p>{error}</p>
            </div>
          ) : !destination.guides || destination.guides.length === 0 ? (
            <div className="destination-status-card">
              <h3>No guides available yet for {destination.city}</h3>
              <p>Add or seed more destination-specific guides to show them here.</p>
            </div>
          ) : (
            <div className="destination-guide-grid">
              {destination.guides.map((guide) => {
                const languages = (guide.languages || '')
                  .split(',')
                  .map((language) => language.trim())
                  .filter(Boolean);
                const hireCost = Number(guide.hire_cost);
                const formattedCost = Number.isFinite(hireCost) ? `$${hireCost.toFixed(2)}/day` : 'Contact for pricing';

                return (
                  <article className="destination-guide-card" key={guide.id}>
                    <div className="destination-guide-image">
                      <img
                        src={guide.photo || '/images/img.jpg'}
                        alt={guide.name}
                        onError={(event) => {
                          (event.target as HTMLImageElement).src = '/images/img.jpg';
                        }}
                      />
                    </div>

                    <div className="destination-guide-body">
                      <div className="destination-guide-topline">
                        <span>⭐ {guide.rating}/5</span>
                        <span>{guide.experience_years} yrs exp.</span>
                      </div>

                      <h3>{guide.name}</h3>
                      <p className="destination-guide-location">📍 {guide.location}</p>
                      <p className="destination-guide-description">{guide.description}</p>

                      <div className="destination-guide-language-list">
                        {languages.slice(0, 3).map((language) => (
                          <span key={`${guide.id}-${language}`}>{language}</span>
                        ))}
                      </div>

                      <div className="destination-guide-footer">
                        <strong>{formattedCost}</strong>
                        <div className="destination-guide-actions">
                          <a href={buildAppUrl(`/guide/${guide.id}`)} className="destination-secondary-btn">
                            Guide Details
                          </a>
                          <a href={buildAppUrl(`/payment/${guide.id}`)} className="destination-primary-btn">
                            Select Guide
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DestinationDetails;
