import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Carousel,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import moment from "moment";
import Navham from "./Navham";
import ApplyToJob from "./ApplyToJob";
import {
  BsClock,
  BsFillInfoCircleFill,
  BsFillPeopleFill,
  BsHeart,
  BsHeartFill,
  BsListTask,
  BsPersonWorkspace,
  BsTools,
} from "react-icons/bs";
import AuthService from "../services/auth.service";
import { GiReceiveMoney } from "react-icons/gi";
import { GrWorkshop } from "react-icons/gr";
import { CiTimer } from "react-icons/ci";
import { RxBackpack } from "react-icons/rx";
import { FaAddressBook, FaAddressCard, FaCity } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import UpdateJob from "./UpdateJob";

function Job() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedJob, setSelectedJob] = useState([]);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [jobLoaded, setJobLoaded] = useState(false);
  const [description, setDescription] = useState("");
  const [companyOffers, setCompanyOffers] = useState("");
  const [totalCandidateslength, setTotalCandidatesLength] = useState(0);
  const [selectedJobIds, setselectedJobIds] = useState([]);

  const user = AuthService.getCurrentUser();
  console.log(user);
  const today = new Date();
  async function fetchSimilarJobs() {
    const response = await axios.get(
      `https://localhost:7045/api/job/details?position=${selectedJob.position}&&city=${selectedJob.city}&&id=${location.state.id}`
    );
    setSimilarJobs(response.data);
  }
  useEffect(() => {
    setSelectedJobId(location.state.id);

    async function fetchJob() {
      axios
        .get("https://localhost:7045/api/job/" + location.state.id)
        .then((resp) => {
          setCompanyOffers(resp.data.companyOffers);
          setDescription(resp.data.description);
          const convertedCompanyOffers = resp.data.companyOffers.replace(
            /<\/?\s*br\s*\/?>/gi,
            "\n"
          );
          resp.data.companyOffers = convertedCompanyOffers
            .split("\n")
            .map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ));
          const convertedDescription = resp.data.description.replace(
            /<\/?\s*br\s*\/?>/gi,
            "\n"
          );
          resp.data.description = convertedDescription
            .split("\n")
            .map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ));
          setSelectedJob(resp.data);
          setJobLoaded(true);
        });
    }
    async function fetchTotalResumes() {
      axios
        .get("https://localhost:7045/api/jobsresumes/" + location.state.id)
        .then((resp) => {
          setTotalCandidatesLength(resp.data.length);
        });
    }
    fetchJob();
    fetchTotalResumes();
  }, [location.state.id]);

  useEffect(() => {
    if (jobLoaded) {
      fetchSimilarJobs();
    }
  }, [jobLoaded]);

  const toCandidateList = (jobId) => {
    navigate("/jobs/candidates", {
      state: {
        id: jobId,
      },
    });
  };

  const toCompanyProfile = (company) => {
    navigate("/company/profile", {
      state: {
        company: company,
      },
    });
  };

  const toSpecificJob = (job) => {
    console.log(job);
    setJobLoaded(false);
    setSelectedJobId(job.id);
    navigate("/jobs/" + job.id, {
      state: {
        id: job.id,
      },
    });
  };

  function handleSaveJobClick(job) {
    const newselectedJobIds = [...selectedJobIds, job];
    localStorage.setItem("selectedJobIds", JSON.stringify(newselectedJobIds));
    setselectedJobIds(newselectedJobIds);
  }

  function handleRemoveClick(jobId) {
    const newselectedJobIds = selectedJobIds.filter((id) => id !== jobId);
    localStorage.setItem("selectedJobIds", JSON.stringify(newselectedJobIds));
    setselectedJobIds(newselectedJobIds);
  }

  useEffect(() => {
    const savedCompanyIds =
      JSON.parse(localStorage.getItem("selectedJobIds")) || [];
    setselectedJobIds(savedCompanyIds);
  }, []);
  return (
    <>
      <div>
        <Navham />
        <Container>
          {!selectedJob.company ? (
            ""
          ) : (
            <Row>
              <Col xs={12} md={8}>
                <Row>
                  <Col key={selectedJob.id} className="mb-4">
                    <Card className="square border border-3 mt-2">
                      {/* style={{backgroundColor: "#f2f2f2"}} */}
                      <div className="d-flex flex-column flex-md-row align-items-start">
                        <img
                          src="https://via.placeholder.com/300"
                          alt="No image"
                          className=" img-fluid"
                        />
                        <div className="m-3">
                          <h4>{selectedJob.title}</h4>
                          <p className="mb-1">
                            <GiReceiveMoney /> Atlyginimas nuo:{" "}
                            {selectedJob.salary}€ iki {selectedJob.salaryUp}€
                          </p>

                          <Card.Text>Miestas: {selectedJob.city}</Card.Text>
                        </div>
                        <div className="ms-auto m-3">
                          {" "}
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-${totalCandidateslength}`}>
                                Iš viso kandidatavo: {totalCandidateslength}
                              </Tooltip>
                            }
                          >
                            <p>
                              <BsFillInfoCircleFill />
                            </p>
                          </OverlayTrigger>
                        </div>
                      </div>
                      <Card.Body>
                        <h5>Aprašymas:</h5>
                        {console.log(selectedJob.description)}
                        <Card.Text>{selectedJob.description}</Card.Text>
                        <h5>Reikalavimai:</h5>
                        {selectedJob.requirements.map((requirement) => (
                          <p key={requirement.id}>✓ {requirement.name}</p>
                        ))}

                        <h5>Įmonė siūlo:</h5>
                        <p>{selectedJob.companyOffers}</p>
                      </Card.Body>
                      <Card.Footer>
                        <small className="text-muted">
                          Skelbimas sukurtas prieš:{" "}
                          {Math.ceil(
                            moment(today, "YYYYMMDD").diff(
                              moment(selectedJob.creationDate, "YYYYMMDD"),
                              "days"
                            )
                          )}
                          dienas
                        </small>
                      </Card.Footer>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col sm={4}>
                <Card className="mt-2">
                  <Card.Header className="d-flex justify-content-between">
                    <Card.Title>Papildoma informacija</Card.Title>
                    <UpdateJob
                      job={selectedJob}
                      desc={description}
                      comp={companyOffers}
                    />
                  </Card.Header>
                  <Card.Body>
                    {selectedJob.company && (
                      <Button
                        variant="link"
                        style={{ textDecoration: "none", width: "100%" }}
                        className="fs-4"
                        onClick={() => {
                          toCompanyProfile(selectedJob.company);
                        }}
                      >
                        <p className="mb-1 justify-content-center text-center">
                          {selectedJob.company.companyName}
                        </p>
                      </Button>
                    )}
                    {selectedJob.company && (
                      <>
                        <p className="mb-1">
                          {selectedJob.company.contactPerson}
                        </p>{" "}
                        <p className="mb-1">
                          {selectedJob.company.phoneNumber}
                        </p>
                      </>
                    )}
                    {1 +
                      Math.ceil(
                        moment(selectedJob.validityDate, "YYYYMMDD").diff(
                          moment(today, "YYYYMMDD"),
                          "days"
                        )
                      ) <=
                    0 ? (
                      <Card.Text>Skelbimas nebegalioja</Card.Text>
                    ) : (
                      <Card.Text>
                        Skelbimas dar galios:{" "}
                        {1 +
                          Math.ceil(
                            moment(selectedJob.validityDate, "YYYYMMDD").diff(
                              moment(today, "YYYYMMDD"),
                              "days"
                            )
                          )}
                        dienas
                      </Card.Text>
                    )}
                    <hr />
                    {/* <div className="d-flex "> */}
                    <Card.Text>
                      <BsClock /> Darbo laikas:{" "}
                      <span> {selectedJob.totalWorkHours}</span>
                    </Card.Text>
                    {/* </div> */}
                    <Card.Text>
                      <BsPersonWorkspace /> Darbas iš namų:{" "}
                      {selectedJob.remoteWork ? "taip" : "ne"}
                    </Card.Text>
                    <Card.Text>
                      <BsFillPeopleFill /> Atranka: {selectedJob.selection}
                    </Card.Text>
                    <Card.Text>
                      <GrWorkshop /> Pozicija: {selectedJob.position}
                    </Card.Text>
                    <Card.Text>
                      <BsListTask /> Pageidaujamas darbuoto lygis:{" "}
                      {selectedJob.positionLevel}
                    </Card.Text>
                    <Card.Text>
                      <SlLocationPin /> Miestas: {selectedJob.city}
                    </Card.Text>
                    <Card.Text>
                      <FaAddressCard /> Adresas: {selectedJob.location}
                    </Card.Text>
                  </Card.Body>
                </Card>
                <div className="d-flex justify-content-end mt-2">
                  {user &&
                  user[1] &&
                  (user[1].includes("Darbdavys") ||
                    user[1].includes("Administratorius")) &&
                  user[0] === selectedJob.company.id ? (
                    <Button
                      className="me-2"
                      variant="primary"
                      onClick={() => {
                        toCandidateList(selectedJob.id);
                      }}
                    >
                      Kandidatų sąrašas
                    </Button>
                  ) : null}{" "}
                  {!selectedJobIds.includes(selectedJob.id) && (
                    <Button
                      style={{ width: "120px" }}
                      className="me-2"
                      onClick={() => handleSaveJobClick(selectedJob.id)}
                    >
                      <BsHeart
                        className="heart-unfill"
                        style={{ color: "white" }}
                      />{" "}
                      Įsiminti
                    </Button>
                  )}
                  {selectedJobIds.includes(selectedJob.id) && (
                    <Button
                      className="me-2"
                      style={{ width: "120px" }}
                      onClick={() => handleRemoveClick(selectedJob.id)}
                    >
                      <BsHeartFill className="heart-fill" /> Įsimintas
                    </Button>
                  )}
                  <ApplyToJob jobId={selectedJob.id} />
                </div>
              </Col>
            </Row>
          )}
          {similarJobs.length > 0 && (
            <>
              <h5>Panašūs skelbimai:</h5>
              <hr />
              <div className="d-flex justify-content-center align-items-center">
                <Col sm={6}>
                  <Carousel fade variant="dark">
                    {similarJobs.map((job) => (
                      <Carousel.Item key={job.id}>
                        <Card className="text-center">
                          <Card.Body>
                            <div className="ms-3">
                              <Card.Title
                                onClick={() => toSpecificJob(job)}
                                style={{ cursor: "pointer" }}
                                className="mb-3"
                              >
                                {job.title}
                              </Card.Title>
                              <Card.Subtitle className="mb-3 text-muted">
                                <GiReceiveMoney /> Alga nuo: {job.salary}€
                              </Card.Subtitle>
                              <div className="d-flex flex-column justify-content-center align-items-center">
                                <div className="d-flex  ">
                                  {job.totalWorkHours ? (
                                    <span>
                                      <BsClock /> Pilnas etatas
                                    </span>
                                  ) : (
                                    <span>
                                      <BsClock /> Pusė etato
                                    </span>
                                  )}
                                  {job.remoteWork ? (
                                    <span>
                                      <BsPersonWorkspace className="ms-5" />{" "}
                                      Nuotoliniu
                                    </span>
                                  ) : (
                                    <span>
                                      <BsTools className="ms-5" /> Darbas gyvai
                                    </span>
                                  )}
                                </div>
                                <div className="mb-4 d-flex justify-content-center align-items-center">
                                  <span>
                                    <SlLocationPin /> {job.city}
                                  </span>
                                  <span className=" align-content-between">
                                    <RxBackpack className="ms-5" />{" "}
                                    {job.position}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </Col>
              </div>
              <hr />
            </>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default Job;
