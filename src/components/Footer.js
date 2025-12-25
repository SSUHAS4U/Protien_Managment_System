import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Footer() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  };

  return (
    <>
      <footer
        style={{
          backgroundColor: 'black',
          color: 'white',
          padding: windowWidth < 768 ? '15px 10px' : '20px 0',
          width: '100%',
        }}
      >
        <Container>
          <Row>
            <Col md={6} xs={12} className="d-flex align-items-center" style={{ justifyContent: windowWidth < 768 ? 'center' : 'flex-start', marginBottom: windowWidth < 768 ? '15px' : '0' }}>
              <h5 style={{ margin: 0, fontSize: windowWidth < 768 ? '1.2rem' : '1.5rem' }}>Protien Pro</h5>
            </Col>
            <Col md={6} xs={12} className="d-flex" style={{ justifyContent: windowWidth < 768 ? 'center' : 'flex-end' }}>
              <ul style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', justifyContent: windowWidth < 768 ? 'center' : 'flex-end' }}>
                <li style={{ marginRight: windowWidth < 768 ? '10px' : '20px', marginBottom: windowWidth < 768 ? '10px' : '0' }}>
                  <a href="/contact" style={{ ...linkStyle, fontSize: windowWidth < 768 ? '0.875rem' : '1rem' }}>
                    Contact Us
                  </a>
                </li>
                <li style={{ marginRight: windowWidth < 768 ? '10px' : '20px', marginBottom: windowWidth < 768 ? '10px' : '0' }}>
                  <a href="/signin" style={{ ...linkStyle, fontSize: windowWidth < 768 ? '0.875rem' : '1rem' }}>
                    Sign In
                  </a>
                </li>
                <li style={{ marginRight: windowWidth < 768 ? '10px' : '20px', marginBottom: windowWidth < 768 ? '10px' : '0' }}>
                  <a href="/signup" style={{ ...linkStyle, fontSize: windowWidth < 768 ? '0.875rem' : '1rem' }}>
                    Sign Up
                  </a>
                </li>
                <li>
                  <a href="/terms" style={{ ...linkStyle, fontSize: windowWidth < 768 ? '0.875rem' : '1rem' }}>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
          <hr style={{ borderColor: 'white', margin: windowWidth < 768 ? '15px 0' : '20px 0' }} />
          <Row>
            <Col className="text-center">
              <p style={{ margin: 0, fontSize: windowWidth < 768 ? '0.875rem' : '1rem' }}>© 2024 Protien Pro. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Inline CSS for the sticky footer */}
      <style jsx="true">{`
        html, body {
          height: 100%;
          margin: 0;
        }

        #root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        main {
          flex: 1;
        }

        footer {
          margin-top: auto;
        }

        a {
          color: white; // Change link color to white for better visibility
          text-decoration: none;
          transition: all 0.3s ease;
        }

        a:hover {
          text-decoration: underline; // Optional: Add underline on hover
        }
      `}</style>
    </>
  );
}
