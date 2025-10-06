import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { subscribeToInvite } from '../src/api/subscribe';

// Email validator
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
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isValidEmail(email)) {
        toast.error('Please enter a valid email address.', { position: 'top-right', autoClose: 4000 });
        return;
      }
      setIsLoading(true);
      try {
        const response = await subscribeToInvite(email, '');
        toast.dismiss();
        if (response.message === 'Email already registered') {
          toast.warning(response.message);
        } else {
          toast.success(response.message || 'Thank you! Your invitation request has been received.');
          setShowPopup(true);
          setFadeOut(false);
        }
        setEmail('');
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
      className="
        min-h-screen
        flex flex-col items-center justify-center
        p-4 sm:p-6
        font-serif
        relative
      "
      style={{
        backgroundColor: '#f8f5f0',
        backgroundImage:
          'repeating-linear-gradient(45deg, #fdfdfb 0, #fdfdfb 20px, #fcfaf7 20px, #fcfaf7 40px)',
        paddingTop: 'max(env(safe-area-inset-top), 1rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)',
      }}
    >
      {/* Title */}
      <h1
        className="
          text-center text-[#3e2f2f]
          tracking-wide
          leading-tight
          select-none
        "
        style={{
          // scales from ~44px on small screens up to ~96px on large
          fontSize: 'clamp(2.75rem, 6vw, 6rem)',
          fontFamily: 'Kunstler Script, serif',
          fontStyle: 'italic',
          fontWeight: 500,
        }}
      >
        Shahu Mumbai
      </h1>

      {/* Subtitle */}
      <div className="mt-6 sm:mt-8 mb-6 sm:mb-8 text-center w-full max-w-md px-2">
        <p
          className="text-[#5c5346] leading-relaxed"
          style={{
            fontFamily: 'Lucida Handwriting, serif',
            fontSize: 'clamp(0.95rem, 2.8vw, 1.125rem)', // ~15–18px
          }}
        >
          Bringing the Indian Heritage to you.
        </p>
        <p
          className="text-[#5c5346] leading-relaxed mt-2"
          style={{
            fontFamily: 'Lucida Handwriting, serif',
            fontSize: 'clamp(0.95rem, 2.8vw, 1.125rem)',
          }}
        >
          Receive your invitation.
        </p>
      </div>

      {/* Email Form */}
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-[28rem]   /* ~448px on larger screens */
          rounded-xl border border-[#a58c74]
          bg-[#fcfaf7] shadow-sm overflow-hidden
          px-2
        "
        aria-label="Invitation form"
      >
        <div className="flex items-stretch">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="
              flex-grow
              bg-transparent
              focus:outline-none
              placeholder-[#9a8c7c]
              text-[#3e2f2f]
              disabled:opacity-50
              px-3 py-3
              text-base
              sm:text-lg
            "
            style={{
              // Keep >=16px to prevent iOS zoom on focus
              fontSize: 'clamp(1rem, 3.8vw, 1.125rem)',
            }}
            aria-label="Email address for invitation"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="
              px-4 sm:px-5
              bg-[#f5e6e8] hover:bg-[#edd2d6]
              transition
              rounded-r-xl
              disabled:opacity-40 disabled:cursor-not-allowed
              flex items-center justify-center
            "
            aria-label="Submit email"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-2 border-[#3e2f2f] border-opacity-30 rounded-full animate-spin" />
            ) : (
              <ArrowRightIcon className="w-5 h-5 text-[#3e2f2f]" />
            )}
          </button>
        </div>
      </form>

      {/* Popup with fade-in + fade-out */}
      {showPopup && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-500 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            className={`
              relative bg-[#fcfaf7] border border-[#a58c74]
              rounded-xl shadow-lg text-center
              transition-transform duration-500
              ${fadeOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
              w-[90%] max-w-sm p-6 sm:p-8
            `}
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-confirmation-title"
          >
            <h2 id="invite-confirmation-title" className="text-xl sm:text-2xl font-semibold text-[#3e2f2f] mb-3 sm:mb-4">
              Congratulations!
            </h2>
            <p className="text-[#5c5346] mb-5 sm:mb-6 text-sm sm:text-base">
              Your invitation request has been received.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="
                w-full sm:w-auto
                px-5 py-2.5
                bg-[#f5e6e8] hover:bg-[#edd2d6]
                text-[#3e2f2f]
                rounded-lg transition
              "
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
