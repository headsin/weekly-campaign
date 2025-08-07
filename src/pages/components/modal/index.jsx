import React from 'react';
import './styles.css'; // Import the CSS for the modal
import { useEffect } from 'react';

// --- SVG Icon Components ---

const WarningIcon = () => (
    <svg fill="currentColor" width="35px" height="35px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M13.1784199,2.2788327 C13.6884947,2.53387012 14.102091,2.94746641 14.3571284,3.45754124 L21.7211673,18.185619 C22.37215,19.4875845 21.8444243,21.0707619 20.5424588,21.7217447 C20.1764813,21.9047334 19.7729254,22 19.3637502,22 L4.63567242,22 C3.18003074,22 2,20.8199693 2,19.3643276 C2,18.9551524 2.09526662,18.5515965 2.27825534,18.185619 L9.64229424,3.45754124 C10.293277,2.15557574 11.8764544,1.62784995 13.1784199,2.2788327 Z M11.2372377,4.47154211 L4.09002086,18.7659757 C4.03082055,18.8843764 4,19.0149343 4,19.1473102 C4,19.6182378 4.38176222,20 4.85268979,20 L19.1471234,20 C19.2794993,20 19.4100573,19.9691794 19.5284579,19.9099791 C19.9496683,19.6993739 20.1203976,19.1871862 19.9097924,18.7659757 L12.7625755,4.47154211 C12.6800661,4.30652327 12.5462599,4.17271706 12.3812411,4.09020764 C11.9600307,3.87960243 11.4478429,4.05033169 11.2372377,4.47154211 Z M12,16 C12.5522847,16 13,16.4477153 13,17 C13,17.5522847 12.5522847,18 12,18 C11.4477153,18 11,17.5522847 11,17 C11,16.4477153 11.4477153,16 12,16 Z M12,8 C12.5522847,8 13,8.44771525 13,9 L13,13 C13,13.5522847 12.5522847,14 12,14 C11.4477153,14 11,13.5522847 11,13 L11,9 C11,8.44771525 11.4477153,8 12,8 Z" />
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 6l12 12" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Modal = ({ isOpen, onClose }) => {


    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            console.log("Cleanup")
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        // The modal-overlay provides the dark, semi-transparent background
        <div className="modal-overlay" onClick={onClose}>
            {/* The modal-content is the white popup box. 
          We stop propagation to prevent the overlay's onClick from firing when clicking inside the modal. */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <button className="close-button" onClick={onClose}>
                    <CloseIcon />
                </button>

                <div className="modal-body">
                    <span className='modal-header'>
                        <WarningIcon />
                    </span>
                    <h2>It looks like you don't have a Headsin account yet!</h2>
                    <p>Please create your profile on Headsin to participate in the Lottery Camp.</p>

                    <a href='https://headsin.co/auth' target='_blank' rel="noopener noreferrer">
                        <button className="primary-button">
                            Create My Headsin Account
                        </button>
                    </a>
                    <button className="secondary-button" onClick={onClose}>
                        Go Back
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Modal;
