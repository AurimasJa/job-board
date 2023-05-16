import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import "../style.css"; // import your CSS file
import {
  Button,
  Card,
  Col,
  Image,
  Modal,
  Row,
  Form,
  FloatingLabel,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BsBriefcaseFill,
  BsClock,
  BsEyeFill,
  BsEyeSlashFill,
  BsHeart,
  BsHeartFill,
  BsPersonWorkspace,
  BsTools,
  BsTrashFill,
} from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { GiReceiveMoney } from "react-icons/gi";
import moment from "moment";
import JobSearch from "./JobSearch";
import authService from "../services/auth.service";
import jobService from "../services/job.service";

function JobList({ data, currentPage, totalPages }) {
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [jobs, setJobs] = useState([]);

  var displayedData = jobs.slice(startIndex, endIndex);
  const [selectedJobIds, setselectedJobIds] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [jobId, setJobId] = useState(false);
  const [showHiddenJobModal, setShowHiddenJobModal] = useState(false);
  const [showNotHiddenJobModal, setShowNotHiddenJobModal] = useState(false);
  const [sortBySalary, setSortBySalary] = useState(false);
  const [sortByDate, setSortByDate] = useState(false);
  const [sortByHidden, setSortByHidden] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const user = authService.getCurrentUser();
  const toSpecificJob = (job) => {
    navigate("/jobs/" + job.id, {
      state: {
        id: job.id,
      },
    });
  };
  useEffect(() => {
    setJobs(data);
  }, [data]);
  function handleSaveJobClick(job) {
    const newselectedJobIds = [...selectedJobIds, job];
    localStorage.setItem("selectedJobIds", JSON.stringify(newselectedJobIds));
    setselectedJobIds(newselectedJobIds);
    if (location.pathname === "/saved/jobs") {
      window.location.reload();
    }
  }

  function handleRemoveClick(jobId) {
    const newselectedJobIds = selectedJobIds.filter((id) => id !== jobId);
    localStorage.setItem("selectedJobIds", JSON.stringify(newselectedJobIds));
    setselectedJobIds(newselectedJobIds);
    if (location.pathname === "/saved/jobs") {
      window.location.reload();
    }
  }

  useEffect(() => {
    const savedCompanyIds =
      JSON.parse(localStorage.getItem("selectedJobIds")) || [];
    setselectedJobIds(savedCompanyIds);
  }, []);
  const handleUpdateJobVisibility = async (days, isHidden, jobId) => {
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };
    var today = moment();
    var validityDate = moment(today).add(days, "days");
    if (isHidden) {
      validityDate = moment();
    }
    const response = await jobService.updateJobValidity(
      validityDate,
      isHidden,
      jobId,
      headers
    );
    if (response.status === 200) window.location.reload();
  };
  const handleSortBySalary = () => {
    setSortBySalary(!sortBySalary);
    if (sortBySalary) {
      const sortedJobs = [...jobs].sort((a, b) => b.salary - a.salary);
      setJobs(sortedJobs);
      displayedData = jobs.slice(startIndex, endIndex);
    } else {
      const sortedJobs = [...jobs].sort((a, b) => a.salary - b.salary);
      setJobs(sortedJobs);
      displayedData = jobs.slice(startIndex, endIndex);
    }
  };
  const handleSortByDate = () => {
    setSortByDate(!sortByDate);
    const sortedJobs = [...jobs].sort((a, b) => {
      const dateA = new Date(a.creationDate);
      const dateB = new Date(b.creationDate);
      return sortByDate ? dateB - dateA : dateA - dateB;
    });
    setJobs(sortedJobs);
    displayedData = jobs.slice(startIndex, endIndex);
  };
  const handleSortByHidden = () => {
    setSortByHidden(!sortByHidden);
    const sortedJobs = [...jobs].sort((a, b) => {
      if (a.isHidden === b.isHidden) {
        return 0;
      } else if (a.isHidden && !b.isHidden) {
        return sortByHidden ? 1 : -1;
      } else {
        return sortByHidden ? -1 : 1;
      }
    });
    setJobs(sortedJobs);
    displayedData = jobs.slice(startIndex, endIndex);
  };

  const handleDeleteJob = async (job) => {
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };
    const response = await jobService.delete(job.id, headers);
    if (response.status === 204) window.location.reload();
  };

  const isDaySelected = !selectedDate;
  return (
    <>
      {location.pathname === "/jobs/" ? <JobSearch /> : ""}
      {jobs.length > 0 ? (
        <div className="me-2">
          <h3>Rikiuoti</h3>
          <Button className="me-2" onClick={handleSortBySalary}>
            Pagal atlyginimą {sortBySalary ? "▲" : "▼"}
          </Button>
          <Button className="me-2" onClick={handleSortByDate}>
            Pagal datą {sortByDate ? "▲" : "▼"}
          </Button>
          {location.pathname === "/profile" ? (
            <Button onClick={handleSortByHidden}>
              Pagal matomumą {sortByHidden ? "▲" : "▼"}
            </Button>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      {/* ))} */}
      <>
        <h3>
          Darbo skelbimai (
          {<CountUp start={0} end={jobs.length} duration={3} />})
        </h3>
        <hr style={{ height: "5px", borderWidth: "2px" }} />
      </>
      <Row>
        {displayedData &&
          displayedData.map((job) => (
            <React.Fragment key={job.id}>
              {job.id && (
                <>
                  {location.pathname === "/profile" ||
                  location.pathname.startsWith("/company/profile/") ? (
                    <Row key={job.id}>
                      <Col className="mb-2">
                        <Card
                          className={
                            job.isHidden
                              ? "mb-3 shadow-card hidden-job"
                              : "mb-3 shadow-card"
                          }
                          style={{
                            borderRadius: "20px",
                            border: "1px solid #f2f2f2",
                          }}
                        >
                          <Card.Header className="d-flex justify-content-between">
                            <div className="d-flex ">
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-${job.id}`}>
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
                                    cursor: "pointer",
                                  }}
                                  className=""
                                >
                                  {job.title}
                                </Card.Title>
                              </OverlayTrigger>
                            </div>
                            <div className="d-flex align-items-center ">
                              {location.pathname.startsWith("/profile") &&
                              job.isHidden ? (
                                <div
                                  onClick={() => setShowHiddenJobModal(true)}
                                  className="ms-auto me-3"
                                >
                                  <div style={{ textAlign: "right" }}>
                                    <BsEyeSlashFill
                                      style={{ cursor: "pointer" }}
                                      onClick={() => setJobId(job.id)}
                                    />
                                    {job && job.id === jobId && (
                                      <Modal
                                        show={showHiddenJobModal}
                                        onHide={() => setJobId(null)}
                                      >
                                        <Modal.Header>
                                          <Modal.Title>
                                            Ar tikrai norite padaryti šį
                                            skelbimą matomą?
                                          </Modal.Title>
                                        </Modal.Header>

                                        <Modal.Body>
                                          <Form>
                                            <FloatingLabel
                                              controlId="selectDays"
                                              label="Kiek laiko (dienomis) rodyti skelbimą"
                                            >
                                              <Form.Select
                                                onChange={(event) =>
                                                  setSelectedDate(
                                                    event.target.value
                                                  )
                                                }
                                              >
                                                <option value="">
                                                  Kiek laiko rodyti skelbimą?
                                                </option>
                                                <option value="1">1</option>
                                                <option value="7">7</option>
                                                <option value="14">14</option>
                                                <option value="30">30</option>
                                              </Form.Select>
                                            </FloatingLabel>
                                          </Form>
                                          <div className="d-flex justify-content-end">
                                            <Button
                                              className="mt-3"
                                              onClick={() =>
                                                handleUpdateJobVisibility(
                                                  selectedDate,
                                                  !job.isHidden,
                                                  jobId
                                                )
                                              }
                                              disabled={isDaySelected}
                                            >
                                              Atnaujinti
                                            </Button>
                                          </div>
                                        </Modal.Body>
                                      </Modal>
                                    )}
                                  </div>
                                </div>
                              ) : location.pathname.startsWith("/profile") &&
                                !job.isHidden ? (
                                <div
                                  className="me-3"
                                  onClick={() => setShowNotHiddenJobModal(true)}
                                  style={{ textAlign: "right" }}
                                >
                                  <BsEyeFill
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setJobId(job.id)}
                                  />
                                  {job && job.id === jobId && (
                                    <Modal
                                      show={showNotHiddenJobModal}
                                      onHide={() => setJobId(null)}
                                    >
                                      <Modal.Header>
                                        <Modal.Title>
                                          Ar tikrai norite padaryti šį skelbimą
                                          nematomą?
                                        </Modal.Title>
                                      </Modal.Header>

                                      <Modal.Body>
                                        <p>
                                          Skelbimas nebus randamas skelbimų
                                          paieškoje.
                                        </p>
                                        <div className="d-flex justify-content-end">
                                          <Button
                                            onClick={() =>
                                              handleUpdateJobVisibility(
                                                selectedDate,
                                                job.isHidden,
                                                jobId
                                              )
                                            }
                                          >
                                            Atnaujinti
                                          </Button>
                                        </div>
                                      </Modal.Body>
                                    </Modal>
                                  )}
                                </div>
                              ) : (
                                ""
                              )}
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
                              {location.pathname.startsWith("/profile") ? (
                                <>
                                  <BsTrashFill
                                    className="ms-3"
                                    onClick={() => setSelectedJob(job.id)}
                                  />
                                  {job && job.id === selectedJob && (
                                    <Modal
                                      show={true}
                                      onHide={() => setSelectedJob(null)}
                                    >
                                      <Modal.Header>
                                        <Modal.Title>
                                          Ar tikrai norite ištrinti šį skelbimą?
                                        </Modal.Title>
                                      </Modal.Header>

                                      <Modal.Body>
                                        <p>Skelbimas bus ištrintas:</p>
                                        <p className="text-center">
                                          {job.title}
                                        </p>
                                        <div className="d-flex justify-content-end">
                                          <Button
                                            variant="danger"
                                            onClick={() => handleDeleteJob(job)}
                                          >
                                            Ištrinti
                                          </Button>
                                        </div>
                                      </Modal.Body>
                                    </Modal>
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </Card.Header>

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
                                <GiReceiveMoney /> Atlyginimas nuo: {job.salary}
                                €
                              </Card.Subtitle>
                              <span> {job.totalWorkHours}</span>
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
                    </Row>
                  ) : (
                    <Col md={4}>
                      <Row key={job.id}>
                        <Col className="mb-2">
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
                                  overlay={
                                    <Tooltip id={`tooltip-${job.id}`}>
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
                                  <GiReceiveMoney /> Atlyginimas nuo:{" "}
                                  {job.salary}€
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
                      </Row>
                    </Col>
                  )}
                </>
              )}
            </React.Fragment>
          ))}
        {jobs.length > 0 ? (
          ""
        ) : location.pathname === "/profile" ||
          location.pathname === "/company/profile" ? (
          <h4 className="text-center">
            Šiuo metu įmonė nėra sukūrus skelbimų.
          </h4>
        ) : (
          <h4 className="text-center">
            Atsiprašome, tačiau pagal Jūsų užklausą darbo skelbimų neradome.
          </h4>
        )}
      </Row>
    </>
  );
}
export default JobList;
