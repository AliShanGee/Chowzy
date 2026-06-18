import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import animationData from "../animations/Order success.json";
import deleteAnimation from "../animations/Delete.json";
import { useCart, useDispatchCart } from '../components/ContextReducer.js';
import { BsArrowLeft, BsCreditCard, BsHouseDoor } from 'react-icons/bs';
import API_BASE_URL from '../config.js';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

const MockPaymentForm = ({ totalPrice, onSuccess, onCancel }) => {
    const { theme } = useTheme();
    const [processing, setProcessing] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '4242 4242 4242 4242', expiry: '12/26', cvc: '123' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleAutomatePayment = (e) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            onSuccess(`mock_tx_${Math.random().toString(36).substr(2, 9)}`);
        }, 2000);
    };

    const inputStyle = {
        background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        color: theme === 'dark' ? '#fff' : '#000',
        padding: '12px',
        borderRadius: '8px',
        width: '100%',
        marginBottom: '15px',
        outline: 'none'
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="p-4 rounded-4 shadow-lg position-relative" 
                style={{ background: theme === 'dark' ? '#111' : '#fff', maxWidth: '400px', width: '90%', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}
            >
                <button 
                    onClick={onCancel} 
                    style={{ position: 'absolute', top: 15, right: 20, background: 'transparent', border: 'none', fontSize: '24px', color: theme === 'dark' ? '#fff' : '#000', cursor: 'pointer', zIndex: 10 }}
                >
                    ✕
                </button>
                <div className="text-center mb-4">
                    <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
                        <BsCreditCard size={32} color="white" />
                    </div>
                    <h4 className={theme === 'dark' ? "text-white mb-1" : "text-dark mb-1"}>Secure Checkout</h4>
                    <p className={theme === 'dark' ? "text-white-50 small" : "text-muted small"}>Pay {totalPrice}/- via Card</p>
                </div>
                
                <form onSubmit={handleAutomatePayment}>
                    <label className={theme === 'dark' ? "text-white-50 small mb-1 d-block" : "text-muted small mb-1 d-block"}>Card Number</label>
                    <input type="text" name="number" value={cardDetails.number} onChange={handleInputChange} style={inputStyle} />
                    
                    <div className="d-flex gap-3">
                        <div className="flex-grow-1">
                            <label className={theme === 'dark' ? "text-white-50 small mb-1 d-block" : "text-muted small mb-1 d-block"}>Expiry</label>
                            <input type="text" name="expiry" value={cardDetails.expiry} onChange={handleInputChange} style={inputStyle} />
                        </div>
                        <div className="flex-grow-1">
                            <label className={theme === 'dark' ? "text-white-50 small mb-1 d-block" : "text-muted small mb-1 d-block"}>CVC</label>
                            <input type="text" name="cvc" value={cardDetails.cvc} onChange={handleInputChange} style={inputStyle} />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={processing} 
                        className="btn btn-primary w-100 py-3 mt-2 fs-5 rounded-3 border-0"
                        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
                    >
                        {processing ? "Verifying..." : `Pay Now`}
                    </button>
                    <p className="text-center mt-3 mb-0 small opacity-50 text-white-50">Demo: Card details are pre-filled.</p>
                </form>
            </motion.div>
        </div>
    );
};

export default function Cart() {
    const [showSuccess, setShowSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null); // 'cod' or 'card'
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    let data = useCart();
    let dispatch = useDispatchCart();
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
                navigate("/");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess, navigate]);

    const handleFinalCheckout = async (paymentId = null) => {
        setIsProcessing(true);
        let userEmail = "";
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const userObj = JSON.parse(userStr);
            userEmail = userObj.email;
        }

        const response = await fetch(`${API_BASE_URL}/api/orderData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_data: data,
                email: userEmail,
                order_date: new Date().toLocaleString(),
                payment_info: {
                    method: paymentMethod,
                    transactionId: paymentId
                }
            })
        });

        if (response.ok) {
            dispatch({ type: "DROP" });
            setShowSuccess(true);
            setShowPaymentModal(false);
        }
        setIsProcessing(false);
    };

    let totalPrice = data.reduce((total, food) => total + food.price, 0);

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingTop: '20px' }}>
            <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/")}
                style={{
                    position: 'fixed',
                    top: '90px',
                    left: '30px',
                    zIndex: 1001,
                    cursor: 'pointer',
                    background: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(20, 20, 20, 0.2)'}`,
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme === 'dark' ? 'white' : 'black',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                }}
            >
                <BsArrowLeft size={24} />
            </motion.div>

            {showSuccess ? (
                <div className='m-5 w-100 text-center fs-3 text-white'>
                    <Lottie animationData={animationData} style={{ height: 300, width: 300, margin: 'auto' }} />
                    <p>Order Placed Successfully!</p>
                </div>
            ) : data.length === 0 ? (
                <div className='m-5 w-100 text-center fs-3 text-white pt-5'>The Cart is Empty!</div>
            ) : (
                <div className='container m-auto mt-5 table-responsive' >
                    <table className='table table-hover'>
                      <thead className='text-success fs-4'>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Image</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Quantity</th>
                            <th scope='col'>Option</th>
                            <th scope='col'>Amount</th>
                            <th scope='col'>Handle</th>
                        </tr>
                        </thead>
                        <tbody>
                            {data.map((food, index) => (
                                <tr className='text-white' key={index} style={{ verticalAlign: 'middle' }}>
                                    <th scope='row' >{index + 1}</th>
                                    <td><img src={food.img || 'https://via.placeholder.com/60'} alt={food.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} /></td>
                                    <td >{food.name}</td>
                                    <td >{food.qty}</td>
                                    <td >{food.size}</td>
                                    <td >{food.price}</td>
                                    <td >
                                        <button
                                            type="button"
                                            className="btn p-0"
                                            style={{ background: 'transparent', border: 'none' }}
                                            onClick={() => { dispatch({ type: "REMOVE", index: index }) }}
                                            aria-label={`Remove ${food.name} from cart`}
                                        >
                                            <Lottie 
                                                animationData={deleteAnimation} 
                                                loop={true} 
                                                style={{ 
                                                    height: 40, 
                                                    width: 40, 
                                                    filter: theme === 'dark' ? 'invert(1) brightness(2)' : 'none',
                                                    cursor: 'pointer' 
                                                }} 
                                            />
                                        </button> 
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div className="mt-4 p-4 rounded shadow-lg text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h2 className='fs-2 text-white mb-4'>Total Price: {totalPrice}/-</h2>
                        <button 
                            className='btn btn-success px-5 py-3 fs-5'
                            onClick={() => setShowPaymentModal(true)}
                        >
                            Proceed to Payment
                        </button>
                    </div>

                    <AnimatePresence>
                        {showPaymentModal && (
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="p-4 rounded-4 shadow-lg position-relative" 
                                    style={{ 
                                        background: theme === 'dark' ? '#1a1a1a' : '#fff', 
                                        maxWidth: '500px', 
                                        width: '100%',
                                        border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' 
                                    }}
                                >
                                    <button 
                                        onClick={() => { setShowPaymentModal(false); setPaymentMethod(null); }} 
                                        style={{ position: 'absolute', top: 15, right: 20, background: 'transparent', border: 'none', fontSize: '24px', color: theme === 'dark' ? '#fff' : '#000', cursor: 'pointer', zIndex: 1 }}
                                    >
                                        ✕
                                    </button>

                                    <h3 className={`text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Select Payment Method</h3>
                                    
                                    <div className="d-flex flex-column gap-3">
                                        <motion.div 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`p-3 rounded-3 cursor-pointer d-flex align-items-center gap-3 ${paymentMethod === 'cod' ? 'bg-success text-white' : (theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark')}`}
                                            style={{ border: paymentMethod === 'cod' ? '2px solid #fff' : '1px solid rgba(128,128,128,0.2)', cursor: 'pointer' }}
                                        >
                                            <div className="p-2 rounded-circle bg-white bg-opacity-10">
                                                <BsHouseDoor size={24} />
                                            </div>
                                            <div>
                                                <div className="fw-bold fs-5">Cash on Delivery</div>
                                                <small className="opacity-75">Pay at your doorstep</small>
                                            </div>
                                        </motion.div>

                                        <motion.div 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setPaymentMethod('card')}
                                            className={`p-3 rounded-3 cursor-pointer d-flex align-items-center gap-3 ${paymentMethod === 'card' ? 'bg-primary text-white' : (theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark')}`}
                                            style={{ border: paymentMethod === 'card' ? '2px solid #fff' : '1px solid rgba(128,128,128,0.2)', cursor: 'pointer' }}
                                        >
                                            <div className="p-2 rounded-circle bg-white bg-opacity-10">
                                                <BsCreditCard size={24} />
                                            </div>
                                            <div>
                                                <div className="fw-bold fs-5">Credit/Debit Card</div>
                                                <small className="opacity-75">Secure Online Payment</small>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <div className="mt-4">
                                        {paymentMethod === 'cod' && (
                                            <button 
                                                className='btn btn-success w-100 py-3 fs-5 rounded-3' 
                                                onClick={() => handleFinalCheckout()} 
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? "Placing Order..." : "Confirm COD Order"}
                                            </button>
                                        )}
                                        {paymentMethod === 'card' && (
                                            <div className="mt-2">
                                                <MockPaymentForm 
                                                    totalPrice={totalPrice} 
                                                    onSuccess={(id) => handleFinalCheckout(id)} 
                                                    onCancel={() => setPaymentMethod(null)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}
