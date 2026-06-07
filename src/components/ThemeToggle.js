import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Lottie from 'lottie-react';
import darkModeAnimation from '../animations/Dark Mode Button.json';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const lottieRef = useRef();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // Play animation segment based on new theme
    if (lottieRef.current) {
      if (newTheme === 'dark') {
        // Play light to dark: frames 30 to 115
        lottieRef.current.playSegments([30, 115], true);
      } else {
        // Play dark to light: frames 300 to 385
        lottieRef.current.playSegments([300, 385], true);
      }
    }
  };

  // Set initial animation state based on theme
  useEffect(() => {
    if (lottieRef.current) {
      if (theme === 'dark') {
        lottieRef.current.goToAndStop(115);
      } else {
        lottieRef.current.goToAndStop(385);
      }
    }
  }, [theme]);

  return (
    <>
      <style>
        {`
          .theme-toggle-btn {
            cursor: pointer;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: transparent;
            border: none;
            padding: 0;
            transition: background-color 0.2s ease, box-shadow 0.2s ease;
          }
          .theme-toggle-btn:focus-visible {
            outline: 2px solid #007bff;
            background-color: rgba(0, 123, 255, 0.1);
            box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.25);
          }
        `}
      </style>
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={darkModeAnimation}
          loop={false}
          autoplay={false}
          style={{ width: '100%', height: '100%' }}
        />
      </button>
    </>
  );
};

export default ThemeToggle;
