import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify'; // Import react-toastify
import { subscribeToInvite } from '../src/api/subscribe';

// Utility function to validate email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function HomePage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const ArrowRightIcon = (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isValidEmail(email)) {
        toast.error('Please enter a valid email address.', {
          position: 'top-right',
          autoClose: 4000,
        });
        return;
      }

      setIsLoading(true);
      try {
        const response = await subscribeToInvite(email, '');
        toast.dismiss();
        toast.success(response.message || 'Thank you! Your invitation request has been received.');
        setEmail('');
        if(response.message !== "Email already registered"){
          setShowPopup(true);
          setFadeOut(false);
        }
      } catch (error) {
        toast.dismiss();
        toast.error(error.message || 'Oops! Something went wrong. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
    [email]
  );


  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShowPopup(false), 600); 
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 font-serif relative"
      style={{
        backgroundColor: '#f8f5f0',
        backgroundImage:
          'repeating-linear-gradient(45deg, #fdfdfb 0, #fdfdfb 20px, #fcfaf7 20px, #fcfaf7 40px)',
      }}
    >
      {/* Title */}
      <h1
        className="text-6xl md:text-7xl text-center text-[#3e2f2f] tracking-wide"
        style={{ fontSize: '96px', fontFamily: 'Kunstler Script, serif', fontStyle: 'italic', fontWeight: '500' }}
      >
        Shahu Mumbai
      </h1>

      {/* Subtitle */}
      <div className="mt-10 mb-8 text-center max-w-md">
        <p className="text-[#5c5346] text-lg font-light leading-relaxed" style={{ fontFamily: 'Lucida Handwriting, serif'}}>
          Bringing the Indian Heritage to you.
        </p>
        <p className="text-[#5c5346] text-lg font-light leading-relaxed mt-2" style={{ fontFamily: 'Lucida Handwriting, serif'}}>
          Receive your invitation.
        </p>
      </div>

      {/* Email Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-[#a58c74] bg-[#fcfaf7] rounded-xl shadow-sm overflow-hidden"
      >
        <div className="flex items-center">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="flex-grow p-3 text-base bg-transparent focus:outline-none placeholder-[#9a8c7c] text-[#3e2f2f] disabled:opacity-50"
            aria-label="Email address for invitation"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-3 bg-[#f5e6e8] hover:bg-[#edd2d6] transition rounded-r-xl disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Submit email"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-2 border-[#3e2f2f] border-opacity-30 rounded-full animate-spin"></div>
            ) : (
              <ArrowRightIcon className="w-5 h-5 text-[#3e2f2f]" />
            )}
          </button>
        </div>
      </form>

      {/* Popup with fade-in + fade-out */}
      {showPopup && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-600 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            className={`relative bg-[#fcfaf7] border border-[#a58c74] rounded-xl p-8 max-w-sm text-center shadow-lg transition-transform duration-600 ${
              fadeOut ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            <h2 className="text-2xl font-semibold text-[#3e2f2f] mb-4">Congratulations!</h2>
            <p className="text-[#5c5346] mb-6">Your invitation request has been received.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-6 py-2 bg-[#f5e6e8] hover:bg-[#edd2d6] text-[#3e2f2f] rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;