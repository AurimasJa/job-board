import React, { useState, useEffect } from "react";
import authService from "../services/auth.service";
import axios from "axios";
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
import moment from "moment";
import UpdateResume from "./UpdateResume";

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
  const getUserResumes = () => {
    if (user) {
      const userId = user[0];
      axios
        .get("https://localhost:7045/api/resumes/user/" + userId)
        .then((response) => {
          setResumes(response.data);
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
    const asd = await axios.put(
      `https://localhost:7045/api/resumes/visibility/${resumeId}`,
      {
        isHidden: isHidden,
      },
      {
        headers,
      }
    );
    console.log(asd);
    window.location.reload();
  };
  const handleDeleteResume = async (resume) => {
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };
    axios.delete(`https://localhost:7045/api/resumes/${resume.id}`, {
      headers,
    });
    window.location.reload();
  };
  return (
    <>
      <Navham />
      <Container>
        {/* {location.pathname === "/resume" || location.pathname === "user/resumes"
          ? "Asd"
          : "asdasddasd"} */}
        {(location.pathname === "/resume" && !selectedResume) ||
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
                              <span style={{ color: "red", cursor: "pointer" }}>
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
                              <span style={{ color: "red", cursor: "pointer" }}>
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
        )}
      </Container>
      <Footer />
    </>
  );
}

export default Resumes;
