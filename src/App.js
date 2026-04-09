import React, { useEffect } from 'react';
import Navbar from './components/Navbar.js';
import Home from './screens/Home.js';
import Login from './screens/Login.js';
import SignUp from './screens/SignUp.js';
import MyOrder from './screens/MyOrder.js';
import NotFound from './screens/NotFound.js';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CartProvider, useDispatchCart } from './components/ContextReducer.js';
import Cart from './screens/cart.js';
import AdminPanel from './screens/AdminPanel.js';
import { ThemeProvider } from 'next-themes';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import API_BASE_URL from './config.js';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.toLowerCase().startsWith('/admin');
  const dispatch = useDispatchCart();

  useEffect(() => {
    const fetchCart = async () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        const email = userObj.email;
        if (email) {
          try {
            const response = await fetch(`${API_BASE_URL}/api/getcart`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
            const json = await response.json();
            if (json.success && json.cartData) {
              dispatch({ type: "SET_CART", cart: json.cartData });
            }
          } catch (error) {
            console.error("Error fetching cart from backend:", error);
          }
        }
      }
    };
    fetchCart();
  }, [dispatch]);

  return (
    <div className="app-container">
      <ReactNotifications />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/myOrder" element={<MyOrder />} />
        <Route exact path="/orderhistory" element={<MyOrder />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route path="/admin/*" element={
          localStorage.getItem("admin_auth") ? <AdminPanel /> : <Navigate to="/login" />
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}
