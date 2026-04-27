import React, { useState, useRef, useEffect } from "react";
import BootstrapCard from "react-bootstrap/Card";
import { useDispatchCart } from "./ContextReducer";
import IconSlideButton from "./IconSlideButton";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme } from "next-themes";

const Card = React.memo((props) => {
    let dispatch = useDispatchCart();
    const { theme } = useTheme();
    const [qty, setQty] = useState(1);
    const [size, setSize] = useState("");
    const [expanded, setExpanded] = useState(false);
    const priceRef = useRef();

    // Tilt Effect Setup
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const mouseXSpring = useSpring(x, springConfig);
    const mouseYSpring = useSpring(y, springConfig);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["14deg", "-14deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);

    const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);
    const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]);
    
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
    
    // Adjust glare based on theme color intensity
    const glareOpacity = useTransform(mouseXSpring, (v) => Math.abs(v) * (theme === 'dark' ? 0.6 : 0.4));

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPercentage = (mouseX / width) - 0.5;
        const yPercentage = (mouseY / height) - 0.5;

        x.set(xPercentage);
        y.set(yPercentage);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    let options = props.options || {};
    let priceOptions = Object.keys(options);
    let foodItem = props.foodItem;

    const handleAddToCart = async () => {
        await dispatch({
            type: "ADD",
            id: props.foodItem._id,
            name: props.foodItem.name,
            price: finalPrice,
            qty: qty,
            size: size,
            img: props.foodItem.img
        });
    };

    let finalPrice = qty * parseInt(options[size]);

    useEffect(() => {
        if (priceRef.current) {
            setSize(priceRef.current.value);
        }
    }, []);

    // Theme-based variables
    const isDark = theme === 'dark';
    const cardBg = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.85)";
    const textColor = isDark ? "#fff" : "#1a1a1a";
    const subTextColor = isDark ? "#adb5bd" : "#555";
    const borderColor = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";
    const shadowColor = isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.12)";

    return (
        <div 
            style={{ 
                perspective: "1500px",
                display: "inline-block",
                margin: "1.5px" // 1.5px on all sides = 3px distance between cards
            }} 
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    width: "18rem",
                    minHeight: "420px",
                    cursor: "pointer"
                }}
            >
                <BootstrapCard 
                    className="h-100 border-0 position-relative shadow-none" 
                    style={{ 
                        borderRadius: "28px",
                        overflow: "hidden",
                        background: cardBg,
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${borderColor}`,
                        transition: "background 0.3s ease, border 0.3s ease",
                        boxShadow: `0 35px 80px -20px ${shadowColor}`
                    }}
                >
                    {/* Dynamic Back Light / Shadow */}
                    <motion.div
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: -1,
                            borderRadius: "28px",
                            boxShadow: useTransform(
                                [shadowX, shadowY],
                                ([sx, sy]) => `${sx}px ${sy}px 60px ${shadowColor}`
                            )
                        }}
                    />

                    {/* Glare Component */}
                    <motion.div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: `radial-gradient(circle at ${glareX} ${glareY}, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)'} 0%, transparent 80%)`,
                            opacity: glareOpacity,
                            pointerEvents: "none",
                            zIndex: 10
                        }}
                    />

                    <BootstrapCard.Img 
                        variant="top" 
                        src={foodItem.img} 
                        style={{ 
                            height: '210px', 
                            objectFit: 'cover',
                            borderBottom: `1px solid ${borderColor}`,
                            transform: "translateZ(40px) scale(1.05)"
                        }} 
                    />
                    <BootstrapCard.Body className="d-flex flex-column" style={{ transform: "translateZ(80px)", zIndex: 1 }}>
                        <BootstrapCard.Title className="fw-bold mb-2" style={{ fontSize: "1.5rem", color: textColor, textShadow: isDark ? "0 2px 10px rgba(0,0,0,0.3)" : "none" }}>
                            {foodItem.name}
                        </BootstrapCard.Title>
                        <BootstrapCard.Text className="mb-3" style={{ 
                            fontSize: "0.85rem", 
                            color: subTextColor, 
                            opacity: 1, 
                            lineHeight: "1.4",
                            transition: "all 0.3s ease"
                        }}>
                            {expanded ? foodItem.description : `${foodItem.description.substring(0, 60)}${foodItem.description.length > 60 ? '' : ''}`}
                            {!expanded && foodItem.description && foodItem.description.length > 60 && (
                                <span 
                                    onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
                                    style={{ color: "#28a745", cursor: "pointer", fontWeight: "bold" }}
                                >
                                    ...
                                </span>
                            )}
                            {expanded && (
                                <span 
                                    onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                                    style={{ color: "#28a745", cursor: "pointer", fontWeight: "bold", marginLeft: "5px", fontSize: "0.75rem" }}
                                >
                                    (less)
                                </span>
                            )}
                        </BootstrapCard.Text>
                        
                        <div className="mt-auto">
                            <div className="d-flex align-items-center mb-3 justify-content-between">
                                <div className="d-flex">
                                    <select 
                                        className="me-2 p-1 bg-success text-white rounded-pill border-0 px-3 shadow-sm" 
                                        style={{ outline: "none", cursor: "pointer", fontSize: "0.85rem", appearance: "none" }}
                                        onChange={(e) => setQty(e.target.value)}
                                    >
                                        {Array.from(Array(6), (e, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                    <select 
                                        className="p-1 bg-success text-white rounded-pill border-0 px-3 shadow-sm" 
                                        style={{ outline: "none", cursor: "pointer", fontSize: "0.85rem", appearance: "none" }}
                                        ref={priceRef} 
                                        onChange={(e) => setSize(e.target.value)}
                                    >
                                        {priceOptions.map((data) => (
                                            <option key={data} value={data}>{data}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="fw-bold text-success fs-4 ms-2" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                                    PKR {finalPrice}
                                </div>
                            </div>
                        </div>
                        <hr className={isDark ? "bg-light opacity-10" : "bg-dark opacity-10"} />
                        <IconSlideButton 
                            className={'btn btn-success w-100 mt-2 py-3'} 
                            style={{ borderRadius: "16px", fontWeight: "700", letterSpacing: "0.5px" }}
                            onClick={handleAddToCart} 
                            text="ADD TO CART"
                        />
                    </BootstrapCard.Body>
                </BootstrapCard>
            </motion.div>
        </div>
    );
});

export default Card;
