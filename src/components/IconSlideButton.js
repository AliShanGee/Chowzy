import React from "react";
import { motion } from "framer-motion";
import { BsCartPlus } from "react-icons/bs";

const IconSlideButton = ({ text, onClick, className, style, ...props }) => {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      style={{
        ...style,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: "pointer",
        padding: "0.75rem 1.5rem",
      }}
      whileHover="hover"
      initial="initial"
      {...props}
    >
      <motion.div
        variants={{
          initial: { x: -40, opacity: 0 },
          hover: { x: 0, opacity: 1 },
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }}
        style={{
          position: "absolute",
          left: "25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2
        }}
      >
        <BsCartPlus size={22} />
      </motion.div>

      <motion.span
        variants={{
          initial: { x: 0 },
          hover: { x: 18 },
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }}
        style={{ 
          fontWeight: "700",
          zIndex: 1,
          display: "inline-block"
        }}
      >
        {text}
      </motion.span>
      
      {/* Optional: Add a subtle overlay or shine effect like Framer buttons often have */}
      <motion.div
        variants={{
          initial: { x: "-100%" },
          hover: { x: "100%" }
        }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          zIndex: 3,
          pointerEvents: "none"
        }}
      />
    </motion.button>
  );
};

export default IconSlideButton;
