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

    if (lottieRef.current) {
      if (newTheme === 'dark') {
        lottieRef.current.playSegments([30, 115], true);
      } else {
        lottieRef.current.playSegments([300, 385], true);
      }
    }
  };

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
      type="button"
      className="focus-ring"
      style={{
        cursor: 'pointer',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0
      }}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
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
