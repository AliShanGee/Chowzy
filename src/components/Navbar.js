import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { useCart, useDispatchCart } from './ContextReducer.js';
import Lottie from "lottie-react";
import shoppingCartAnimation from "../animations/shopping cart.json";
import helloChatBotAnimation from "../animations/Hello Chat Bot.json";
import historyAnimation from "../animations/History.json";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown, Card, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { gsap } from 'gsap';
import Carousel from './Carousel.js'; // Import the Carousel component
import ChatHistory from './ChatHistory.js';
import Chatbot from './Chatbot.js';
import ThemeToggle from './ThemeToggle.js';
import { useTheme } from 'next-themes';
import AnimatedLogo from './AnimatedLogo.js'; // Import Framer animated logo

function NavScrollExample() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const [user, setUser] = useState(null);
  let data = useCart();
  const dispatchCart = useDispatchCart();
  const [showHistory, setShowHistory] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const lottieRef = useRef();

  const handleLogout = () => {
    // Clear user data from localStorage and state
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // Clear context state only (don't clear backend)
    if (dispatchCart) {
      dispatchCart({ type: "LOGOUT" });
    }
    setUser(null);
    setShowChatbot(false);
    // Switch to light mode on logout
    setTheme('light');
    navigate("/login");
  }

  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const [search, setSearch] = useState(''); // Add search state for the carousel

  useLayoutEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      setUser(JSON.parse(storedUser));
    }

    // Add hover animations to nav links
    const links = navbarRef.current.querySelectorAll('.nav-link');

    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, { scale: 1.1, duration: 0.3, ease: 'power1.out' });
      });
      link.addEventListener('mouseleave', () => {
        gsap.to(link, { scale: 1, duration: 0.3, ease: 'power1.out' });
      });
    });

    // Add hover animation to the logo
    const logo = logoRef.current;
    logo.addEventListener('mouseenter', () => {
      gsap.to(logo.children, { y: -5, stagger: 0.05, duration: 0.2, ease: 'power1.out' });
    });
    logo.addEventListener('mouseleave', () => {
      gsap.to(logo.children, { y: 0, stagger: { from: "end", amount: 0.05 }, duration: 0.2, ease: 'power1.in' });
    });

  }, [location]); // Re-run on location change to update user state if needed

  // Play animation when cart items change
  useEffect(() => {
    if (lottieRef.current && data.length > 0) {
      lottieRef.current.goToAndPlay(0, true);
    }
  }, [data.length]);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  }

  return (
    <>
      <Navbar ref={navbarRef} expand="lg" style={{ backgroundColor: '#FFE13C' }} sticky="top">
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/"
            style={{ fontWeight: 'bold', fontSize: '1.8rem', display: 'flex', overflow: 'hidden' }}
            ref={logoRef}
            onClick={() => {
              if (logoRef.current) {
                gsap.fromTo(logoRef.current.children,
                  { scale: 1 },
                  { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1, stagger: 0.02 }
                );
              }
            }}
          >
            <AnimatedLogo text="Chowzy" fontSize="1.8rem" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              navbarScroll
            >
              {(localStorage.getItem("authToken") && location.pathname !== '/orderhistory') ?
                <Nav.Link as={Link} to="/orderhistory" className="d-flex align-items-center" style={{ textDecoration: 'none' }}>
                  <div style={{ width: "40px", height: "40px" }}>
                    <Lottie
                      animationData={historyAnimation}
                      loop={true}
                      autoplay={true}
                    />
                  </div>
                </Nav.Link>
                : ""}
            </Nav>
            {(!localStorage.getItem("authToken")) ?
              <Nav>
                {location.pathname !== '/login' && (
                  <Nav.Link as={Link} to="/login" className="btn btn-success text-black mx-1" style={{ border: '2px solid green ', backgroundColor: 'white' }} >
                    Login
                  </Nav.Link>
                )}
                {location.pathname !== '/signup' && (
                  <Nav.Link as={Link} to="/signup" className="btn text-success mx-1" style={{ border: '2px solid green', backgroundColor: 'white' }}>
                    Sign Up
                  </Nav.Link>
                )}
              </Nav>
              :
              <div className='d-flex align-items-center'>
                <ThemeToggle />
                <button
                  className="btn focus-ring focus-ring-primary p-0 border-0"
                  style={{ cursor: 'pointer', width: "100px", height: "58px", overflow: "hidden", display: "flex", alignItems: "center", marginRight: "10px", backgroundColor: 'transparent' }}
                  onClick={toggleChatbot}
                  aria-label="Open food assistant chatbot"
                >
                  <Lottie
                      animationData={helloChatBotAnimation}
                      loop={true}
                      autoplay={true}
                  />
                </button>
                <Link className="btn bg-white text-success mx-2 d-flex align-items-center" to="/cart" style={{ textDecoration: 'none' }}>
                  <div style={{ width: "30px", height: "30px" }}>
                    <Lottie
                      lottieRef={lottieRef}
                      animationData={shoppingCartAnimation}
                      loop={false}
                      autoplay={false}
                    />
                  </div>
                  <span className="ms-1">Cart</span>
                  <Badge pill bg="danger" className='ms-2'>{data.length}</Badge>
                </Link>
                {showHistory && <ChatHistory show={showHistory} handleClose={() => setShowHistory(false)} />}
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="dropdown-profile" className="d-flex align-items-center">
                    <BsPersonCircle size={24} className="me-2" />
                    Profile
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="end" className="p-0 border-0 shadow-lg">
                    <Card style={{ width: '18rem' }}>
                      <Card.Body>
                        <div className="text-center mb-3">
                          <BsPersonCircle size={48} className="text-secondary" />
                        </div>
                        <Card.Title className="text-center mb-3">{user ? user.name : 'Guest'}</Card.Title>
                        <hr />
                        <Card.Text as="div">
                          <p><strong>Email:</strong> {user ? user.email : 'N/A'}</p>
                          <p><strong>Location:</strong> {user ? user.location : 'N/A'}</p>
                        </Card.Text>
                        <Button variant="outline-danger" className="w-100 mt-3" onClick={handleLogout}>
                          <IoIosLogOut className="me-2" /> Logout
                        </Button>
                      </Card.Body>
                    </Card>
                  </Dropdown.Menu>
                </Dropdown>
              </div>}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {location.pathname === '/' && <Carousel search={search} setSearch={setSearch} />}
      {showChatbot &&
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
          <Chatbot />
        </div>
      }
    </>
  );
}

export default NavScrollExample;