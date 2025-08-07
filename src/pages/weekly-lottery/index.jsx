import React, { useState, useEffect } from 'react';
import './styles.css'; // Import the new CSS file
import { GiftIcon } from '../components/icons/Gift';
import { SparklesIcon } from '../components/icons/Sparkles';
import Modal from '../components/modal';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

import { doc, runTransaction } from "firebase/firestore";
import { db } from '../../services/firebase';
import { isValidEmail, isValidIndianMobile } from '../../utils/validations';

const StepIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" fillOpacity="0.2" />
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const emails = new Map()

// --- Main App Component ---
const WeeklyLotery = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const [state, setState] = useState({
        isLoading: false,
        isMobileError: false,
        isEmailError: false,
        isNameError: false,
    });

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const mobileRef = useRef(null);

    useEffect(() => {
        async function fetchEmails() {
            const response = await fetch(`https://admin-api.headsin.co/api/v1/users/emails?fieldMask=email&secret=${import.meta.env.VITE_PASSWORD}`);
            const data = await response.json();

            for (let email of data) {
                emails.set(email.email, true);
            }
        }
        fetchEmails();
    }, []);

    const getNextTicketNumber = async () => {
        const counterRef = doc(db, "lotteryCounters", import.meta.env.VITE_FIREBASE_DOC_ID); // Use a consistent document ID

        try {
            const newTicketNumber = await runTransaction(db, async (transaction) => {
                const counterDoc = await transaction.get(counterRef);
                if (!counterDoc.exists()) {
                    transaction.set(counterRef, { current_ticket_number: 1 });
                    return 1;
                }
                const currentNumber = counterDoc.data().current_ticket_number;
                const nextNumber = currentNumber + 1;
                transaction.update(counterRef, { current_ticket_number: nextNumber });
                return nextNumber;
            });

            const formattedNumber = String(newTicketNumber).padStart(5, '0');
            return `HEADSIN${formattedNumber}`;
        } catch (e) {
            console.error("Transaction failed: ", e);
            throw new Error("Could not generate a ticket number. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setState(prev => ({ ...prev, isSubmitError: false, isEmailError: false, isNameError: false }));

        // 3. Get values directly from the refs
        const name = nameRef.current?.value;
        const email = emailRef.current?.value;
        const mobile = mobileRef.current?.value;

        if (!name || name.length < 3) {
            setState(pre => ({ ...pre, isNameError: true }));
            return;
        }

        if (!isValidEmail(email)) {
            setState(pre => ({ ...pre, isEmailError: true }));
            return;
        }

        if (!mobile || !isValidIndianMobile(mobile)) {
            setState(pre => ({ ...pre, isMobileError: true }));
            return;
        }

        if (emails.has(email)) {
            setModalOpen(true);
            return;
        }

        setState({ ...state, isLoading: true });


        try {
            const ticketNumber = await getNextTicketNumber();

            const apiUrl = import.meta.env.VITE_LAMBDA_URL;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone: mobile, ticketNumber }),
            });

            if (!response.ok) {
                setState({ ...state, isLoading: false });
                throw new Error('Failed to save data to sheet.');
            }

            setState({ ...state, isLoading: false });
            navigate('/thank-you', { state: { name: name, ticketNumber } });
        } catch (error) {
            alert(error.message);
        } finally {
            setState({ ...state, isLoading: false });
        }
    };

    return (
        <div className="weekly-lottery-page">

            <header className="page-header">
                <div className="content-wrapper">

                    <div className='inner-container'>
                        <img src={`https://headsin.co/logo.webp`} alt="Logo" className='icon' />
                        <div className='animations'>
                            <div style={{ maxWidth: "700px", flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
                                <GiftIcon />
                                <span className='happy'>🎉</span>
                                <SparklesIcon />
                            </div>
                        </div>
                        <div className="header-title">
                            <h1>🎉 Join the HeadsIn Lootery Camp <br />& Win ₹1000! 🎉</h1>
                        </div>
                        <p>Sign up today & stand a chance to grab exciting cash rewards. It only takes 30 seconds!</p>
                    </div>

                </div>

            </header>

            <main className="main-content">
                <div className="content-wrapper">
                    <div className='steps-container'>
                        <div className="steps-grid">
                            <div className="step-card">
                                <StepIcon />
                                <div>
                                    <h3>Step 1</h3>
                                    <p>Create your free HeadsIn account</p>
                                </div>
                            </div>
                            <div className="step-card">
                                <StepIcon />
                                <div>
                                    <h3>Step 2</h3>
                                    <p>Submit your details & get your Lootery Ticket instantly</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="form-container">
                        <form className="lottery-form" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor='name'> Name </label>
                                <input id='name' ref={nameRef} type="text" placeholder="e.g., Rahul Sharma" className="form-input" required />
                                {state.isNameError && <small className='error-message'>Name must have 3 characters</small>}
                            </div>
                            <div>
                                <label htmlFor='email'> Email </label>
                                <input id='email' ref={emailRef} type="email" placeholder="e.g., rahul@gmail.com" className="form-input" required />
                                {state.isEmailError && <small className='error-message'>Email must be valid</small>}
                            </div>
                            <div>
                                <label htmlFor='mobile'> Mobile No. </label>
                                <input id='mobile' ref={mobileRef} type="tel" placeholder="e.g., 9876543210" className="form-input" required />
                                {state.isMobileError && <small className='error-message'>Mobile number should be valid</small>}
                            </div>
                            <button type="submit" disabled={state.isLoading} className={`submit-button`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                                    <path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path>
                                </svg>
                                {
                                    state.isLoading ? <span>Submitting...</span> : <span>Grab the Lottery Ticket & Win ₹1000</span>
                                }
                            </button>
                        </form>

                        <p className="form-footer-text">
                            Don't have an account? <a href='https://headsin.co/auth' target='_blank' rel="noopener noreferrer">Create Account</a>
                        </p>
                        <p className="form-footer-text">
                            One-time campaign. No charges. Results on 15th August.
                        </p>
                    </div>

                    <div className="features-section">
                        <div className='features-container'>
                            <h3 className='feature-title'>🎯 Results will be announced on 15th August</h3>
                            <div className="features-grid">
                                <div className="feature-card">
                                    <h3>No Hidden Fees</h3>
                                    <p>Completely free to join. No charges whatsoever.</p>
                                </div>
                                <div className="feature-card">
                                    <h3>Instant Ticket Confirmation</h3>
                                    <p>Get your ticket number immediately after signing up.</p>
                                </div>
                                <div className="feature-card">
                                    <h3>Simple 2-Step Entry Process</h3>
                                    <p>Quick and easy registration in just 30 seconds.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className='footer'>
                <div className="content-wrapper">
                    <img src={`https://headsin.co/logo.webp`} alt="Logo" className='icon' />


                    <p className='footer-text'>HeadsIn connects job seekers with their dream opportunities while rewarding them for taking the first step towards their career goals.</p>
                    <ul className='footer-links'>
                        <li>
                            <a href='https://headsin.co/terms-and-conditions'>Terms & Conditions</a>
                        </li>
                        <li>
                            <a href='https://headsin.co/privacy-policy'>Privacy Policy</a>
                        </li>
                        <li>
                            <a href='emailto:support@headsin.co'>Support</a>
                        </li>
                        <li>
                            <a href='https://headsin.co/contact-us'>Contact Us</a>
                        </li>
                    </ul>
                    <small>© 2025 HeadsIn. All rights reserved.</small>
                    <small>Lottery conducted fairly. No purchase necessary. Must be 18+ to participate.</small>
                </div>
            </footer>

            {/* The Modal component itself */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default WeeklyLotery;
