import React from 'react';
import { motion } from 'framer-motion';

const AnimatedLogo = ({ 
  text = 'Chowzy', 
  colors = ['#ff6b6b', '#f94d63', '#f7971e', '#ffd700', '#08C1FF', '#FF4DC2'],
  fontSize = "1.8rem" 
}) => {
  const characters = text.split('');
  // 1000 is large enough for any stroke dash array of a single character text
  const pathLength = 1000; 

  return characters.map((char, i) => {
    const color = colors[i % colors.length];
    
    return (
      <span key={i} className="animated-logo-char" style={{ position: 'relative', display: 'inline-block' }}>
        {/* Invisible text for natural standard spacing */}
        <span style={{ visibility: 'hidden', fontSize: fontSize }}>{char}</span>
        
        {/* SVG absolute overlay to draw outline and fill effect */}
        <svg 
          style={{ 
            position: 'absolute', 
            left: 0, 
            top: 0, 
            width: '100%', 
            height: '100%', 
            overflow: 'visible' 
          }}
        >
          {/* Edge/Border Outline */}
          <motion.text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fontSize={fontSize}
            fontWeight="bold"
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: pathLength, strokeDashoffset: pathLength }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ 
              duration: 2, 
              delay: i * 0.15, 
              ease: "easeInOut" 
            }}
          >
            {char}
          </motion.text>
          
          {/* Fill */}
          <motion.text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fontSize={fontSize}
            fontWeight="bold"
            fill={color}
            stroke="none"
            initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
            transition={{ 
              duration: 0.8, 
              delay: 1.5 + (i * 0.15), 
              ease: "easeOut" 
            }}
          >
            {char}
          </motion.text>
        </svg>
      </span>
    );
  });
};

export default AnimatedLogo;
