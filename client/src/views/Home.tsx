import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../css/home.css';
import ApiClient from '../api';
import { TourDestinationSummary } from '../types/travel';
import { buildAppUrl } from '../utils/app-url';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [popularDestinations, setPopularDestinations] = useState<TourDestinationSummary[]>([]);

  // Gallery images
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      title: "Swiss Alps",
      location: "Switzerland",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      title: "Tropical Beach",
      location: "Maldives",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
      title: "Kyoto Temples",
      location: "Japan",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80",
      title: "Santorini Sunset",
      location: "Greece",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
      title: "Paris Lights",
      location: "France",
    },
  ];

  // Why choose us data
  const whyChooseUs = [
    {
      icon: "🎯",
      title: "Expert Planning",
      desc: "Our team of travel experts crafts personalized itineraries tailored to your unique preferences and budget."
    },
    {
      icon: "🛡️",
      title: "24/7 Support",
      desc: "Round-the-clock assistance wherever you are. We're always just a phone call away during your journey."
    },
    {
      icon: "💰",
      title: "Best Price Guarantee",
      desc: "We offer competitive pricing with no hidden fees. Book with confidence knowing you're getting the best deal."
    },
    {
      icon: "🌟",
      title: "Premium Experiences",
      desc: "Access exclusive tours and experiences that you won't find in typical travel packages."
    }
  ];

  // Travel tips data
  const travelTips = [
    {
      icon: "📅",
      title: "Plan Ahead",
      desc: "Book your flights and accommodations at least 2-3 months in advance for the best deals and availability."
    },
    {
      icon: "🎒",
      title: "Pack Smart",
      desc: "Create a checklist based on your destination's weather. Don't forget essential documents and travel insurance."
    },
    {
      icon: "💳",
      title: "Budget Wisely",
      desc: "Research local costs, exchange rates, and hidden fees. Consider using travel-friendly credit cards."
    },
    {
      icon: "📱",
      title: "Stay Connected",
      desc: "Download offline maps, translation apps, and keep important contacts saved for emergencies."
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const list = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      list.push({ email, date: new Date().toISOString() });
      localStorage.setItem('subscriptions', JSON.stringify(list));
    } catch {
      /* ignore storage errors */
    }
    setEmail('');
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  // Parallax scroll effect for hero
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const api = new ApiClient();
        const response = await api.getDestinations();

        if (response?.status === 'success' && Array.isArray(response?.data)) {
          setPopularDestinations(response.data.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to load destinations on home page:', error);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="home-page">

      <main>
        {/* Hero Section */}
        <section className="hero" aria-labelledby="hero-heading">
          <div 
            className="hero-background"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          ></div>
          <div className="hero-overlay"></div>
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="tagline">Know Before You Go 🌍</span>
            </motion.div>
            <motion.h1 
              id="hero-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Traveling opens the door to creating <span>memories</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover destinations. Create memories. Travel smart with TravelWorld.
            </motion.p>
            <motion.div 
              className="hero-cta"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link to="/tourguide" className="btn-primary">Find a Guide</Link>
              <a className="btn-secondary" href="#services">Our Services</a>
            </motion.div>
          </motion.div>
        </section>

        {/* Experience New Adventures Section */}
        <section className="adventures" id="adventures">
          <div className="adventures-container">
            <motion.div 
              className="adventures-image"
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <img 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" 
                alt="Travel Adventure" 
              />
              <div className="image-badge">✈️ Start Your Journey</div>
            </motion.div>
            
            <motion.div 
              className="adventures-content"
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="adventures-tag">Discover</span>
              <h2>Experience New Adventures</h2>
              <p>
                Embark on unforgettable journeys that transform dreams into reality. 
                Our expert guides curate experiences that go beyond typical tourism, 
                immersing you in local cultures and hidden gems.
              </p>
              <p>
                From breathtaking mountain treks to serene beach retreats, we craft 
                personalized itineraries that match your unique travel style. 
                Every adventure promises stories worth telling and memories that last forever.
              </p>
              
              <div className="adventures-features">
                <motion.div 
                  className="adventure-item"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="icon">🗺️</span>
                  <span>Curated Itineraries</span>
                </motion.div>
                <motion.div 
                  className="adventure-item"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="icon">🏆</span>
                  <span>Award-Winning Guides</span>
                </motion.div>
                <motion.div 
                  className="adventure-item"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="icon">💫</span>
                  <span>Unforgettable Experiences</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="why-choose-us" id="why-choose">
          <div className="container">
            <motion.div 
              className="section-header-centered"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="subtitle">Why TravelWorld</span>
              <h2>Why Choose <span className="accent">Us</span></h2>
              <p className="lead">Experience the difference with our premium travel services</p>
            </motion.div>
            
            <div className="why-choose-grid">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={index}
                  className="glass-card why-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <span className="why-icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services" id="services">
          <div className="container">
            <motion.div 
              className="services-header"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="subtitle">What we serve</span>
              <h2>We offer our best <br /> services</h2>
              <p className="lead">Local guides, weather insights, and fully customizable itineraries tailored to you.</p>
            </motion.div>
            <div className="service-cards">
              {[
                { icon: "☁️", title: "Weather Insights", desc: "Check the weather before planning your trips anywhere in the world." },
                { icon: "📋", title: "Expert Tour Guides", desc: "Our professional guides make sure your trip is memorable." },
                { icon: "⚙️", title: "Customization", desc: "Plan your itinerary your way with our customizable options." },
                { icon: "🔒", title: "Safe Payments", desc: "Secure checkout and flexible cancellation policies." }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <span className="icon">{service.icon}</span>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Destinations Section */}
        <section className="popular-destinations" id="destinations">
          <div className="container">
            <motion.div 
              className="section-header-centered"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="subtitle">Explore</span>
              <h2>Popular <span className="accent">Destinations</span></h2>
              <p className="lead">Choose from 5 curated destinations and meet local guides for each place</p>
            </motion.div>
            
            <div className="destinations-grid">
              {popularDestinations.map((dest, index) => (
                <motion.div
                  key={dest.id}
                  className="destination-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -15 }}
                >
                  <div className="destination-image">
                    <img src={dest.image} alt={dest.title} loading="lazy" />
                    <div className="destination-overlay">
                      <span className="rating">⭐ {dest.rating}</span>
                    </div>
                  </div>
                  <div className="destination-info">
                    <h3>{dest.title}</h3>
                    <p className="destination-country">📍 {dest.country}</p>
                    <div className="destination-details">
                      <span className="duration">🕐 {dest.duration}</span>
                      <span className="price">{dest.price}</span>
                    </div>
                    <a href={buildAppUrl(`/destinations/${dest.slug}`)} className="btn-destination">Explore Place</a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Travel Tips Section */}
        <section className="travel-tips" id="tips">
          <div className="container">
            <motion.div 
              className="section-header-centered"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="subtitle">Travel Smart</span>
              <h2>Essential <span className="accent">Tips</span></h2>
              <p className="lead">Make the most of your journey with our expert advice</p>
            </motion.div>
            
            <div className="tips-grid">
              {travelTips.map((tip, index) => (
                <motion.div
                  key={index}
                  className="tip-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="tip-icon">{tip.icon}</div>
                  <h3>{tip.title}</h3>
                  <p>{tip.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery / Travel Stories Section */}
        <section className="gallery" id="gallery">
          <motion.div 
            className="gallery-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="subtitle">Destinations</span>
            <h2>Travel Stories</h2>
            <p>Explore breathtaking destinations from around the world</p>
          </motion.div>
          
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="gallery-item"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img src={image.src} alt={image.title} loading="lazy" />
                <div className="gallery-overlay">
                  <h4>{image.title}</h4>
                  <span>{image.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="gallery-cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/tourguide">
              View All Destinations →
            </Link>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="cta-section" id="cta">
          <motion.div 
            className="cta-card"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2>Ready to Start Your Journey?</h2>
            <p>
              Let us help you create the adventure of a lifetime. 
              Book now and get exclusive discounts on your first trip!
            </p>
            <Link to="/tourguide" className="btn-primary btn-glow">
              Book Now ✈️
            </Link>
          </motion.div>
        </section>

        {/* Newsletter Section (Optional - can be kept or removed) */}
        <section className="newsletter">
          <div className="container">
            <motion.div 
              className="newsletter-left"
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2>Subscribe for Travel Tips & Updates</h2>
              <form className="subscribe-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                />
                <button type="submit">{subscribed ? 'Subscribed ✓' : 'Subscribe'}</button>
              </form>
              <p>Get useful tips and updates directly in your inbox.</p>
            </motion.div>
            <motion.div 
              className="newsletter-right"
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <img
                loading="lazy"
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                alt="Three brown wooden boats on a blue lake"
              />
            </motion.div>
          </div>
        </section>
      {/* Footer */}
      </main>

      <footer className="footer">
        <div className="footer-wrapper">
          <div className="footer-box">
            <h2 className="footer-logo"><Link to="/">TRAVEL<span>WORLD</span></Link></h2>
            <p>It's time to travel the world</p>
            <p>Discover destinations. Create memories. Travel smart.</p>
            <div className="footer-social" aria-hidden>
              <a href="#" aria-label="YouTube">Y</a>
              <a href="#" aria-label="Twitter">T</a>
              <a href="#" aria-label="Facebook">F</a>
              <a href="#" aria-label="Instagram">I</a>
            </div>
          </div>
          <div className="footer-box">
            <h3>Discover</h3>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/tourguide">Tour Guide</Link></li>
            </ul>
          </div>
          <div className="footer-box">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Register</Link></li>
            </ul>
          </div>
          <div className="footer-box">
            <h3>Contact</h3>
            <ul>
              <li>📍 Dhaka, Bangladesh</li>
              <li>📧 support@travelworld.com</li>
              <li>📞 00022200222</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} TravelWorld. All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default Home;
