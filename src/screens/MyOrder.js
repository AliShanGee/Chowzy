import React, { useEffect, useState, useRef } from 'react';
import Footer from '../components/Footer.js';
import API_BASE_URL from '../config.js';
import { useNavigate } from 'react-router-dom';
import { Store } from 'react-notifications-component';

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const notificationShown = useRef(false);

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

      let combinedOrders = [];

      // 1. Process Active Orders
      if (data.orderData && data.orderData.order_data) {
        const { order_data, delivery_status, delivery_date, delivery_time, notification_sent, _id, id } = data.orderData;
        
        // Show notification if status is not pending and notification hasn't been sent
        if (delivery_status && delivery_status !== 'pending' && !notification_sent && !notificationShown.current) {
            notificationShown.current = true;
            Store.addNotification({
                title: "Order Update! 🚚",
                message: `Your order is now ${delivery_status.replace(/_/g, ' ').toUpperCase()}. Check details below!`,
                type: "info",
                insert: "top",
                container: "top-right",
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
            
            // Mark notification as sent in backend
            fetch(`${API_BASE_URL}/api/admin/orders/${_id || id}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notification_sent: true })
            });
        }

        const activeBatch = order_data
            .slice(0)
            .reverse()
            .map((group, index) => {
              const dateObj = group.find(item => item.order_date);
              const date = dateObj ? dateObj.order_date : 'Unknown Date';
              const items = group.filter(item => !item.order_date);
              const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

              return {
                order_date: date,
                items,
                total,
                _id: Math.random().toString(36).substr(2, 9),
                delivery_status: delivery_status || 'pending', 
                delivery_date: delivery_date,
                delivery_time: delivery_time
              };
            });
        combinedOrders = [...activeBatch];
      }

      // 2. Process Delivered Orders
      if (data.deliveredData && Array.isArray(data.deliveredData)) {
        const deliveredBatch = data.deliveredData.map(order => {
          // In DeliveredOrder model, order_data is just one batch usually, but let's be safe
          const group = order.order_data[0]; 
          const dateObj = group.find(item => item.order_date);
          const date = dateObj ? dateObj.order_date : 'Unknown Date';
          const items = group.filter(item => !item.order_date);
          const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

          return {
            order_date: date,
            items,
            total,
            _id: order._id || order.id,
            delivery_status: 'delivered',
            delivery_date: order.delivery_date,
            delivery_time: order.delivery_time,
            delivered_at: order.delivered_at
          };
        });
        combinedOrders = [...combinedOrders, ...deliveredBatch];
      }

      setOrders(combinedOrders);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchMyOrder();
    
    // Set up real-time polling every 12 seconds
    const interval = setInterval(() => {
        fetchMyOrder();
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="orderhistory-container">
      <div className="container my-4">
        <div className="d-flex align-items-center mb-4">
          <button className="btn btn-secondary me-3" onClick={() => navigate(-1)}>
            &larr; Back
          </button>
          <h3 className="m-0" style={{ color: 'var(--text-color, white)' }}>My Orders</h3>
        </div>

        {orders.length === 0 ? (
          <div className="text-center text-white">
            <h5>No past orders found.</h5>
          </div>
        ) : (
          <div className="row">
            {orders.map(order => (
              <div key={order._id} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm border-0 order-card">
                  <div className="card-header d-flex flex-column border-0 order-card-header">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small text-uppercase opacity-75">Order Date</span>
                      <span className="small">{order.order_date}</span>
                    </div>
                    {order.delivery_status && (
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold small text-uppercase opacity-75">Status</span>
                            <span className={`badge rounded-pill bg-${
                                order.delivery_status === 'delivered' ? 'success' : 
                                order.delivery_status === 'cancelled' ? 'danger' :
                                order.delivery_status === 'out_for_delivery' ? 'primary' :
                                order.delivery_status === 'preparing' ? 'warning' :
                                order.delivery_status === 'scheduled' ? 'info' :
                                'secondary'
                            }`}>
                                {order.delivery_status.replace(/_/g, ' ').toUpperCase()}
                            </span>
                        </div>
                    )}
                  </div>
                  <div className="card-body">
                    {order.delivery_date && order.delivery_status !== 'delivered' && order.delivery_status !== 'cancelled' && (
                        <div className="mb-3 p-2 rounded bg-info bg-opacity-10 border border-info border-opacity-25">
                            <small className="d-block fw-bold text-info text-uppercase" style={{ fontSize: '0.7rem' }}>Scheduled For</small>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{new Date(order.delivery_date).toLocaleDateString()}</span>
                                <span className="fw-bold">{order.delivery_time}</span>
                            </div>
                        </div>
                    )}
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 py-2"
                      >
                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          <small className="opacity-75">
                            Qty: {item.qty} | Size: {item.size}
                          </small>
                        </div>
                        <div className="fw-bold">PKR {item.price}/-</div>
                      </div>
                    ))}
                  </div>
                  <div className="card-footer d-flex justify-content-between border-0 order-card-footer">
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