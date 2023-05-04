import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navham from "./Navham";
import CountUp from "react-countup";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import authService from "../services/auth.service";
import Resume from "./Resume";
import {
  BsChevronRight,
  BsCloudDownloadFill,
  BsHeart,
  BsHeartFill,
} from "react-icons/bs";
import "../style.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DownloadResume from "./DownloadResume";
import resumesService from "../services/resumes.service";
import companiesresumesService from "../services/companiesresumes.service";

function UserResumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const user = authService.getCurrentUser();
  const [activeResumePage, setActiveResumePage] = useState("allResumes");
  const [resumesIsLoaded, setResumesIsLoaded] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [savedResumesIds, setSavedResumesIds] = useState([]);

  const [loadMore, setLoadMore] = useState(false);

  const [filteredResumes, setFilteredResumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasExperience, setHasExperience] = useState(false);
  const [position, setPosition] = useState("");
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
  function handleSaveJobClick(job) {
    const newsavedResumesIds = [...savedResumesIds, job];
    localStorage.setItem("savedResumesIds", JSON.stringify(newsavedResumesIds));
    setSavedResumesIds(newsavedResumesIds);
    updateFilteredResumes();
  }

  function handleRemoveClick(jobId) {
    const newsavedResumesIds = savedResumesIds.filter((id) => id !== jobId);
    localStorage.setItem("savedResumesIds", JSON.stringify(newsavedResumesIds));
    setSavedResumesIds(newsavedResumesIds);
    updateFilteredResumes();
  }
  useEffect(() => {
    const saveUserResumesIds =
      JSON.parse(localStorage.getItem("savedResumesIds")) || [];
    setSavedResumesIds(saveUserResumesIds);
  }, []);

  const fetchResumes = async (headers) => {
    const response = await resumesService.fetchResumes(headers);
    setResumes(response);
    setResumesIsLoaded(true);
  };
  useEffect(() => {
    if (!user && !user[1]) {
      navigate("/");
    }
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };
    fetchResumes(headers);
  }, []);
  const handleCreateCompanyResumeView = async (resumeId) => {
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };
    const response = await companiesresumesService.createCompaniesResume(
      user[0],
      resumeId,
      headers
    );
  };
  const updateFilteredResumes = () => {
    const ids = JSON.parse(localStorage.getItem("savedResumesIds"));
    var filteredResumesByIds = [];
    if (resumes && ids) {
      filteredResumesByIds = resumes.filter((resume) =>
        ids.includes(resume.id)
      );
    }
    setFilteredResumes(filteredResumesByIds);
  };
  useEffect(() => {
    if (resumesIsLoaded) {
      updateFilteredResumes();
    }
  }, [resumes]);

  const filteredResumesByTitle = resumes.filter((resume) => {
    const isTitleMatch = resume.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isPositionMatch = resume.position
      .toLowerCase()
      .includes(position.toLowerCase());
    const isExperienceMatch = resume.experiences.length > 0;

    if (position && searchQuery && hasExperience) {
      return isTitleMatch && isPositionMatch && isExperienceMatch;
    } else if (position && searchQuery && !hasExperience) {
      return false;
    } else if (position && !searchQuery && hasExperience) {
      return isPositionMatch && isExperienceMatch;
    } else if (position && !searchQuery && !hasExperience) {
      return isPositionMatch;
    } else if (!position && searchQuery && hasExperience) {
      return isTitleMatch && isExperienceMatch;
    } else if (!position && searchQuery && !hasExperience) {
      return isTitleMatch;
    } else if (!position && !searchQuery && hasExperience) {
      return isExperienceMatch;
    } else {
      return true;
    }
  });

  const filteredResumesYouLiked = filteredResumes.filter((resume) => {
    const isTitleMatch = resume.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isPositionMatch = resume.position
      .toLowerCase()
      .includes(position.toLowerCase());
    const isExperienceMatch = resume.experiences.length > 0;

    if (position && searchQuery && hasExperience) {
      return isTitleMatch && isPositionMatch && isExperienceMatch;
    } else if (position && searchQuery && !hasExperience) {
      return false;
    } else if (position && !searchQuery && hasExperience) {
      return isPositionMatch && isExperienceMatch;
    } else if (position && !searchQuery && !hasExperience) {
      return isPositionMatch;
    } else if (!position && searchQuery && hasExperience) {
      return isTitleMatch && isExperienceMatch;
    } else if (!position && searchQuery && !hasExperience) {
      return isTitleMatch;
    } else if (!position && !searchQuery && hasExperience) {
      return isExperienceMatch;
    } else {
      return true;
    }
  });
  const handleShowMoreFilters = () => {
    setLoadMore(!loadMore);
  };
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(!isPressed);
  };
  return (
    <>
      <div>
        <Navham />
        <Container>
          <h3>Darbuotojų paieška</h3>
          <div className="resumes-search">
            <Form.Group style={{ width: "50%" }} className="me-2">
              <Form.Label className="fw-bold fs-5">Vardas</Form.Label>
              <Form.Control
                type="text"
                className=""
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </Form.Group>
            <Form.Group style={{ width: "50%" }}>
              <Form.Label className="fw-bold fs-5">Pozicija</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                value={position}
                onChange={(event) => setPosition(event.target.value)}
              />
            </Form.Group>
          </div>
          <div
            className={`show-more-button ${isPressed ? "pressed" : ""}, mb-1`}
            onClick={() => {
              handleShowMoreFilters();
              handleClick();
            }}
          >
            Daugiau pasirinkimų<span className="arrow"></span>
          </div>{" "}
          {loadMore && (
            <div className="mb-3">
              <div>
                <Form.Check
                  type="checkbox"
                  label="Darbo patirtis privaloma"
                  checked={hasExperience}
                  onChange={(event) => {
                    setHasExperience(event.target.checked);
                  }}
                />
              </div>
            </div>
          )}
          <div className="mt-3 mb-2">
            <Button
              className="me-3"
              onClick={() => setActiveResumePage("allResumes")}
            >
              Visi CV
            </Button>
            <Button onClick={() => setActiveResumePage("likedResumes")}>
              Tau patinkantys CV
            </Button>
          </div>
          {activeResumePage === "allResumes" ? (
            <Row>
              <h3 className="mb-3">
                Visi šiuo metu esantys CV (
                {
                  <CountUp
                    start={0}
                    end={filteredResumesByTitle.length}
                    duration={3}
                  />
                }
                )
              </h3>
              <hr />
              {!selectedResume ? (
                <>
                  <Row>
                    {filteredResumesByTitle.map((resume) => (
                      <Col md={4} key={resume.id} className="">
                        <Row>
                          <Card className="mb-2" style={{ minHeight: "250px" }}>
                            <Card.Body>
                              <div className="d-flex justify-content-between">
                                <Card.Title>
                                  {resume.fullName} (
                                  {moment().diff(resume.yearOfBirth, "years")})
                                </Card.Title>{" "}
                                <div className="d-flex justify-content-between">
                                  <div className="me-3">
                                    <PDFDownloadLink
                                      document={
                                        <DownloadResume formValues={resume} />
                                      }
                                      fileName={resume.fullName + ".pdf"}
                                    >
                                      {({ blob, url, loading, error }) =>
                                        loading ? (
                                          "Loading document..."
                                        ) : (
                                          <BsCloudDownloadFill
                                            style={{ color: "#212529" }}
                                            size={25}
                                          />
                                        )
                                      }
                                    </PDFDownloadLink>
                                  </div>
                                  {!savedResumesIds.includes(resume.id) && (
                                    <BsHeart
                                      className="heart-unfill"
                                      cursor={"pointer"}
                                      size={25}
                                      onClick={() =>
                                        handleSaveJobClick(resume.id)
                                      }
                                    ></BsHeart>
                                  )}
                                  {savedResumesIds.includes(resume.id) && (
                                    <BsHeartFill
                                      className="heart-fill"
                                      cursor={"pointer"}
                                      size={25}
                                      onClick={() =>
                                        handleRemoveClick(resume.id)
                                      }
                                    ></BsHeartFill>
                                  )}
                                </div>
                              </div>
                              <Card.Subtitle className="mb-2 text-muted">
                                {resume.position}
                              </Card.Subtitle>
                              <Card.Text
                                style={{ textDecoration: "underline" }}
                              >
                                {resume.email}
                              </Card.Text>
                              <Card.Text style={{ minHeight: "70px" }}>
                                {resume.summary.length > 50 ? (
                                  <span>{resume.summary.slice(0, 80)}...</span>
                                ) : (
                                  <span>{resume.summary}</span>
                                )}
                              </Card.Text>
                              <div className="d-flex justify-content-end">
                                <Button
                                  variant="link"
                                  style={{ textDecoration: "none" }}
                                  onClick={() => {
                                    setSelectedResume(resume);
                                    handleCreateCompanyResumeView(resume.id);
                                  }}
                                >
                                  Plačiau <BsChevronRight />
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
                <>
                  <Row>
                    <Col md={4} className="">
                      {filteredResumesByTitle.map((resume) => (
                        <Card
                          key={resume.id}
                          className={
                            selectedResume.id && selectedResume.id === resume.id
                              ? "selected-resume mb-3"
                              : "mb-3"
                          }
                        >
                          <Card.Body>
                            <div className="d-flex justify-content-between">
                              <Card.Title>
                                {resume.fullName} (
                                {moment().diff(resume.yearOfBirth, "years")})
                              </Card.Title>{" "}
                              <div className="d-flex justify-content-between">
                                <div className="me-3">
                                  <PDFDownloadLink
                                    document={
                                      <DownloadResume formValues={resume} />
                                    }
                                    fileName={resume.fullName + ".pdf"}
                                  >
                                    {({ blob, url, loading, error }) =>
                                      loading ? (
                                        "Loading document..."
                                      ) : (
                                        <BsCloudDownloadFill
                                          style={{ color: "#212529" }}
                                          size={25}
                                        />
                                      )
                                    }
                                  </PDFDownloadLink>
                                </div>
                                {!savedResumesIds.includes(resume.id) && (
                                  <BsHeart
                                    className="heart-unfill"
                                    cursor={"pointer"}
                                    size={25}
                                    onClick={() =>
                                      handleSaveJobClick(resume.id)
                                    }
                                  ></BsHeart>
                                )}
                                {savedResumesIds.includes(resume.id) && (
                                  <BsHeartFill
                                    className="heart-fill"
                                    cursor={"pointer"}
                                    size={25}
                                    onClick={() => handleRemoveClick(resume.id)}
                                  ></BsHeartFill>
                                )}
                              </div>
                            </div>
                            <Card.Subtitle className="mb-2 text-muted">
                              {resume.position}
                            </Card.Subtitle>
                            <Card.Text style={{ textDecoration: "underline" }}>
                              {resume.email}
                            </Card.Text>
                            {resume.summary.length > 50 ? (
                              <span>{resume.summary.slice(0, 80)}...</span>
                            ) : (
                              <span>{resume.summary}</span>
                            )}
                            <div className="d-flex justify-content-end">
                              <Button
                                variant="link"
                                style={{ textDecoration: "none" }}
                                onClick={() => {
                                  setSelectedResume(resume);
                                  handleCreateCompanyResumeView(resume.id);
                                }}
                              >
                                Plačiau <BsChevronRight />
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </Col>
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
                </>
              )}
            </Row>
          ) : (
            <Row>
              <h3>Tau patinkantys CV ({filteredResumesYouLiked.length})</h3>
              {filteredResumesYouLiked.length > 0 ? (
                filteredResumesYouLiked && !selectedResume ? (
                  filteredResumesYouLiked.map((resume) => (
                    <Col key={resume.id} md={4}>
                      <Card className="mb-2" style={{ minHeight: "250px" }}>
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <Card.Title>
                              {resume.fullName} (
                              {moment().diff(resume.yearOfBirth, "years")})
                            </Card.Title>{" "}
                            <div className="d-flex justify-content-between">
                              <div className="me-3">
                                <PDFDownloadLink
                                  document={
                                    <DownloadResume formValues={resume} />
                                  }
                                  fileName={resume.fullName + ".pdf"}
                                >
                                  {({ blob, url, loading, error }) =>
                                    loading ? (
                                      "Loading document..."
                                    ) : (
                                      <BsCloudDownloadFill
                                        style={{ color: "#212529" }}
                                        size={25}
                                      />
                                    )
                                  }
                                </PDFDownloadLink>
                              </div>
                              {!savedResumesIds.includes(resume.id) && (
                                <BsHeart
                                  className="heart-unfill"
                                  cursor={"pointer"}
                                  size={25}
                                  onClick={() => handleSaveJobClick(resume.id)}
                                ></BsHeart>
                              )}
                              {savedResumesIds.includes(resume.id) && (
                                <BsHeartFill
                                  className="heart-fill"
                                  cursor={"pointer"}
                                  size={25}
                                  onClick={() => handleRemoveClick(resume.id)}
                                ></BsHeartFill>
                              )}
                            </div>
                          </div>
                          <Card.Subtitle className="mb-2 text-muted">
                            {resume.position}
                          </Card.Subtitle>
                          <Card.Text style={{ textDecoration: "underline" }}>
                            {resume.email}
                          </Card.Text>
                          <Card.Text style={{ minHeight: "70px" }}>
                            {resume.summary.length > 50 ? (
                              <span>{resume.summary.slice(0, 100)}...</span>
                            ) : (
                              <span>{resume.summary}</span>
                            )}
                          </Card.Text>

                          <div className="d-flex justify-content-end">
                            <Button
                              variant="link"
                              style={{ textDecoration: "none" }}
                              onClick={() => {
                                setSelectedResume(resume);
                                handleCreateCompanyResumeView(resume.id);
                              }}
                            >
                              Plačiau <BsChevronRight />
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <>
                    <Row>
                      <Col md={4} className="">
                        {filteredResumesYouLiked &&
                          filteredResumesYouLiked.map((resume) => (
                            <Card
                              key={resume.id}
                              className={
                                selectedResume.id &&
                                selectedResume.id === resume.id
                                  ? "selected-resume mb-3"
                                  : "mb-3"
                              }
                            >
                              <Card.Body>
                                <div className="d-flex justify-content-between">
                                  <Card.Title>
                                    {resume.fullName} (
                                    {moment().diff(resume.yearOfBirth, "years")}
                                    )
                                  </Card.Title>
                                  <div className="d-flex justify-content-between">
                                    <div className="me-3">
                                      <PDFDownloadLink
                                        document={
                                          <DownloadResume formValues={resume} />
                                        }
                                        fileName={resume.fullName + ".pdf"}
                                      >
                                        {({ blob, url, loading, error }) =>
                                          loading ? (
                                            "Loading document..."
                                          ) : (
                                            <BsCloudDownloadFill
                                              style={{ color: "#212529" }}
                                              size={25}
                                            />
                                          )
                                        }
                                      </PDFDownloadLink>
                                    </div>
                                    {!savedResumesIds.includes(resume.id) && (
                                      <BsHeart
                                        className="heart-unfill"
                                        cursor={"pointer"}
                                        size={20}
                                        onClick={() =>
                                          handleSaveJobClick(resume.id)
                                        }
                                      ></BsHeart>
                                    )}
                                    {savedResumesIds.includes(resume.id) && (
                                      <BsHeartFill
                                        className="heart-fill"
                                        cursor={"pointer"}
                                        size={20}
                                        onClick={() =>
                                          handleRemoveClick(resume.id)
                                        }
                                      ></BsHeartFill>
                                    )}
                                  </div>
                                </div>
                                <Card.Subtitle className="mb-2 text-muted">
                                  {resume.position}
                                </Card.Subtitle>
                                <Card.Text
                                  style={{ textDecoration: "underline" }}
                                >
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
                                      setSelectedResume(resume);
                                      handleCreateCompanyResumeView(resume.id);
                                    }}
                                  >
                                    Plačiau <BsChevronRight />
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          ))}
                      </Col>{" "}
                      <Col sm={8}>
                        {selectedResume && (
                          <Resume
                            formValues={selectedResume}
                            degreeStrings={degreeStrings}
                          />
                        )}
                      </Col>
                    </Row>
                  </>
                )
              ) : (
                <h4>
                  Jokių darbuotojų CV nesate išsisaugojęs. Norėdamas išsisaugoti
                  naudotojo CV spauskite <BsHeart />
                </h4>
              )}
            </Row>
          )}
        </Container>
      </div>

      <Footer />
    </>
  );
}
export default UserResumes;
