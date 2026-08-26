import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <main role="main" aria-label="Page Not Found">
            <Container className="text-center py-5 my-5">
                <div
                    className="display-1 mb-3"
                    role="img"
                    aria-label="Empty plate with fork and knife icon"
                    style={{ fontSize: '4.5rem' }}
                >
                    🍽️
                </div>
                <p className="text-muted text-uppercase fw-semibold mb-1" style={{ letterSpacing: '0.1em' }}>
                    Error 404
                </p>
                <h1 className="display-5 fw-bold mb-3">
                    Page Not Found
                </h1>
                <p className="text-secondary mb-4 mx-auto fs-5" style={{ maxWidth: '480px' }}>
                    We couldn't find the page you were looking for. Let's get you back to exploring our delicious menu!
                </p>
                <Button
                    as={Link}
                    to="/"
                    variant="success"
                    size="lg"
                    className="rounded-pill px-4 py-2 shadow-sm"
                    aria-label="Return to GoFood menu homepage"
                >
                    <i className="bi bi-house-door-fill me-2" aria-hidden="true"></i>
                    Return to Menu
                </Button>
            </Container>
        </main>
    );
}
