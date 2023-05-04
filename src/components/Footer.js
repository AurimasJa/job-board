import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer
      className="mt-auto text-white-50 bg-dark py-3 mt-5"
      style={{
        bottom: 0,
        marginTop: 0,
        width: "100%",
      }}
    >
      <Container>
        <Row>
          <Col md={4} className="text-left text-md-left">
            <p>Puslapio informacija</p>
          </Col>
          <Col md={4} className="text-center">
            <p>Aurimas Janulaitis</p>
          </Col>
          <Col md={4} className="text-center text-md-right">
            <ul className="list-unstyled">
              <li>
                <Link to="/createresume">Sukurk CV</Link>
              </li>
              <li>
                <Link to="/resume">Tavo CV</Link>
              </li>
              <li>
                <Link to="/">Pagrindinis</Link>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
