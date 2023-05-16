import React, { useState, useEffect } from "react";
import authService from "../services/auth.service";
import Resume from "./Resume";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import Navham from "./Navham";
import Footer from "./Footer";
import {
  BsCloudDownloadFill,
  BsFillEyeFill,
  BsPhone,
  BsTrashFill,
} from "react-icons/bs";
import { GoMail } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DownloadResume from "./DownloadResume";
import UpdateResume from "./UpdateResume";
import resumesService from "../services/resumes.service";
import { GiReceiveMoney } from "react-icons/gi";

function Resumes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedDeleteResume, setSelectedDeleteResume] = useState(null);
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
  const fetchUserResumes = async (userId, headers) => {
    const response = await resumesService.fetchAllUserResumes(userId, headers);
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
    if (!user && !user[1]) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    getUserResumes();
  }, []);
  const handleUpdateResumeVisibility = async (isHidden, resumeId) => {
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };
    const response = await resumesService.updateResumeVisibility(
      isHidden,
      resumeId,
      headers
    );

    if (response.status === 200) window.location.reload();
  };
  const handleDeleteResume = async (resume) => {
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };

    const response = await resumesService.delete(resume.id, headers);
    if (response.status === 204) window.location.reload();
  };

  const handleToCreateCv = () => {
    navigate("/createresume");
  };
  return (
    <>
      <Navham />
      <Container>
        {resumes.length > 0 ? (
          (location.pathname === "/resume" && !selectedResume) ||
          selectedResume === null ? (
            <>
              <Row className="mt-3">
                {resumes.map((resume) => (
                  <Col key={resume.id} md={4}>
                    <Card className="mb-3 ">
                      <Card.Header>
                        <div className="d-flex justify-content-between">
                          <Card.Title>{resume.fullName}</Card.Title>
                          <div className="d-flex justify-content-end">
                            <UpdateResume resume={resume} />
                            {resume.isHidden ? (
                              <div
                                onClick={() =>
                                  handleUpdateResumeVisibility(
                                    !resume.isHidden,
                                    resume.id
                                  )
                                }
                              >
                                <span
                                  style={{ color: "red", cursor: "pointer" }}
                                >
                                  ✗
                                </span>
                              </div>
                            ) : (
                              <div
                                onClick={() =>
                                  handleUpdateResumeVisibility(
                                    !resume.isHidden,
                                    resume.id
                                  )
                                }
                              >
                                <span
                                  style={{ color: "green", cursor: "pointer" }}
                                >
                                  ✓
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Card.Text>
                          <GiReceiveMoney /> Atlyginimas nuo {resume.salary}€
                        </Card.Text>
                        <Card.Text>
                          <GoMail /> {resume.email}
                        </Card.Text>
                        <Card.Text>
                          <BsPhone /> {resume.phoneNumber}
                        </Card.Text>
                        {resume.isHidden ? (
                          <p>
                            <span style={{ color: "red" }}>✗</span> Tavo CV
                            darbdaviai nemato!
                          </p>
                        ) : (
                          <>
                            <p>
                              <span style={{ color: "green" }}>✓</span> Tavo CV
                              darbdaviai mato!
                            </p>
                          </>
                        )}
                      </Card.Body>
                      <div className="d-flex justify-content-evenly p-2">
                        <div>
                          <PDFDownloadLink
                            document={<DownloadResume formValues={resume} />}
                            fileName={resume.fullName + ".pdf"}
                          >
                            {({ blob, url, loading, error }) =>
                              loading ? (
                                "Loading document..."
                              ) : (
                                <BsCloudDownloadFill
                                  style={{ color: "#212529" }}
                                  size={30}
                                />
                              )
                            }
                          </PDFDownloadLink>
                        </div>

                        <BsFillEyeFill
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedResume(resume);
                          }}
                          size={30}
                        />

                        {location.pathname.startsWith("/resume") ? (
                          <>
                            <BsTrashFill
                              style={{ cursor: "pointer" }}
                              size={30}
                              onClick={() => setSelectedDeleteResume(resume.id)}
                            />
                            {resume && resume.id === selectedDeleteResume && (
                              <Modal
                                show={true}
                                onHide={() => setSelectedDeleteResume(null)}
                              >
                                <Card.Header>
                                  <Card.Title>
                                    <p>Ar tikrai norite ištrinti šį CV?</p>
                                  </Card.Title>
                                </Card.Header>
                                <Card.Body className="text-center">
                                  <div>
                                    <p>{resume.fullName}</p>
                                  </div>
                                  <div className="d-flex justify-content-end">
                                    <Button
                                      variant="danger"
                                      onClick={() => handleDeleteResume(resume)}
                                    >
                                      Ištrinti
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Modal>
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <Row className="mt-3">
              <Col md={4}>
                {resumes.map((resume) => (
                  <>
                    <Card
                      className={
                        selectedResume.id && selectedResume.id === resume.id
                          ? "selected-resume mb-3"
                          : "mb-3"
                      }
                    >
                      <Card.Header>
                        <div className="d-flex justify-content-between">
                          <Card.Title>{resume.fullName}</Card.Title>
                          <div className="d-flex justify-content-end">
                            <UpdateResume resume={resume} />
                            {resume.isHidden ? (
                              <div
                                onClick={() =>
                                  handleUpdateResumeVisibility(
                                    !resume.isHidden,
                                    resume.id
                                  )
                                }
                              >
                                <span
                                  style={{ color: "red", cursor: "pointer" }}
                                >
                                  ✗
                                </span>
                              </div>
                            ) : (
                              <div
                                onClick={() =>
                                  handleUpdateResumeVisibility(
                                    !resume.isHidden,
                                    resume.id
                                  )
                                }
                              >
                                <span
                                  style={{ color: "green", cursor: "pointer" }}
                                >
                                  ✓
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Card.Text>
                          <GiReceiveMoney /> Atlyginimas nuo {resume.salary}€
                        </Card.Text>
                        <Card.Text>
                          <GoMail /> {resume.email}
                        </Card.Text>
                        <Card.Text>
                          <BsPhone /> {resume.phoneNumber}
                        </Card.Text>
                        {resume.isHidden ? (
                          <p>
                            <span style={{ color: "red" }}>✗</span> Tavo CV
                            darbdaviai nemato!
                          </p>
                        ) : (
                          <>
                            <p>
                              <span style={{ color: "green" }}>✓</span> Tavo CV
                              darbdaviai mato!
                            </p>
                          </>
                        )}
                      </Card.Body>
                      <div className="d-flex justify-content-evenly p-2">
                        <div>
                          <PDFDownloadLink
                            document={<DownloadResume formValues={resume} />}
                            fileName={resume.fullName + ".pdf"}
                          >
                            {({ blob, url, loading, error }) =>
                              loading ? (
                                "Loading document..."
                              ) : (
                                <BsCloudDownloadFill
                                  style={{ color: "#212529" }}
                                  size={30}
                                />
                              )
                            }
                          </PDFDownloadLink>
                        </div>

                        <BsFillEyeFill
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedResume(resume);
                          }}
                          size={30}
                        />

                        {location.pathname.startsWith("/resume") ? (
                          <>
                            <BsTrashFill
                              size={30}
                              style={{ cursor: "pointer" }}
                              onClick={() => setSelectedDeleteResume(resume.id)}
                            />
                            {resume && resume.id === selectedDeleteResume && (
                              <Modal
                                show={true}
                                onHide={() => setSelectedDeleteResume(null)}
                              >
                                <Card.Header>
                                  <Card.Title>
                                    <p>Ar tikrai norite ištrinti šį CV?</p>
                                  </Card.Title>
                                </Card.Header>
                                <Card.Body className="text-center">
                                  <div>
                                    <p>{resume.fullName}</p>
                                  </div>
                                  <div className="d-flex justify-content-end">
                                    <Button
                                      variant="danger"
                                      onClick={() => handleDeleteResume(resume)}
                                    >
                                      Ištrinti
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Modal>
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </Card>
                  </>
                ))}
              </Col>
              <Col md={8}>
                {selectedResume && (
                  <Resume
                    formValues={selectedResume}
                    degreeStrings={degreeStrings}
                  />
                )}
              </Col>
            </Row>
          )
        ) : (
          <>
            <Card.Body>
              <h3 className="text-center">Kolkas tu neturi susikūręs CV.</h3>
              <div className="d-flex justify-content-center">
                <Button className="me-3" onClick={() => handleToCreateCv()}>
                  Susikurk CV
                </Button>
              </div>
            </Card.Body>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default Resumes;
