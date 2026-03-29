import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import animationData from "../animations/Order success.json";
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { BsTrash, BsArrowLeft } from 'react-icons/bs';
import API_BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useTheme } from 'next-themes';

export default function Cart() {
    const [showSuccess, setShowSuccess] = useState(false);
    let data = useCart();
    let dispatch = useDispatchCart();
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const handleCheckOut = async () => {
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
                // Store full date & time so history can show both
                order_date: new Date().toLocaleString()
            })
        });

        if (response.ok) {
            dispatch({ type: "DROP" });
            setShowSuccess(true);
        }
    }

    let totalPrice = data.reduce((total, food) => total + food.price, 0)

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
                </div>
            ) : data.length === 0 ? (
                <div className='m-5 w-100 text-center fs-3 text-white'>The Cart is Empty!</div>
            ) : (
                <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md' >
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
                                    <td ><button type="button" className="btn p-0"><BsTrash onClick={() => { dispatch({ type: "REMOVE", index: index }) }} /></button> </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div><h1 className='fs-2 text-white'>Total Price: {totalPrice}/-</h1></div>
                    <div>
                        <button className='btn bg-success mt-5' onClick={handleCheckOut} > Check Out </button>
                    </div>
                </div>
            )}
        </div>
    )
}