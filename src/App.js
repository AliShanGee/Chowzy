import React from 'react';
import Navbar from './components/Navbar';
import Home from './screens/Home';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import MyOrder from './screens/MyOrder';
import NotFound from './screens/NotFound';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CartProvider } from './components/ContextReducer';
import Cart from './screens/cart';
import AdminPanel from './screens/AdminPanel';
import { ThemeProvider } from 'next-themes';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.toLowerCase().startsWith('/admin');

  return (
    <div>
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
