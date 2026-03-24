import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <Container className="text-center mt-5">
            <h1 className="display-1 fw-bold text-danger mb-4">404</h1>
            <h2 className="mb-4">Either you typed a wrong URL, or you followed a bad link.</h2>
            <Button as={Link} to="/" variant="success" size="lg">
                Go Back Home
            </Button>
        </Container>
    );
}
