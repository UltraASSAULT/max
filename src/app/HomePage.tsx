// /src/pages/HomePage.tsx
import '../assets/css/HomePage.css';
import earth from "../assets/images/earth.jpg";
import moon from '../assets/images/moon-adventure.jpg';
import station from '../assets/images/space-station.jpg';

// Arrow icon component for reuse
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
);

const HomePage = () => {
  // Launch data
  const launches = [
    { id: 1, name: 'Earth Orbit Experience' },
    { id: 2, name: 'Lunar Landing Adventure' },
    { id: 3, name: 'Zero-G Simulation' },
  ];

  // Experience cards data
  const experiences = [
    {
      id: 1,
      title: 'Moon Adventures',
      description: 'Set foot on the Moon and explore its endless craters.',
      image: moon,
    },
    {
      id: 2,
      title: 'Space Station',
      description: 'Live aboard the orbital station.',
      image: station,
    },
  ];

  return (
    <div className="homepage-container">
      <section className="homepage-hero">
        {/* Main Title */}
        <div className="homepage-title-section">
          <h1 className="homepage-title">
            YOUR JOURNEY
            <br />
            <span className="homepage-title-highlight">STARTS HERE</span>
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="homepage-content">
          {/* Upcoming Launches */}
          <div className="homepage-launches">
            <h2 className="homepage-section-title">Upcoming Launches</h2>
            <div className="homepage-launch-list">
              {launches.map((launch) => (
                <div key={launch.id} className="homepage-launch-item">
                  <div className="homepage-launch-info">
                    <span className="homepage-launch-number">
                      {String(launch.id).padStart(2, '0')}
                    </span>
                    <span className="homepage-launch-name">{launch.name}</span>
                  </div>
                  <div className="homepage-launch-arrow">
                    <ArrowIcon />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Globe */}
          <div className="homepage-globe-section">
            <div className="homepage-globe">
              {/* Replace with actual Earth image */}
              <img
                src={earth}
                alt="Earth"
                className="homepage-globe-img"
                onError={(e) => {
                  // Fallback: hide image if not found, show gradient
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Experiences */}
          <div className="homepage-experiences">
            <h2 className="homepage-section-title">Next-Level Travel Experiences</h2>
            <div className="homepage-cards-container">
              {experiences.map((exp) => (
                <div key={exp.id} className="homepage-card">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="homepage-card-img"
                    onError={(e) => {
                      // Fallback gradient if image fails
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="homepage-card-arrow">
                    <ArrowIcon />
                  </div>
                  <div className="homepage-card-content">
                    <h3 className="homepage-card-title">{exp.title}</h3>
                    <p className="homepage-card-desc">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Carousel Dots */}
            <div className="homepage-carousel-dots">
              <span className="homepage-dot homepage-dot-active"></span>
              <span className="homepage-dot"></span>
              <span className="homepage-dot"></span>
              <span className="homepage-dot"></span>
              <span className="homepage-dot"></span>
            </div>
          </div>
        </div>

        {/* Bottom Arrow Logo */}
        <div className="homepage-bottom-logo">
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 50L30 10L50 50H10Z"
              fill="none"
              stroke="white"
              strokeWidth="3"
            />
            <path d="M30 10L30 35" stroke="white" strokeWidth="3" />
          </svg>
        </div>
      </section>
    </div>
  );
};

export default HomePage;