import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navham from "./Navham";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Resume from "./Resume";
import moment from "moment";
import { BsChevronRight } from "react-icons/bs";
import authService from "../services/auth.service";
import jobresumesService from "../services/jobresumes.service";

function Jobcandidates() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [jobResumes, setJobResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const user = authService.getCurrentUser();
  const degreeStrings = [
    "Pasirinkti",
    "Vidurinis išsilavinimas",
    "Aukštesnysis/Profesinis išsilavinimas",
    "Aukštasis išsilavinimas",
    "Bakalauro laipsnis",
    "Magistro laipsnis",
    "Daktaro laipsnis",
    "Kita",
  ];
  useEffect(() => {
    if (!user && !user[1]) {
      navigate("/");
    }
  }, []);
  const handleSelectResume = (resume) => {
    setSelectedResume(resume);
  };
  const location = useLocation();
  const handleUpdateJobCandidatesCount = async (resume) => {
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };

    const jobResumeId = jobResumes.find((jobResume) => {
      return (
        jobResume.resume.id === resume.id &&
        jobResume.job.id === location.state.id
      );
    });
    if (jobResumeId.id) {
      const response = await jobresumesService.updateReview(
        jobResumeId.id,
        headers
      );
    }
  };
  const getJobResumes = async () => {
    if (
      user &&
      user[1] &&
      (user[1].includes("Darbuotojas") ||
        user[1].includes("Darbdavys") ||
        user[1].includes("Administratorius"))
    ) {
      const headers = {
        Authorization: `Bearer ${user[3]}`,
      };
      const response = await jobresumesService.specificJobResume(
        location.state.id,
        headers
      );

      setJobResumes(response);
    }
  };
  const getUserResumes = async () => {
    if (
      user &&
      user[1] &&
      (user[1].includes("Darbuotojas") ||
        user[1].includes("Darbdavys") ||
        user[1].includes("Administratorius"))
    ) {
      const headers = {
        Authorization: `Bearer ${user[3]}`,
      };
      const response = await jobresumesService.getJobResumes(
        location.state.id,
        headers
      );
      setResumes(response);
    }
  };
  useEffect(() => {
    getUserResumes();
    getJobResumes();
  }, []);

  return (
    <>
      <Navham />
      <Container>
        <Row>
          {jobResumes.length > 0 ? (
            selectedResume === null ? (
              <>
                <Row>
                  {resumes.map((resume) => (
                    <Col md={4} key={resume.id} className="">
                      <Row>
                        <Card className="mb-2 mt-2">
                          <Card.Body>
                            <div className="d-flex justify-content-between">
                              <Card.Title>
                                {resume.fullName} (
                                {moment().diff(resume.yearOfBirth, "years")})
                              </Card.Title>{" "}
                              <div className=""></div>
                            </div>
                            <Card.Subtitle className="mb-2 text-muted">
                              {resume.position}
                            </Card.Subtitle>
                            <Card.Text style={{ textDecoration: "underline" }}>
                              {resume.email}
                            </Card.Text>
                            {resume.summary.length > 50 ? (
                              <span>{resume.summary.slice(0, 100)}...</span>
                            ) : (
                              <span>{resume.summary}</span>
                            )}
                            <div className="d-flex justify-content-end">
                              <Button
                                variant="link"
                                style={{ textDecoration: "none" }}
                                onClick={() => {
                                  handleSelectResume(resume);
                                  handleUpdateJobCandidatesCount(resume);
                                }}
                              >
                                Plačiau
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Row>
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <Col md={4}>
                <>
                  <Row>
                    {resumes.map((resume) => (
                      <Card
                        key={resume.id}
                        className={
                          selectedResume.id && selectedResume.id === resume.id
                            ? "selected-resume mt-3"
                            : " mt-3"
                        }
                      >
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <Card.Title>
                              {resume.fullName} (
                              {moment().diff(resume.yearOfBirth, "years")})
                            </Card.Title>{" "}
                            <div className=""></div>
                          </div>
                          <Card.Subtitle className="mb-2 text-muted">
                            {resume.position}
                          </Card.Subtitle>
                          <Card.Text style={{ textDecoration: "underline" }}>
                            {resume.email}
                          </Card.Text>
                          {resume.summary.length > 50 ? (
                            <span>{resume.summary.slice(0, 100)}...</span>
                          ) : (
                            <span>{resume.summary}</span>
                          )}
                          <div className="d-flex justify-content-end">
                            <Button
                              variant="link"
                              style={{ textDecoration: "none" }}
                              onClick={() => {
                                handleSelectResume(resume);
                                handleUpdateJobCandidatesCount(resume);
                              }}
                            >
                              Plačiau
                              <BsChevronRight />
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </Row>
                </>
              </Col>
            )
          ) : (
            <h3 className="mt-3 text-center">
              Šiuo metu niekas dar nekandidatavo į šį darbo skelbimą.
            </h3>
          )}
          <Col sm={8} className="mt-2">
            <>
              {selectedResume && (
                <Resume
                  formValues={selectedResume}
                  degreeStrings={degreeStrings}
                />
              )}
            </>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
export default Jobcandidates;
