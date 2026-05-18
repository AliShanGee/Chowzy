import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import reelAnimation from '../animations/reel.json';

const FloatingReelButton = () => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                zIndex: 1000,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Link to="/reels" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    position: 'relative',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: '#FFE13C',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    overflow: 'visible'
                }}>
                    {/* Rotating Circle Text */}
                    <motion.svg
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        viewBox="0 0 100 100"
                        style={{
                            position: 'absolute',
                            width: '140%',
                            height: '140%',
                            pointerEvents: 'none'
                        }}
                    >
                        <path
                            id="circlePath"
                            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                            fill="transparent"
                        />
                        <text style={{ fontSize: '10px', fontWeight: 'bold', fill: '#000', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            <textPath xlinkHref="#circlePath">
                                explore amazing reels • explore amazing reels •
                            </textPath>
                        </text>
                    </motion.svg>

                    {/* Central Lottie Icon */}
                    <div style={{ width: '60px', height: '60px', zIndex: 1 }}>
                        <Lottie
                            animationData={reelAnimation}
                            loop={true}
                            autoplay={true}
                        />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default FloatingReelButton;
