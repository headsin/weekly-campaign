import { Link } from 'react-router-dom'; // Import Link for navigation
import './styles.css'; // Import the CSS for the page

// A simple SVG to represent a lost page or a broken link
const LostIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.364 5.63604L16.9497 7.05025M16.9497 16.9497L18.364 18.364M5.63604 18.364L7.05025 16.9497M7.05025 7.05025L5.63604 5.63604" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8Z" stroke="#8B5CF6" strokeWidth="2"/>
        <path d="M12 2V4" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 20V22" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
        <path d="M4 12H2" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 12H20" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);


const NotFoundPage = () => {
  return (
    <div className="not-found-page-container">
      <div className="not-found-content">
        <LostIcon />
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="home-button">
          Go Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
