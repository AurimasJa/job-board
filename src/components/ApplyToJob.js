import React, { useEffect, useState } from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Login from "./Login";
import { BsChevronRight } from "react-icons/bs";
import resumesService from "../services/resumes.service";
import jobresumesService from "../services/jobresumes.service";

function ApplyToJob({ jobId }) {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const fetchUserResumes = async (userId, headers) => {
    const response = await resumesService.fetchUserResumes(userId, headers);
    setResumes(response);
  };
  const getUserResumes = async () => {
    if (user) {
      const userId = user[0];
      const headers = {
        Authorization: `Bearer ${user[3]}`,
      };
      fetchUserResumes(userId, headers);
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
  const handleApply = async (id, jId) => {
    const response = await jobresumesService.applyToJob(id, jId);
    if (response.status === 201) {
      navigate("/profile", {
        state: {
          status: "success",
        },
      });
    }
  };
  const handleToCreateCv = () => {
    navigate("/createresume");
  };
  const handleToYourResumes = () => {
    navigate("/resume");
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
                        style={{ minHeight: "350px" }}
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
                          <Card.Text style={{ minHeight: "192px" }}>
                            Gimimo data: {resume.yearOfBirth.slice(0, 10)}
                            <br />
                            {resume.summary.length > 240 ? (
                              <span>{resume.summary.slice(0, 240)}...</span>
                            ) : (
                              <span>{resume.summary}</span>
                            )}
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
                  <Card.Body>
                    <Card.Text>
                      Tu esi prisijungęs kaip <b>darbdavys</b>, norėdamas
                      kandidatuoti į darbo skelbimą turi jungtis su savo
                      asmenine paskyra.
                    </Card.Text>
                    <Button>
                      <Login textColorBlack="b" />
                    </Button>
                  </Card.Body>
                </>
              ) : user &&
                user[1] &&
                (user[1].includes("Darbuotojas") ||
                  user[1].includes("Administratorius")) ? (
                <>
                  <Card.Body>
                    <Card.Text>
                      Tavo CV nėra matomi, o jei neturi lengvai susikurk!.
                    </Card.Text>
                    <Button className="me-3" onClick={() => handleToCreateCv()}>
                      Susikurk CV
                    </Button>
                    <Button onClick={() => handleToYourResumes()}>
                      Tavo CV
                    </Button>
                  </Card.Body>
                </>
              ) : (
                <>
                  <Card.Body>
                    <Card.Text>Kad galėtum kandidatuoti, turi:</Card.Text>
                    <Button>
                      <Login textColorBlack="b" />
                    </Button>
                  </Card.Body>
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
