import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import API_BASE_URL from '../config';

export default function MyOrder() {
  const [orders, setOrders] = useState([]);

  const fetchMyOrder = async () => {
    let userEmail = '';
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      userEmail = userObj.email;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/myOrderData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      const data = await res.json();

      if (data.orderData && Array.isArray(data.orderData.order_data)) {
        const formatted = data.orderData.order_data
          .slice(0)
          .reverse()
          .map(group => {
            const dateObj = group.find(item => item.order_date);
            const date = dateObj ? dateObj.order_date : 'Unknown Date';
            const items = group.filter(item => !item.order_date);
            const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

            return {
              order_date: date,
              items,
              total,
              _id: Math.random().toString(36).substr(2, 9),
            };
          });

        setOrders(formatted);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container my-4">
        <h3 className="text-white mb-4">My Orders</h3>

        {orders.length === 0 ? (
          <div className="text-center text-white">
            <h5>No past orders found.</h5>
          </div>
        ) : (
          <div className="row">
            {orders.map(order => (
              <div key={order._id} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Date & Time:</span>
                    <span>{order.order_date}</span>
                  </div>
                  <div className="card-body">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="d-flex justify-content-between align-items-center border-bottom py-2"
                      >
                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          <small className="text-muted">
                            Qty: {item.qty} | Size: {item.size}
                          </small>
                        </div>
                        <div className="fw-bold">PKR {item.price}/-</div>
                      </div>
                    ))}
                  </div>
                  <div className="card-footer d-flex justify-content-between">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold">PKR {order.total}/-</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}