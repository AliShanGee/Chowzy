import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import animationData from "../animations/Order success.json";
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { BsTrash } from 'react-icons/bs';

export default function Cart() {
    const [showSuccess, setShowSuccess] = useState(false);
    let data = useCart();
    let dispatch = useDispatchCart();

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    if (showSuccess) {
        return (
            <div className='m-5 w-100 text-center fs-3 text-white'>
                <Lottie animationData={animationData} style={{ height: 300, width: 300, margin: 'auto' }} />
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div>
                <div className='m-5 w-100 text-center fs-3 text-white'>The Cart is Empty!</div>
            </div>
        )
    }

    const handleCheckOut = async () => {
        let userEmail = "";
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const userObj = JSON.parse(userStr);
            userEmail = userObj.email;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/orderData`, {
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
        <div>
            <div className='container m-auto mt-5 table-responsive  table-responsive-sm table-responsive-md' >
                <table className='table table-hover'>
                  <thead className='text-success fs-4'>
                    <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Name</th>
                        <th scope='col'>Quantity</th>
                        <th scope='col'>option</th>
                        <th scope='col'>Amount</th>
                        <th scope='col'></th>
                    </tr>
                    </thead>
                    <tbody>
                        {data.map((food, index) => (
                            <tr className='text-white' key={index}>
                                <th scope='row' >{index + 1}</th>
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
                    <button className='btn bg-success mt-5 ' onClick={handleCheckOut} > Check Out </button>
                </div>
            </div>
        </div>
    )
}