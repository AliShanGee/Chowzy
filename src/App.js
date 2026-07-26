import React, { useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar.js';
import Home from './screens/Home.js';
import Login from './screens/Login.js';
import SignUp from './screens/SignUp.js';
import NotFound from './screens/NotFound.js';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CartProvider, useDispatchCart } from './components/ContextReducer.js';
import { ThemeProvider } from 'next-themes';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import API_BASE_URL from './config.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FloatingReelButton from './components/FloatingReelButton.js';
import useUserStore from './store/useUserStore';

// Lazy load heavy route components to optimize initial bundle size
const MyOrder = lazy(() => import('./screens/MyOrder.js'));
const Reels = lazy(() => import('./screens/Reels.js'));
const Cart = lazy(() => import('./screens/cart.js'));
const AdminPanel = lazy(() => import('./screens/AdminPanel.js'));

// Reusable spinner component for route lazy loading suspense fallback
const RouteSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
    <div className="spinner-border text-success" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.toLowerCase().startsWith('/admin');
  const isReelsPage = location.pathname.toLowerCase() === '/reels';
  const user = useUserStore(state => state.user);
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
      {user && !isAdminRoute && !isReelsPage && <FloatingReelButton />}
      <Suspense fallback={<RouteSpinner />}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/myOrder" element={<MyOrder />} />
          <Route exact path="/orderhistory" element={<MyOrder />} />
          <Route exact path="/reels" element={<Reels />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route path="/admin/*" element={
            localStorage.getItem("admin_auth") ? <AdminPanel /> : <Navigate to="/login" />
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
