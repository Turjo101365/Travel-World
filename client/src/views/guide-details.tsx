import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ApiClient from '../api';
import '../css/guide-details.css';

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

const GuideDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const safeRating = Math.max(0, Math.min(5, guide?.rating || 0));
  const languages = (guide?.languages || '')
    .split(',')
    .map((language) => language.trim())
    .filter(Boolean);

  const localKnowledge = Math.min(98, 70 + (guide?.experience_years || 0) * 3);
  const communication = Math.min(96, 65 + safeRating * 6);
  const planning = Math.min(95, 60 + (guide?.experience_years || 0) * 4 + safeRating * 2);
  const rawPhone = (guide?.phone || '').trim();
  const rawEmail = (guide?.email || '').trim();
  const hasPhone = rawPhone.length > 0;
  const hasEmail = rawEmail.length > 0;
  const displayPhone = hasPhone ? rawPhone : 'Not provided';
  const displayEmail = hasEmail ? rawEmail : 'Not provided';
  const safePhoneHref = hasPhone ? `tel:${rawPhone.replace(/[^\d+]/g, '')}` : '#';
  const hireCost = Number(guide?.hire_cost);
  const hasHireCost = guide?.hire_cost !== undefined && guide?.hire_cost !== null && Number.isFinite(hireCost);
  const formattedHireCost = hasHireCost ? `$${hireCost.toFixed(2)}` : 'Not set';

  useEffect(() => {
    const fetchGuide = async () => {
      const numericId = Number(id);

      if (!id || Number.isNaN(numericId) || numericId <= 0) {
        setError('Invalid guide id.');
        setGuide(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const api = new ApiClient();
        const response = await api.getTourGuide(numericId);

        if (response?.status === 'success' && response?.data) {
          setGuide(response.data);
          return;
        }

        setGuide(null);
        setError(response?.message || 'Guide not found.');
      } catch (err) {
        console.error('Error fetching guide:', err);
        setGuide(null);
        setError('Failed to load guide details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [id]);

  if (loading) {
    return (
      <div className="guide-details-page">
        <div className="guide-details-shell">
          <div className="guide-loading-card">
            <h2>Loading Guide Details...</h2>
            <p>Please wait while we fetch this guide from the database.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="guide-details-page">
        <div className="guide-details-shell">
          <div className="guide-error-card">
            <h2>{error || 'Guide not found'}</h2>
            <p>We could not load this tour guide profile right now.</p>
            <Link to="/tourguide" className="guide-btn secondary">
              Back to Tour Guides
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-details-page">
      <div className="guide-details-shell">
        <div className="guide-page-actions">
          <Link to="/tourguide" className="guide-back-link">
            ← Back to Tour Guides
          </Link>
        </div>

        <article className="guide-profile-card">
          <div className="guide-profile-head">
            <div className="guide-photo-wrap">
              <img
                src={guide.photo || '/images/img.jpg'}
                alt={guide.name}
                onError={(event) => {
                  (event.target as HTMLImageElement).src = '/images/img.jpg';
                }}
              />
            </div>

            <div className="guide-primary">
              <h1>{guide.name}</h1>
              <p className="guide-location">📍 {guide.location}</p>

              <div className="guide-rating">
                <div className="guide-stars">
                  {Array.from({ length: safeRating }).map((_, index) => (
                    <span key={`filled-${index}`}>★</span>
                  ))}
                  {Array.from({ length: 5 - safeRating }).map((_, index) => (
                    <span key={`empty-${index}`} className="star-muted">
                      ★
                    </span>
                  ))}
                </div>
                <span className="guide-rating-label">{safeRating.toFixed(1)} / 5</span>
              </div>

              <div className="guide-meta-chips">
                <span>{guide.experience_years} Years Experience</span>
                <span>{languages.length || 1} Language{(languages.length || 1) > 1 ? 's' : ''}</span>
                <span>Hire Cost: {formattedHireCost}{hasHireCost ? ' / day' : ''}</span>
              </div>

              <div className="guide-cta-row">
                <Link to={`/payment/${guide.id}`} className="guide-btn primary">
                  Hire & Pay
                </Link>

                {hasEmail ? (
                  <a href={`mailto:${displayEmail}`} className="guide-btn secondary">
                    Email Guide
                  </a>
                ) : (
                  <span className="guide-btn disabled">Email Not Available</span>
                )}

                {hasPhone ? (
                  <a href={safePhoneHref} className="guide-btn secondary">
                    Call Guide
                  </a>
                ) : (
                  <span className="guide-btn disabled">Phone Not Available</span>
                )}
              </div>
            </div>
          </div>

          <section className="guide-section">
            <h2>About</h2>
            <p>{guide.description}</p>
          </section>

          <section className="guide-section">
            <h2>Languages</h2>
            <div className="guide-language-list">
              {(languages.length ? languages : ['Not provided']).map((language) => (
                <span key={language} className="guide-language-chip">
                  {language}
                </span>
              ))}
            </div>
          </section>

          <section className="guide-section">
            <h2>Contact & Hire Details</h2>
            <div className="guide-contact-grid">
              <div className="guide-contact-item">
                <span className="contact-label">Phone</span>
                {hasPhone ? <a href={safePhoneHref}>{displayPhone}</a> : <strong>{displayPhone}</strong>}
              </div>
              <div className="guide-contact-item">
                <span className="contact-label">Email</span>
                {hasEmail ? <a href={`mailto:${displayEmail}`}>{displayEmail}</a> : <strong>{displayEmail}</strong>}
              </div>
              <div className="guide-contact-item">
                <span className="contact-label">Hire Cost</span>
                <strong>{formattedHireCost}{hasHireCost ? ' / day' : ''}</strong>
              </div>
            </div>
          </section>

          <section className="guide-section">
            <h2>Professional Highlights</h2>

            <div className="guide-skill">
              <div className="guide-skill-row">
                <span>Local Knowledge</span>
                <span>{localKnowledge}%</span>
              </div>
              <div className="guide-skill-track">
                <div className="guide-skill-fill" style={{ width: `${localKnowledge}%` }} />
              </div>
            </div>

            <div className="guide-skill">
              <div className="guide-skill-row">
                <span>Communication</span>
                <span>{communication}%</span>
              </div>
              <div className="guide-skill-track">
                <div className="guide-skill-fill" style={{ width: `${communication}%` }} />
              </div>
            </div>

            <div className="guide-skill">
              <div className="guide-skill-row">
                <span>Tour Planning</span>
                <span>{planning}%</span>
              </div>
              <div className="guide-skill-track">
                <div className="guide-skill-fill" style={{ width: `${planning}%` }} />
              </div>
            </div>
          </section>

          <div className="guide-footer-note">
            Looking for a different style of guide? <Link to="/tourguide">Browse all guides</Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default GuideDetails;
