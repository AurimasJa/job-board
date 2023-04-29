import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import "../style.css"; // import your CSS file
import Footer from "./Footer";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  BsHeart,
  BsHeartFill,
  BsEyeFill,
  BsClock,
  BsPersonWorkspace,
  BsTools,
  BsBriefcaseFill,
} from "react-icons/bs";

import Navham from "./Navham";
import axios from "axios";
import moment from "moment";
import AnalyzedData from "./AnalysedData";
import JobSearch from "./JobSearch";
import Calculatesalary from "./Calculatesalary";
import { GiReceiveMoney } from "react-icons/gi";
import { SlLocationPin } from "react-icons/sl";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [averageSalary, setAverageSalary] = useState([]);
  const [biggestCompanies, setBiggestCompanies] = useState([]);
  const [location, setLocation] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedJobIds, setselectedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoaded, setJobsLoaded] = useState(false);

  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredJobs = jobs.filter((job) => {
    const isTitleMatch = job.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isLocationMatch = job.city
      .toLowerCase()
      .includes(location.toLowerCase());
    const isOptionMatch =
      selectedOptions.length === 0 ||
      selectedOptions.some((optionLabel) => job.position.includes(optionLabel));

    if (location && searchQuery && !selectedOptions.length) {
      return isTitleMatch && isLocationMatch;
    } else if (location && !searchQuery && !selectedOptions.length) {
      return isLocationMatch;
    } else if (!location && searchQuery && !selectedOptions.length) {
      return isTitleMatch;
    } else if (location && searchQuery && selectedOptions.length === 0) {
      return isTitleMatch && isLocationMatch;
    } else {
      return isOptionMatch && isLocationMatch && isTitleMatch;
    }
  });

  //######## paging
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(filteredJobs.length / itemsPerPage);

  function handleCheckboxChange(event) {
    const optionId = parseInt(event.target.value);
    const optionLabel = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedOptions([...selectedOptions, optionLabel]);
    } else {
      setSelectedOptions(
        selectedOptions.filter((label) => label !== optionLabel)
      );
    }
  }
  const [resume, setResumes] = useState();
  const [resumeCount, setResumeCount] = useState();
  const toSpecificJob = (job) => {
    navigate("/jobs/" + job.id, {
      state: {
        id: job.id,
      },
    });
  };
  useEffect(() => {
    async function fetchResumes() {
      const response = await fetch("https://localhost:7045/api/resumes");
      const data = await response.json();
      setResumes(data);
      setResumeCount(data.length);
    }
    async function fetchJob() {
      axios.get("https://localhost:7045/api/job/").then((resp) => {
        const notHiddenJobs = resp.data.filter((job) => !job.isHidden);
        setJobs(notHiddenJobs);
        setJobsLoaded(true);
      });
    }
    async function fetchAverageSalary() {
      axios.get("https://localhost:7045/api/job/average").then((resp) => {
        setAverageSalary(resp.data);
      });
    }
    async function fetchBiggestCompanies() {
      axios
        .get("https://localhost:7045/api/job/biggest/companies")
        .then((resp) => {
          setBiggestCompanies(resp.data);
        });
    }
    fetchResumes();
    fetchJob();
    fetchAverageSalary();
    fetchBiggestCompanies();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const [expandedJobId, setExpandedJobId] = useState(null);
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

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    }
  }, []);
  useEffect(() => {
    if (jobsLoaded) {
      const searchParams = new URLSearchParams(window.location.search);
      const pageParam = searchParams.get("page");
      let page = 1;
      if (pageParam) {
        page = parseInt(pageParam);
      }
      if (page > maxPage) {
        page = maxPage;
        const searchParams = new URLSearchParams();
        searchParams.append("page", page);
        const searchQuery = searchParams.toString();
        const url = searchQuery ? `/?${searchQuery}` : "/";
        navigate(url, { replace: true });
      }
      setCurrentPage(page);
    }
  }, [filteredJobs.length, itemsPerPage, maxPage, navigate]);
  const handleClick = (e, page) => {
    e.preventDefault();
    console.log(page + "Aaaaaaaaaaaaaaaaaaaaaaaaa");
    if (page > maxPage) {
      page = maxPage;
    }

    setCurrentPage(page);

    const searchParams = new URLSearchParams();
    console.log(searchParams);
    if (page > 1) {
      searchParams.append("page", page);
    }
    const searchQuery = searchParams.toString();
    const url = searchQuery ? `/?${searchQuery}` : "/";
    navigate(url);
  };

  const toCompanyProfile = (company) => {
    navigate("/company/profile", {
      state: {
        company: company,
      },
    });
  };
  const renderPagination = () => {
    const pageLinks = [];
    for (let i = 1; i <= maxPage; i++) {
      const pageNumber = i;
      pageLinks.push(
        <button
          key={i}
          onClick={(e) => handleClick(e, i)}
          className={currentPage === i ? "bold" : ""}
        >
          {pageNumber}
        </button>
      );
    }
    return (
      <div>
        <p>{pageLinks}</p>
      </div>
    );
  };

  const renderListItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return (
      <Row>
        {filteredJobs.slice(start, end).map((job) => (
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
                    <GiReceiveMoney /> Alga nuo: {job.salary}€
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
                    Vid. atlyginimas miestuose
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
              {console.log(biggestCompanies)}{" "}
              <Card style={{}}>
                <Card.Header>
                  <Card.Title className="m-1 mb-3">
                    Didžiausios įmonės
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
                    <p
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => toCompanyProfile(biggest)}
                    >
                      {biggest.companyName}
                    </p>
                    <p style={{ fontWeight: "bold" }}>50</p>
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
            <Spinner animation="grow" />
          ) : (
            <React.Fragment>
              <h3 className="mt-4 mb-1">Naujausi darbo skelbimai</h3>
              <div className="mb-2">
                <hr />
              </div>
              {renderListItems()}
              <div>{renderPagination()}</div>
            </React.Fragment>
          )}
        </Container>
      </div>
      {<Footer />}
    </>
  );
}
export default Home;
