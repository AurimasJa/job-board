import React, { useState, useEffect } from "react";
import "../style.css"; // import your CSS file
import Footer from "./Footer";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  BsHeart,
  BsHeartFill,
  BsClock,
  BsPersonWorkspace,
  BsTools,
  BsBriefcaseFill,
} from "react-icons/bs";
import { MdOutlineLeaderboard } from "react-icons/md";
import Navham from "./Navham";
import moment from "moment";
import JobSearch from "./JobSearch";
import Calculatesalary from "./Calculatesalary";
import { GiReceiveMoney, GiMoneyStack } from "react-icons/gi";
import { SlLocationPin } from "react-icons/sl";
import jobService from "../services/job.service";

function Home() {
  const [averageSalary, setAverageSalary] = useState([]);
  const [biggestCompanies, setBiggestCompanies] = useState([]);
  const [selectedJobIds, setselectedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoaded, setJobsLoaded] = useState(false);

  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  const toSpecificJob = (job) => {
    navigate("/jobs/" + job.id, {
      state: {
        id: job.id,
      },
    });
  };
  const fetchBiggestCompanies = async () => {
    try {
      const biggestCompaniesService = await jobService.fetchBiggestCompanies();
      setBiggestCompanies(biggestCompaniesService);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAverageSalary = async () => {
    try {
      const averageSalary = await jobService.fetchAverageSalary();
      setAverageSalary(averageSalary);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchJob = async () => {
    const jobs = await jobService.fetchLatestJobs();
    setJobs(jobs);
    setJobsLoaded(true);
    setLoading(false);
  };
  useEffect(() => {
    fetchBiggestCompanies();
    fetchAverageSalary();
    fetchJob();
  }, []);

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

  const toCompanyProfile = (company) => {
    navigate(`/company/profile/${company.id}`, {
      state: {
        company: company,
      },
    });
  };

  const renderListItems = () => {
    return (
      <Row>
        {jobs.map((job) => (
          <Col key={job.id} md={4} className="mb-2">
            <Card
              className="mb-3 shadow-card"
              style={{
                borderRadius: "20px",
                border: "1px solid #f2f2f2",
              }}
            >
              <div className="d-flex justify-content-between">
                <div className="d-flex ">
                  <OverlayTrigger
                    placement="top"
                    style={{ whiteSpace: "nowrap", maxWidth: "300px" }}
                    overlay={
                      <Tooltip
                        style={{ maxWidth: "300px" }}
                        id={`tooltip-${job.id}`}
                      >
                        {job.title}
                      </Tooltip>
                    }
                  >
                    <Card.Title
                      onClick={() => {
                        toSpecificJob(job);
                      }}
                      style={{
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        margin: "5px",
                        cursor: "pointer",
                      }}
                      className="pt-3 ps-3"
                    >
                      {job.title}
                    </Card.Title>
                  </OverlayTrigger>
                </div>
                <div className="d-flex align-items-center pe-4 mt-3">
                  {!selectedJobIds.includes(job.id) && (
                    <BsHeart
                      className="heart-unfill"
                      cursor={"pointer"}
                      size={20}
                      onClick={() => handleSaveJobClick(job.id)}
                    ></BsHeart>
                  )}
                  {selectedJobIds.includes(job.id) && (
                    <BsHeartFill
                      className="heart-fill"
                      cursor={"pointer"}
                      size={20}
                      onClick={() => handleRemoveClick(job.id)}
                    ></BsHeartFill>
                  )}
                </div>
              </div>
              <hr />
              <div className="d-flex d-flex align-items-start m-2 ">
                <Image
                  className="m-2"
                  roundedCircle="true"
                  src="https://via.placeholder.com/150"
                  alt="No image"
                  sizes="200px"
                  fluid="true"
                />
                <div className="ms-3">
                  <Card.Subtitle className="mb-3 text-muted">
                    <GiReceiveMoney /> Atlyginimas nuo: {job.salary}€
                  </Card.Subtitle>
                  {job.totalWorkHours ? (
                    <p className="mb-1">
                      <BsClock /> Pilnas etatas
                    </p>
                  ) : (
                    <p className="mb-1">
                      <BsClock /> Pusė etato
                    </p>
                  )}
                  {job.remoteWork ? (
                    <p className="mb-1">
                      <BsPersonWorkspace /> Darbas nuotoliniu
                    </p>
                  ) : (
                    <p className="mb-1">
                      <BsTools /> Darbas gyvai
                    </p>
                  )}
                  <p className="mb-1">
                    <BsBriefcaseFill /> {job.position}
                  </p>{" "}
                  <p className="mb-1">
                    <SlLocationPin /> {job.city}
                  </p>
                </div>
              </div>
              <Card.Footer>
                <small className="text-muted">
                  Skelbimas sukurtas:{" "}
                  {moment(job.creationDate).format("YYYY-MM-DD")}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}{" "}
      </Row>
    );
  };
  return (
    <>
      <div>
        {<Navham />}

        <Container>
          <JobSearch />

          <Row>
            <h3 className="mb-1">Duomenų lentelės</h3>
            <div className="mb-2">
              <hr />
            </div>
            <Col md={4} className="mb-3">
              <Card style={{}}>
                <Card.Header>
                  <Card.Title className="m-1 mb-3">
                    <GiMoneyStack /> Vid. atlyginimas miestuose
                  </Card.Title>
                  <div className="d-flex justify-content-between">
                    <Card.Subtitle>Miestas</Card.Subtitle>
                    <Card.Subtitle>Vid. atlyginimas</Card.Subtitle>
                  </div>
                </Card.Header>
                {averageSalary.map((average, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between m-2"
                  >
                    <p style={{ fontWeight: "bold" }}>{average.cityName}</p>
                    <p style={{ fontWeight: "bold" }}>
                      {average.averageCitySalary.toFixed(2)}€
                    </p>
                  </div>
                ))}
              </Card>
            </Col>
            <Col md={5} className="mb-3">
              <Card style={{}}>
                <Card.Header>
                  <Card.Title className="m-1 mb-3">
                    <MdOutlineLeaderboard /> Didžiausios įmonės
                  </Card.Title>
                  <div className="d-flex justify-content-between">
                    <Card.Subtitle>Pavadinimas</Card.Subtitle>
                    <Card.Subtitle>Aktyvių skelbimų skaičius</Card.Subtitle>
                  </div>
                </Card.Header>
                {biggestCompanies.map((biggest) => (
                  <div
                    key={biggest.id}
                    className="d-flex justify-content-between m-2"
                  >
                    <div className="d-flex ">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-${biggest.id}`}>
                            {biggest.companyName}
                          </Tooltip>
                        }
                      >
                        <Card.Text
                          onClick={() => toCompanyProfile(biggest)}
                          style={{
                            maxWidth: "400px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          className=""
                        >
                          {biggest.companyName}
                        </Card.Text>
                      </OverlayTrigger>
                    </div>

                    <p style={{ fontWeight: "bold" }}>{biggest.jobCount}</p>
                  </div>
                ))}
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card style={{}}>
                <Calculatesalary />
              </Card>
            </Col>
          </Row>

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner animation="grow" />
            </div>
          ) : (
            <React.Fragment>
              <h3 className="mt-4 mb-1">Naujausi darbo skelbimai</h3>
              <div className="mb-2">
                <hr />
              </div>
              {renderListItems()}
            </React.Fragment>
          )}
        </Container>
      </div>
      {<Footer />}
    </>
  );
}
export default Home;
