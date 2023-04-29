import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navham from "./Navham";
import jwt from "jwt-decode";
import axios from "axios";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Resume from "./Resume";
import moment from "moment";
import { BsChevronRight } from "react-icons/bs";
import authService from "../services/auth.service";

function Jobcandidates() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [jobResumes, setJobResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const user = authService.getCurrentUser();
  const degreeStrings = [
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
    console.log(jobResumes);
    console.log(jobResumeId.id);
    if (jobResumeId.id) {
      const asd = await axios.put(
        "https://localhost:7045/api/jobsresumes/" + jobResumeId.id,
        {
          reviewed: Number(1),
        },
        {
          headers,
        }
      );
    }
  };
  const getJobResumes = () => {
    if (
      user &&
      user[1] &&
      (user[1].includes("Darbuotojas") ||
        user[1].includes("Darbdavys") ||
        user[1].includes("Administratorius"))
    ) {
      axios
        .get(
          "https://localhost:7045/api/jobsresumes/specific/" + location.state.id
        )
        .then((response) => {
          if (response.data) {
            setJobResumes(response.data);
            console.log(response.data);
          }
        })
        .catch(function (error) {
          console.log(error);
          console.log(error.message);
        });
    }
  };
  const getUserResumes = () => {
    if (
      user &&
      user[1] &&
      (user[1].includes("Darbuotojas") ||
        user[1].includes("Darbdavys") ||
        user[1].includes("Administratorius"))
    ) {
      axios
        .get("https://localhost:7045/api/jobsresumes/" + location.state.id)
        .then((response) => {
          if (response.data) {
            setResumes(response.data);
          }
        })
        .catch(function (error) {
          console.log(error);
          console.log(error.message);
        });
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
          {selectedResume === null ? (
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
                    <Card key={resume.id} className="m-2">
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
          )}
          <Col sm={8}>
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
