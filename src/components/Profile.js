import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navham from "./Navham";
import {
  Card,
  Col,
  Container,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import "../style.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import {
  BsFillPencilFill,
  BsFillQuestionCircleFill,
  BsFillSquareFill,
} from "react-icons/bs";
import moment from "moment";
import JobSearch from "./JobSearch";
import AuthService from "../services/auth.service";
import CompanyProfile from "./CompanyProfile";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip as TooltipBS,
  XAxis,
  YAxis,
} from "recharts";
import resumesService from "../services/resumes.service";
import usersService from "../services/users.service";
import companiesresumesService from "../services/companiesresumes.service";

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [resumesLength, setResumesLength] = useState(null);
  const [userData, setUserData] = useState(null);
  const [companiesReview, setCompaniesReview] = useState(null);
  const [jobApplied, setJobApplied] = useState(null);
  const [showAppliedStatus, setShowAppliedStatus] = useState(null);
  const user = AuthService.getCurrentUser();
  const [show, setShow] = useState(false);
  const [activeApplyToJobButton, setActiveApplyToJobButton] = useState(true);
  const [activActiveFoundButton, setActiveFoundButton] = useState(false);
  const [weeklyDataSearch, setWeeklyDataSearch] = useState([]);
  const [totalWeeklyDataCount, setTotalWeeklyDataCount] = useState(0);
  const [totalWeeklyDataSearchCount, setTotalWeeklyDataSearchCount] =
    useState(0);

  useEffect(() => {
    if (location.state?.status === "success") {
      setShowAppliedStatus("Sėkmingai kandidatavai į darbo skelbimą.");
    }
  }, [location.state]);
  const handleShowFound = () => {
    setActiveApplyToJobButton(false);
    setActiveFoundButton(true);
  };
  const handleShowApply = () => {
    setActiveApplyToJobButton(true);
    setActiveFoundButton(false);
  };
  const [userDataUpdate, setUserDataUpdate] = useState({
    name: "",
    surname: "",
    email: "",
    oldPassword: "",
    password: "",
    dateOfBirth: "",
  });

  //on button save
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [errors, setErrors] = useState({});
  const [customError, setCustomError] = useState("");
  const handleUpdateUserProfile = async (event) => {
    event.preventDefault();
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };
    const checkForErrors = await usersService.updateUserData(
      userData.id,
      userDataUpdate,
      headers
    );

    if (checkForErrors === "success") {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCustomError(checkForErrors);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setUserDataUpdate({ ...userDataUpdate, [name]: value });
  };
  const fetchUserResumes = async (userId, headers) => {
    const response = await resumesService.fetchUserResumes(userId, headers);
    setResumes(response);
    setResumesLength(response.length);
  };
  const getFullUserData = async (id) => {
    const response = await usersService.getUser(id);
    setUserData(response);
    setUserDataUpdate(response);
  };

  useEffect(() => {
    if (!user && !user[1]) {
      navigate("/");
    }
    if (
      user &&
      user[1] &&
      (user[1].includes("Darbuotojas") || user[1].includes("Administratorius"))
    ) {
      const getUserResumes = async () => {
        if (user) {
          const headers = {
            Authorization: `Bearer ${user[3]}`,
          };

          fetchUserResumes(user[0], headers);
        } else {
          console.log("Neprisijungęs");
        }
      };
      const getUserData = async () => {
        if (user) {
          getFullUserData(user[0]);
        } else {
          console.log("Neprisijungęs");
        }
      };

      const getCvReviewedByCompanies = async () => {
        if (user) {
          const headers = {
            Authorization: `Bearer ${user[3]}`,
          };
          const respose =
            await companiesresumesService.getResumesViewedByCompanies(
              user[0],
              headers
            );
          setCompaniesReview(respose);
        } else {
          console.log("Neprisijungęs");
        }
      };
      const getYourJobApplies = async () => {
        if (user) {
          const respose = await usersService.getUserJobApplies(user[0]);
          setJobApplied(respose);
        } else {
          console.log("Neprisijungęs");
        }
      };
      setTimeout(function () {
        getUserData();
        getUserResumes();
        getCvReviewedByCompanies();
        getYourJobApplies();
      }, 1500);
    }
  }, []);

  const toCompanyProfile = (company) => {
    navigate(`/company/profile/${company.id}`, {
      state: {
        company: company,
      },
    });
  };
  const toSpecificJob = (job) => {
    navigate("/jobs/" + job.id, {
      state: {
        id: job.id,
      },
    });
  };
  const handleViewResume = (resumeId) => {
    window.open(`/view/resume?resumeId=${resumeId}`, "_blank");
  };

  useEffect(() => {
    const getWeeklySearch = (data, info) => {
      const weekToStart = moment().startOf("week");
      const lastFourWeeks = moment(weekToStart).subtract(3, "weeks");
      const weeks = Array.from({ length: 4 }, (_, i) =>
        moment(lastFourWeeks).add(i, "weeks").format("YYYY-MM-DD")
      );
      const weeklyData = weeks.map((week) => ({
        week,
        rado: data.filter(
          (item) =>
            moment(item.reviewDate).isSameOrAfter(week, "day") &&
            moment(item.reviewDate).isBefore(moment(week).add(7, "days"), "day")
        ).length,
        kandidatavai: info.filter(
          (item) =>
            moment(item.creationDate).isSameOrAfter(week, "day") &&
            moment(item.creationDate).isBefore(
              moment(week).add(7, "days"),
              "day"
            )
        ).length,
      }));
      return weeklyData;
    };

    if (companiesReview && jobApplied) {
      const data = getWeeklySearch(companiesReview, jobApplied);
      setWeeklyDataSearch(data);

      setTotalWeeklyDataCount(
        data.reduce((count, currentValue) => {
          return count + currentValue.kandidatavai;
        }, 0)
      );

      setTotalWeeklyDataSearchCount(
        data.reduce((count, currentValue) => {
          return count + currentValue.rado;
        }, 0)
      );
    }
  }, [jobApplied, companiesReview]);

  return (
    <>
      {user && user[1] && user[1].includes("Darbdavys") ? (
        <CompanyProfile id={user[0]} />
      ) : (
        <>
          <div>
            <Navham />
            <JobSearch />
            <Container>
              <h4 className="mb-3 text-center">Tavo profilis</h4>
              {!userData ? (
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
                <Row>
                  {showAppliedStatus ? <h4>{showAppliedStatus}</h4> : ""}
                  {userData && (
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">
                          Redaguoti profilį
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form onSubmit={handleUpdateUserProfile}>
                          {errors && (
                            <p style={{ color: "red", fontWeight: "16px" }}>
                              {customError}
                            </p>
                          )}
                          <div className="d-flex">
                            <Form.Group
                              controlId="formBasicName"
                              className="mb-3 me-3"
                              style={{ width: "50%" }}
                            >
                              <Form.Label className="fw-bold fs-5">
                                Vardas
                              </Form.Label>
                              <Form.Control
                                type="text"
                                className="border-dark"
                                defaultValue={userData.name}
                                placeholder="Įvesk vardą"
                                onChange={handleInputChange}
                                name="name"
                              />
                            </Form.Group>
                            <Form.Group
                              controlId="formBasicSurname"
                              className="mb-3"
                              style={{ width: "50%" }}
                            >
                              <Form.Label className="fw-bold fs-5">
                                Pavardė
                              </Form.Label>
                              <Form.Control
                                type="text"
                                className="border-dark"
                                defaultValue={userData.surname}
                                placeholder="Įvesk pavardę"
                                onChange={handleInputChange}
                                name="surname"
                              />
                            </Form.Group>
                          </div>
                          <Form.Group
                            controlId="formBasicEmail"
                            className="mb-3"
                          >
                            <Form.Label className="fw-bold fs-5">
                              El. paštas
                            </Form.Label>
                            <Form.Control
                              type="text"
                              className="border-dark"
                              defaultValue={userData.email}
                              placeholder="Įvesk el. pašto adresą"
                              onChange={handleInputChange}
                              name="email"
                            />
                          </Form.Group>
                          <Form.Group
                            controlId="formBasicPasswordOld"
                            className="mb-3"
                          >
                            <Form.Label className="fw-bold fs-5">
                              Senas slaptažodis
                            </Form.Label>
                            <Form.Control
                              type="password"
                              className="border-dark"
                              placeholder="Įvesk seną slaptažodį"
                              onChange={handleInputChange}
                              name="password"
                            />
                          </Form.Group>
                          <Form.Group
                            controlId="formBasicPasswordNew"
                            className="mb-3"
                          >
                            <Form.Label className="fw-bold fs-5">
                              Naujas slaptažodis
                            </Form.Label>
                            <Form.Control
                              type="password"
                              className="border-dark"
                              placeholder="Įvesk naują slaptažodį"
                              onChange={handleInputChange}
                              name="newPassword"
                            />
                          </Form.Group>
                          <Form.Group
                            controlId="formBasicDateOfBirth"
                            className="mb-3"
                          >
                            <Form.Label className="fw-bold fs-5">
                              Gimimo data
                            </Form.Label>
                            <Form.Control
                              type="date"
                              className="border-dark"
                              defaultValue={
                                userData.dateOfBirth
                                  ? userData.dateOfBirth.slice(0, 10)
                                  : ""
                              }
                              placeholder="Gimimo data"
                              onChange={handleInputChange}
                              name="date"
                            />
                          </Form.Group>
                          <div className="d-flex justify-content-end">
                            <Button
                              variant="secondary"
                              className="me-2"
                              onClick={handleClose}
                            >
                              Atšaukti
                            </Button>
                            <Button variant="success" type="submit">
                              Atnaujinti duomenis
                            </Button>
                          </div>
                        </Form>
                      </Modal.Body>
                    </Modal>
                  )}
                  <Col sm={4}>
                    {!userData ? (
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
                      <Card className="mb-4">
                        <Card.Header className="d-flex align-items-start">
                          <Card.Title className="">Apie Tave</Card.Title>
                          <div className="ms-auto">
                            <BsFillPencilFill
                              onClick={() => handleShow()}
                              className="me-2 mt-1"
                              style={{ textAlign: "right", cursor: "pointer" }}
                            />
                          </div>
                        </Card.Header>

                        <Card.Title className="ms-3 mt-2">
                          <p>
                            {userData.name} {userData.surname} (
                            {moment().diff(userData.dateOfBirth, "years")})
                          </p>
                        </Card.Title>
                        <Card.Subtitle className="text-muted ms-3 mb-2">
                          {userData.email}
                        </Card.Subtitle>
                      </Card>
                    )}

                    <Card>
                      <Card.Header>
                        <Card.Title>
                          Statistika{" "}
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip`}>
                                Pastarųjų keturių savaičių statistika.
                              </Tooltip>
                            }
                          >
                            <span>
                              <BsFillQuestionCircleFill size={15} />
                            </span>
                          </OverlayTrigger>
                        </Card.Title>
                      </Card.Header>
                      <Card.Body>
                        {(activActiveFoundButton || activeApplyToJobButton) && (
                          <AreaChart
                            width={400}
                            height={300}
                            data={weeklyDataSearch}
                            margin={{
                              top: 10,
                              right: 30,
                              left: -30,
                              bottom: 0,
                            }}
                          >
                            <defs>
                              <linearGradient
                                id="colorUv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#8884d8"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#8884d8"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                              <linearGradient
                                id="colorPv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#82ca9d"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#82ca9d"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <TooltipBS />
                            <Area
                              type="monotone"
                              dataKey="kandidatavai"
                              stroke="#8884d8"
                              fillOpacity={1}
                              fill="url(#colorUv)"
                            />
                            <Area
                              type="monotone"
                              dataKey="rado"
                              stroke="#82ca9d"
                              fillOpacity={1}
                              fill="url(#colorPv)"
                            />
                          </AreaChart>
                        )}
                        <p>
                          Iš viso kanditavai:{" "}
                          {jobApplied && totalWeeklyDataCount} kartus{" "}
                          <BsFillSquareFill style={{ color: "#8884d8" }} />
                        </p>
                        <p>
                          Iš viso Tavo CV rado:{" "}
                          {companiesReview && totalWeeklyDataSearchCount} kartus{" "}
                          <BsFillSquareFill style={{ color: "#82ca9d" }} />
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={8}>
                    <Card className="mb-3">
                      <Card.Header>
                        <div className="d-flex ">
                          <Button onClick={handleShowApply} className="me-3">
                            Kur bandei kandidatuoti?
                          </Button>
                          <Button onClick={handleShowFound}>
                            Kas Tavęs ieškojo?
                          </Button>
                        </div>
                      </Card.Header>
                      {activeApplyToJobButton && (
                        <Card.Body>
                          {jobApplied &&
                            jobApplied.map((applied) => (
                              <div key={jobApplied.id}>
                                <p>
                                  {moment(applied.creationDate).format(
                                    "YYYY-MM-DD"
                                  )}{" "}
                                  tu kanditavai į:
                                  {applied.job && (
                                    <Button
                                      variant="link"
                                      style={{ textDecoration: "none" }}
                                      onClick={() => {
                                        toCompanyProfile(applied.job.user);
                                      }}
                                    >
                                      <p className="mb-1">
                                        {applied.job.companyName}
                                      </p>
                                    </Button>
                                  )}{" "}
                                  kompanijos
                                  {applied.job && (
                                    <Button
                                      variant="link"
                                      style={{ textDecoration: "none" }}
                                      onClick={() => {
                                        toSpecificJob(applied.job);
                                      }}
                                    >
                                      <p className="mb-1">
                                        {applied.job.title}
                                      </p>
                                    </Button>
                                  )}{" "}
                                  darbo skelbimą.
                                  <br />
                                  <span
                                    onClick={() =>
                                      handleViewResume(applied.resume.id)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    {applied.resume.fullName} <br />
                                    <span className="text-muted">
                                      {applied.resume.user.email}
                                    </span>
                                  </span>
                                  <br />
                                  {applied.reviewed > 0 &&
                                  applied.reviewed === 1 ? (
                                    <span>
                                      Tavo CV ši įmonė peržiūrėjo{" "}
                                      {applied.reviewed} kartą.
                                    </span>
                                  ) : (
                                    applied.reviewed > 1 && (
                                      <span className="mt-3">
                                        Tavo CV ši įmonė peržiūrėjo{" "}
                                        {applied.reviewed} kartus.
                                      </span>
                                    )
                                  )}
                                  {applied.reviewed === 0 && (
                                    <span className="mt-3">
                                      Tavo CV įmonė dar neperžiūrėjo.
                                    </span>
                                  )}
                                </p>
                                <hr />
                              </div>
                            ))}
                        </Card.Body>
                      )}
                      {activActiveFoundButton && (
                        <Card.Body>
                          {companiesReview &&
                            companiesReview.map((review) => (
                              <div key={companiesReview.id}>
                                <p>
                                  {moment(review.reviewDate).format(
                                    "YYYY-MM-DD"
                                  )}{" "}
                                  tavo CV peržiūrėjo:
                                  {review.company && (
                                    <Button
                                      variant="link"
                                      style={{ textDecoration: "none" }}
                                      onClick={() => {
                                        toCompanyProfile(review.company);
                                      }}
                                    >
                                      <p className="mb-1">
                                        {review.company.companyName}
                                      </p>
                                    </Button>
                                  )}
                                  {review.company.email}
                                </p>
                                <hr />
                              </div>
                            ))}
                        </Card.Body>
                      )}
                    </Card>
                  </Col>
                </Row>
              )}
            </Container>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
export default Profile;
