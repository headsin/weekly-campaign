import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation to get state
import './styles.css'; // Import the new CSS file

// --- SVG Icon Components for the Tips Section ---

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#D946EF" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" stroke="#D946EF" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" fill="#D946EF" />
  </svg>
);

const TicketIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 22h6M5 18v-1a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v1M5 18h14M5 18a4 4 0 0 0-4 4v0M19 18a4 4 0 0 1 4 4v0M12 13V2" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2L9.45 4.93A2 2 0 0 1 8.029 6H4a2 2 0 0 0-2 2v1M12 2l2.55 2.93A2 2 0 0 0 15.971 6H20a2 2 0 0 1 2 2v1" stroke="#8B5CF6" strokeWidth="2" />
  </svg>
);

const AnnounceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8a6 6 0 0 0-12 0v2a6 6 0 1 0 12 0v-2zm-6 14v-2m-4-2l-2 2m8-2l2 2M3 11h2m14 0h2" stroke="#D946EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const ThankYouPage = () => {
  const location = useLocation();
  const { name, ticketNumber } = location.state || { name: 'User', ticketNumber: 'HEADSIN0000' };
  const navigate = useNavigate();

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    // Use the modern Navigator Clipboard API
    navigator.clipboard.writeText(ticketNumber).then(() => {
      setIsCopied(true);
      // Reset the "Copied!" message after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      // You could add fallback logic here for older browsers if needed
    });
  };

  if (!ticketNumber.startsWith("HEADSIN")) {
    navigate("/");
    return
  }

  return (
    <div className="thank-you-page-container">
      <div className="thank-you-content">
        <div className='icon-container'>
          <img src={`https://headsin.co/logo.webp`} alt="Logo" className='icon' />
        </div>

        <div className="card ticket-card">
          <h2>🎉 Thank you for registering, {name}!</h2>
          <p>Your Lottery Ticket Number is:</p>

          {/* Add onClick handler to this div */}
          <div className="ticket-number-box" onClick={handleCopyClick}>
            {isCopied ? (
              <span className="copy-feedback">Copied!</span>
            ) : (
              <span>{ticketNumber}</span>
            )}
          </div>

          <div className="next-step-box">
            <h3>Next Step to Confirm Your Entry</h3>
            <p>
              Please take a screenshot of this card and send it to
              <strong> +91 9773497763</strong> to confirm your entry.
            </p>
          </div>
        </div>

        <div className="card tips-card">
          <h3>How to Boost Your Chances of Winning</h3>
          <ul className="tips-list">
            <li className="tip-item">
              <TargetIcon />
              <span>Score 50+ on Headsin and get 4x more chances to win.</span>
            </li>
            <li className="tip-item">
              <TicketIcon />
              <span>Any 3 lucky ticket numbers will be rewarded.</span>
            </li>
            <li className="tip-item">
              <AnnounceIcon />
              <span>Winners will be announced on 15th August.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ThankYouPage;
