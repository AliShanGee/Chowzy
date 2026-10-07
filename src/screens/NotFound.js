import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <Container className="text-center mt-5 pt-5">
            <div className="mb-3">
                <span role="img" aria-label="Searching for food plate" className="display-1">
                    🍽️
                </span>
            </div>
            <h1 className="display-1 fw-bold text-danger mb-3">404</h1>
            <h2 className="mb-4 fs-3">Either you typed a wrong URL, or you followed a bad link.</h2>
            <Button
                as={Link}
                to="/"
                variant="success"
                size="lg"
                aria-label="Return to food menu home page"
            >
                Go Back Home
            </Button>
        </Container>
    );
}
