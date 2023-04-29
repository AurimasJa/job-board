import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navham from "./Navham";
import jwt from "jwt-decode";
import axios from "axios";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Login from "./Login";
import { BsChevronRight } from "react-icons/bs";

function ApplyToJob({ jobId }) {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const getUserResumes = () => {
    if (user) {
      const userId = user[0];
      axios
        .get("https://localhost:7045/api/resumes/user/" + userId)
        .then((response) => {
          const notHiddenRes = response.data.filter((res) => !res.isHidden);
          setResumes(notHiddenRes);
          console.log(notHiddenRes);
        })
        .catch(function (error) {
          console.log(error);
          console.log(error.message);
        });
    } else {
      console.log("Neprisijungęs");
    }
  };
  useEffect(() => {
    getUserResumes();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSelectResume = (id) => setSelectedResume(id);
  const handleApply = (id, jId) => {
    console.log(id + " " + jId);
    axios
      .post("https://localhost:7045/api/jobsresumes", {
        resumeId: id,
        jobId: jId,
      })
      .then((response) => {
        console.log("PAVYKO!");
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.message);
      });
  };
  const handleToCreateCv = () => {
    navigate("/createresume");
  };
  const handleViewResume = (resumeId) => {
    window.open(`/view/resume?resumeId=${resumeId}`, "_blank");
  };
  return (
    <>
      <div>
        <Button variant="primary" onClick={handleShow}>
          Kandidatuoti
        </Button>
        <Modal show={show} size="xl" onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Kandidatavimas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              {resumes &&
              resumes.length !== 0 &&
              user &&
              user[1] &&
              (user[1].includes("Darbuotojas") ||
                user[1].includes("Administratorius")) ? (
                <>
                  <Card.Title>Pasirink CV ir spausk kandidatuoti!</Card.Title>
                  {resumes.map((resume) => (
                    <Col key={resume.id} md={4}>
                      <Card
                        onClick={() => handleSelectResume(resume.id)}
                        className={
                          selectedResume === resume.id
                            ? "selected-resume m-2"
                            : "m-2"
                        }
                      >
                        <Card.Body>
                          <Card.Title>{resume.fullName}</Card.Title>
                          <Card.Subtitle className="mb-3 text-muted">
                            {resume.email}
                          </Card.Subtitle>
                          <Card.Text>
                            Gimimo data: {resume.yearOfBirth.slice(0, 10)}
                            <br />
                            Aprašymas: {resume.summary}
                          </Card.Text>
                          <Button
                            variant="link"
                            style={{ textDecoration: "none" }}
                            onClick={() => handleViewResume(resume.id)}
                          >
                            Plačiau <BsChevronRight />
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                  {selectedResume ? (
                    <div className="d-flex justify-content-end">
                      <Button
                        className="m-3"
                        onClick={() => handleApply(selectedResume, jobId)}
                      >
                        Kandidatuoti
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end">
                      <Button disabled>Kandidatuoti</Button>
                    </div>
                  )}
                </>
              ) : user && user[1] && user[1].includes("Darbdavys") ? (
                <>
                  <p>
                    Tu esi prisijungęs kaip <b>darbdavys</b>, norėdamas
                    kandidatuoti į darbo skelbimą turi jungtis su savo asmenine
                    paskyra.
                  </p>
                  <br />
                  <Button>
                    <Login textColorBlack="b" />
                  </Button>
                </>
              ) : user &&
                user[1] &&
                (user[1].includes("Darbuotojas") ||
                  user[1].includes("Administratorius")) ? (
                <>
                  <Button onClick={() => handleToCreateCv()}>
                    Susikurk CV
                  </Button>
                </>
              ) : (
                <>
                  <p>Kad galėtum kandidatuoti, turi:</p>
                  <br />
                  <Button>
                    <Login textColorBlack="b" />
                  </Button>
                </>
              )}
            </Row>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
export default ApplyToJob;
