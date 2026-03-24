import React, { useState, useLayoutEffect, useRef } from 'react';
import { Container, Row, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PasswordStrengthBar from 'react-password-strength-bar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Lottie from 'lottie-react';
import animationData from '../animations/Gradient Dots Background.json';

import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

// Make react-phone-number-input match Bootstrap sizing
const phoneInputStyles = `
.PhoneInput {
  display: flex;
  align-items: center;
  width: 100%;
}
.PhoneInputCountry {
  margin-left: 0.5rem;
}
.PhoneInputInput.form-control {
  height: calc(2.375rem + 2px);
  line-height: 1.5;
}
`;

export default function SignUp() {

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    geolocation: ""
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const titleRef = useRef(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const addressInputRef = useRef(null);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!credentials.phone) {
      Swal.fire({
        icon: "warning",
        title: "Phone Required",
        text: "Please enter phone number"
      })
      return
    }

    if (!credentials.geolocation || credentials.geolocation.trim() === "") {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Address is required.'
      });
      return;
    }

    try {

      const response = await fetch("http://localhost:5000/api/createuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          phone: credentials.phone,
          geolocation: credentials.geolocation
        })
      });

      const json = await response.json();

      if (!json.success) {

        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: json.message || "Please enter valid credentials."
        });

      } else {

        await Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'Your account has been created successfully.',
          timer: 2500,
          showConfirmButton: false
        });

        navigate("/login");

      }

    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Signup Error',
        text: "An unexpected error occurred."
      });

    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGetLocation = async () => {

    if (!navigator.geolocation) {
      Swal.fire('Geolocation not supported');
      return;
    }

    setIsFetchingLocation(true);

    const success = async (position) => {

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const apiKey = 'YOUR_OPENCAGE_API_KEY';
      const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

      try {

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {

          const address = data.results[0].formatted;
          setCredentials({ ...credentials, geolocation: address });

        } else {

          Swal.fire('Location not found.');

        }

      } catch (error) {

        Swal.fire('Error fetching address.');

      } finally {

        setIsFetchingLocation(false);

      }

    };

    const error = () => {

      Swal.fire('Unable to retrieve your location.');

      setCredentials({ ...credentials, geolocation: 'vehari,punjab,pakistan' });

      setIsFetchingLocation(false);

      if (addressInputRef.current) {

        addressInputRef.current.focus();
        addressInputRef.current.select();

      }

    };

    navigator.geolocation.getCurrentPosition(success, error);

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
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      style={{ position: 'relative', overflow: 'hidden' }}
      className="min-vh-100 d-flex align-items-center justify-content-center"
    >
      <style>{phoneInputStyles}</style>

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
            className="col-md-8 col-lg-6"
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

          <div className="p-4 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>

            <h2 className="text-center mb-4" ref={titleRef}>
              {'Sign Up'.split('').map((char, index) => (
                <span key={index}>{char}</span>
              ))}
            </h2>

            <Form onSubmit={handleSubmit}>

              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={credentials.name}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={credentials.email}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>

                <PhoneInput
                  international
                  defaultCountry="PK"
                  value={credentials.phone}
                  onChange={(value) =>
                    setCredentials({ ...credentials, phone: value })
                  }
                  placeholder="Enter phone number"
                  className="w-100"
                  inputClassName="form-control"
                  style={{ width: '100%' }}
                />

              </Form.Group>

              <Form.Group className="mb-2">

                <Form.Label>Password</Form.Label>

                <InputGroup>

                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={credentials.password}
                    onChange={onChange}
                  />

                  <Button
                    variant="light"
                    onClick={togglePasswordVisibility}
                    style={{ border: '1px solid #ced4da', borderLeft: 'none' }}
                  >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </Button>

                </InputGroup>

                <PasswordStrengthBar password={credentials.password} />

              </Form.Group>

              <Form.Group className="mb-3">

                <Form.Label>Address</Form.Label>

                <InputGroup>

                  <Form.Control
                    ref={addressInputRef}
                    type="text"
                    placeholder="Enter address"
                    name="geolocation"
                    value={credentials.geolocation}
                    onChange={onChange}
                  />

                  <Button
                    variant="outline-secondary"
                    onClick={handleGetLocation}
                    disabled={isFetchingLocation}
                  >

                    {isFetchingLocation
                      ? <span className="spinner-border spinner-border-sm"></span>
                      : <i className="bi bi-geo-alt"></i>}

                  </Button>

                </InputGroup>

              </Form.Group>

              <div className="d-flex gap-2 mt-2">
                <Button variant="success" type="submit" className="flex-grow-1">
                  Create Account
                </Button>

                <Link to="/login" className="btn btn-danger">
                  Already a user
                </Link>
              </div>

            </Form>

          </div>

          </motion.div>

        </Row>

      </Container>

    </motion.div>

  );
}