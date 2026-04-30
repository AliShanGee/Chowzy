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
    <button
      className="btn focus-ring focus-ring-primary p-0 border-0"
      style={{
        cursor: 'pointer',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'transparent',
      }}
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={darkModeAnimation}
        loop={false}
        autoplay={false}
        style={{ width: '100%', height: '100%' }}
      />
    </button>
  );
};

export default ThemeToggle;