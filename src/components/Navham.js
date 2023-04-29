import { Navbar, Nav, Container, Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Login from "./Login";
import AuthService from "../services/auth.service";
import { BsPersonCircle } from "react-icons/bs";
import axios from "axios";

function Navham() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginModalShow = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);
  const user = AuthService.getCurrentUser();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" sticky="top" variant="dark">
      <Container>
        <Navbar.Brand href="/">JobBoard</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Pagrinidis</Nav.Link>
            {user &&
            user[1] &&
            (user[1].includes("Darbuotojas") ||
              user[1].includes("Administratorius")) ? (
              <Nav.Link href="/createresume">Sukurk CV</Nav.Link>
            ) : user && user[1] && user[1].includes("Darbdavys") ? (
              <>
                <Nav.Link onClick={handleShow}>Sukurk CV</Nav.Link>
                <Modal show={show} onHide={handleClose} size="lg">
                  <Modal.Title>
                    Tu esi prisijungęs kaip <b>darbdavys</b>, norėdamas
                    kandidatuoti į darbo skelbimą turi jungtis su savo asmenine
                    paskyra.
                  </Modal.Title>
                  <Button>
                    <Login textColorBlack="b" />
                  </Button>
                </Modal>
              </>
            ) : (
              <>
                <Nav.Link onClick={handleShow}>Sukurk CV</Nav.Link>
                <Modal show={show} onHide={handleClose} size="lg">
                  <Modal.Title>
                    Norint sukurti CV reikia prisijungti!
                  </Modal.Title>
                  <Button>
                    <Login textColorBlack="b" />
                  </Button>
                </Modal>
              </>
            )}
            {user &&
            user[1] &&
            (user[1].includes("Darbuotojas") ||
              user[1].includes("Administratorius")) ? (
              <Nav.Link href="/resume">Tavo CV</Nav.Link>
            ) : null}
          </Nav>
          <Nav>
            <Nav.Link href="/saved/jobs">Išsaugoti skelbimai</Nav.Link>
            {user &&
            user[1] &&
            (user[1].includes("Darbdavys") ||
              user[1].includes("Administratorius")) ? (
              <Nav.Link href="/user/resumes">Darbuotojų paieška</Nav.Link>
            ) : null}

            {user &&
            user[1] &&
            (user[1].includes("Darbuotojas") ||
              user[1].includes("Darbdavys") ||
              user[1].includes("Administratorius")) ? (
              <Nav.Link href="/profile">
                <BsPersonCircle /> {user[2]}
              </Nav.Link>
            ) : null}
            {/* <Nav.Link href="/jobSearch">MENU LINK</Nav.Link> */}

            {user &&
            user[1] &&
            (user[1].includes("Darbuotojas") ||
              user[1].includes("Darbdavys") ||
              user[1].includes("Administratorius")) ? (
              <Nav.Link onClick={() => AuthService.logout()}>
                Atsijungti
              </Nav.Link>
            ) : (
              <Login
                show={showLoginModal}
                handleClose={handleLoginModalClose}
              />
            )}
          </Nav>
          <Nav className="mr-auto"></Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navham;
