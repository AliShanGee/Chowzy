import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Container, Row, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Lottie from 'lottie-react';
import animationData from '../animations/Gradient Dots Background.json';
import API_BASE_URL from '../config';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const titleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.email === "alishan1@gmail.com" && credentials.password === "123456") {
      localStorage.setItem("admin_auth", "alishan1@gmail.com");
      await Swal.fire({
        icon: 'success',
        title: 'Logged in as Admin!',
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/admin');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/loginuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      if (!json.success) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: json.message || "Please check your credentials and try again.",
        });
      } else {
        localStorage.setItem("authToken", json.authToken);
        localStorage.setItem("user", JSON.stringify(json.user)); // Store user details
        await Swal.fire({
          icon: 'success',
          title: 'Logged In!',
          text: 'You have successfully logged in!',
          timer: 2000,
          showConfirmButton: false,
        });
        navigate('/');
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      if (error.message === "Failed to fetch") {
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: 'Could not connect to the server. Please make sure the backend is running and try again.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: error.message || "An error occurred during login. Please try again.",
        });
      }
    }
  }

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    if (titleEl) {
      const chars = titleEl.children;
      gsap.fromTo(
        chars,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      style={{ position: 'relative', overflow: 'hidden' }}
      className="min-vh-100 d-flex align-items-center justify-content-center"
    >
      <Lottie
        animationData={animationData}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
          zIndex: -1,
        }}
      />
      <Container>
        <Row className="w-100 justify-content-center">
          <motion.div
            className="col-md-6 col-lg-5"
            animate={{
              borderColor: [
                "rgba(8, 193, 255, 1)",
                "rgba(255, 77, 194, 1)",
                "rgba(8, 193, 255, 1)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ padding: 0, borderRadius: '0.3rem', borderWidth: '5px', borderStyle: 'solid' }}
          >
            <div className="p-4 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', height: '100%' }}>
              <h2 className="text-center mb-4" ref={titleRef}>
                {'Login'.split('').map((char, index) => (
                  <span key={index} style={{ display: 'inline-block' }}>
                    {char}
                  </span>
                ))}
              </h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    className="rounded-pill"
                    style={{ backgroundColor: 'white', border: '1px solid #ced4da' }}
                    name="email"
                    value={credentials.email}
                    onChange={onChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup className="rounded-pill" style={{ border: '1px solid #ced4da', overflow: 'hidden' }}>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="border-0"
                      style={{ backgroundColor: 'white' }}
                      name="password"
                      value={credentials.password}
                      onChange={onChange}
                    />
                    <Button variant="light" onClick={togglePasswordVisibility} className="border-0" style={{ cursor: 'pointer', backgroundColor: 'white' }}>
                      <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 rounded-pill">
                  Login
                </Button>
                <Link to="/signup" className='m-3 btn btn-danger'>I'm a new user</Link>
              </Form>
            </div>
          </motion.div>
        </Row>
      </Container>
    </motion.div>
  );
}
