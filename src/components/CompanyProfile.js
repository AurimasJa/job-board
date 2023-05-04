import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navham from "./Navham";
import cities from "../data/cities";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import JobList from "./JobList";
import JobSearch from "./JobSearch";
import { BsFillPencilFill, BsPersonFill, BsPhone } from "react-icons/bs";
import { TiBusinessCard } from "react-icons/ti";
import CreateJob from "./CreateJob";
import { Typeahead } from "react-bootstrap-typeahead";
import authService from "../services/auth.service";
import { GoBrowser, GoMail } from "react-icons/go";
import { SlLocationPin } from "react-icons/sl";
import { FaAddressCard } from "react-icons/fa";
import jobService from "../services/job.service";
import usersService from "../services/users.service";

function CompanyProfile({ id }) {
  const location = useLocation();
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [companyLoaded, setCompanyLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [number, setNumber] = useState({ phoneNumber: "+3706*******" });
  function handleUnhidePhone(phoneNumber) {
    setNumber({ phoneNumber: phoneNumber });
  }
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [errors, setErrors] = useState({});
  const [customError, setCustomError] = useState("");
  const [show, setShow] = useState(false);
  const [city, setCity] = useState("");
  const user = authService.getCurrentUser();
  const [companyDataUpdate, setCompanyDataUpdate] = useState({
    name: "",
    surname: "",
    aboutSection: "",
    email: "",
    password: "",
    city: city,
    address: "",
    site: "",
    phoneNumber: "",
    oldPassword: "",
    companyName: "",
    companyCode: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setCompanyDataUpdate({ ...companyDataUpdate, [name]: value });
  };

  const handleLocationChange = (newLocation) => {
    const temp = newLocation.join("");
    setCompanyDataUpdate({
      ...companyDataUpdate,
      city: temp,
    });
    setCity(temp);
  };

  const handleUpdateCompanyProfile = async (event) => {
    event.preventDefault();
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };
    const checkForErrors = await usersService.updateCompanyData(
      user[0],
      companyDataUpdate,
      city,
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

  const fetchCompanyJobs = async (id) => {
    const companyJobs = await jobService.fetchCompanyJobs(id);
    setJobs(companyJobs.data);
  };
  const fetchCompanyIdJobs = async (companyId) => {
    const resp = await jobService.fetchCompanyJobs(companyId);
    const notHiddenJobs = resp.data.filter((job) => !job.isHidden);
    setJobs(notHiddenJobs);
  };
  const fetchUsersCompany = async (id) => {
    const resp = await usersService.getUsersCompany(id);
    setCompany(resp);
    setCompanyLoaded(true);
  };
  useEffect(() => {
    async function fetchJob() {
      if (location.pathname === "/profile") {
        fetchUsersCompany(id);
        fetchCompanyJobs(id);
      } else {
        fetchCompanyIdJobs(companyId);
        fetchUsersCompany(companyId);
      }
    }
    fetchJob();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    setCurrentPage(page);
  }, [location.search]);

  useEffect(() => {
    const itemsPerPage = 6;
    const totalItems = jobs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    setTotalPages(totalPages);
  }, [jobs]);

  const handlePageClick = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(location.search);
    params.set("page", event.target.innerText);
    navigate(`${location.pathname}?${params.toString()}`);
  };
  return (
    <>
      <div>
        <Navham />
        <JobSearch />
        <Container>
          {companyLoaded && (
            <Modal show={show} onHide={handleClose} size="lg">
              <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                  Redaguoti įmonės profilį
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleUpdateCompanyProfile}>
                  {errors && (
                    <p style={{ color: "red", fontWeight: "16px" }}>
                      {customError}
                    </p>
                  )}{" "}
                  <Form.Group controlId="formBasicCompanyName" className="mb-3">
                    <Form.Label className="fw-bold fs-5">
                      Įmonės pavadinimas
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Įvesk įmonės pavadinimą"
                      name="companyName"
                      defaultValue={company.companyName}
                      onChange={handleInputChange}
                      isInvalid={!!errors.companyName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.companyName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicCompanyCode" className="mb-3">
                    <Form.Label className="fw-bold fs-5">
                      Įmonės kodas
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Įvesk įmonės kodą"
                      name="companyCode"
                      defaultValue={Number(company.companyCode)}
                      onChange={handleInputChange}
                      isInvalid={!!errors.companyCode}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.companyCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className="d-flex">
                    <Form.Group
                      controlId="formBasicName"
                      className="mb-3 me-3"
                      style={{ width: "50%" }}
                    >
                      <Form.Label className="fw-bold fs-5">
                        Kompanijos atstovo vardas
                      </Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={company.name}
                        placeholder="Įvesk kompanijos atstovo vardą"
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
                        Kompanijos atstovo pavardė
                      </Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={company.surname}
                        placeholder="Įvesk kompanijos atstovo pavardę"
                        onChange={handleInputChange}
                        name="surname"
                      />
                    </Form.Group>
                  </div>
                  <Form.Group controlId="realPhoneNumberId" className="mb-3">
                    <Form.Label className="fw-bold fs-5">
                      Telefono numeris
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Jūsų telefono numeris"
                      defaultValue={company.phoneNumber}
                      onChange={handleInputChange}
                      isInvalid={!!errors.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    controlId="formBasicAboutSection"
                    className="mb-3"
                  >
                    <Form.Label className="fw-bold fs-5">Apie įmonę</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Įvesk apie įmonę"
                      name="aboutSection"
                      defaultValue={company.aboutSection}
                      onChange={handleInputChange}
                      isInvalid={!!errors.aboutSection}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.aboutSection}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label className="fw-bold fs-5">El. paštas</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={company.email}
                      placeholder="Įvesk el. pašto adresą"
                      onChange={handleInputChange}
                      name="email"
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPasswordOld" className="mb-3">
                    <Form.Label className="fw-bold fs-5">
                      Senas slaptažodis
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Įvesk seną slaptažodį"
                      onChange={handleInputChange}
                      name="password"
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPasswordNew" className="mb-3">
                    <Form.Label className="fw-bold fs-5">
                      Naujas slaptažodis
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Įvesk naują slaptažodį"
                      onChange={handleInputChange}
                      name="newPassword"
                    />
                  </Form.Group>
                  <Form.Group controlId="selectCity">
                    <Form.Label className="fw-bold fs-5">Miestas</Form.Label>
                    <Typeahead
                      className="d-flex justify-content-center mb-3 border-dark"
                      style={{ width: "100%" }}
                      id="cities"
                      name="cities"
                      placeholder="Pasirink miestą"
                      defaultInputValue={company.city}
                      onChange={handleLocationChange}
                      options={cities}
                      isInvalid={!!errors.city}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicAddress" className="mb-3">
                    <Form.Label className="fw-bold fs-5">
                      Kompanijos adresas
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Įvesk kompanijos adresą"
                      name="address"
                      defaultValue={company.address}
                      onChange={handleInputChange}
                      isInvalid={!!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicSite" className="mb-3">
                    <Form.Label className="fw-bold fs-5">
                      Įmonės svetainė
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Įvesk įmonės svetainę"
                      name="site"
                      defaultValue={company.site}
                      onChange={handleInputChange}
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
          {companyLoaded && (
            <>
              <div className="d-flex justify-content-between">
                <h3>{company.companyName}</h3>
                <CreateJob />
              </div>

              <p className="mt-3">{company.aboutSection}</p>
              <Row>
                <Col md={8}>
                  <JobList
                    data={jobs}
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                  <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <a
                        key={index}
                        className={`page-link ${
                          index + 1 === currentPage ? "active" : ""
                        }`}
                        href={`${location.pathname}?page=${index + 1}`}
                        onClick={handlePageClick}
                      >
                        {index + 1}
                      </a>
                    ))}
                  </div>
                </Col>
                <Col sm={4}>
                  <Card className="m-1 my-4">
                    <Card.Header className="d-flex align-items-start">
                      <Card.Title className="">Apie įmonę</Card.Title>
                      {location.pathname === "/profile" && (
                        <div className="ms-auto">
                          <BsFillPencilFill
                            onClick={() => handleShow()}
                            style={{ textAlign: "right", cursor: "pointer" }}
                          />
                        </div>
                      )}
                    </Card.Header>
                    <div className="m-3">
                      <Card.Title className="text-center">
                        {company.companyName}
                      </Card.Title>
                      <Card.Subtitle className="mt-3"></Card.Subtitle>
                      <hr />{" "}
                      <Card.Text className="m-0">
                        <TiBusinessCard className="me-2" />
                        {company.companyCode}
                      </Card.Text>
                      <Card.Text className="m-0">
                        <FaAddressCard className="me-2" />
                        {company.address}
                      </Card.Text>
                      <Card.Text className="m-0">
                        <SlLocationPin className="me-2" />
                        {company.city}
                      </Card.Text>
                    </div>
                  </Card>
                  {company.site ? (
                    <Card className="m-1 my-4">
                      <Card.Header>
                        <Card.Title> Įmonės svetainė: </Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <Card.Text>
                          <GoBrowser className="me-2" /> {company.site}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ) : (
                    ""
                  )}
                  <Card className="m-1">
                    <Card.Header>
                      <Card.Title>Atsakingas asmuo:</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <BsPersonFill className="me-2" />
                        {company.contactPerson}
                      </Card.Text>
                      <Card.Text>
                        <GoMail className="me-2" /> {company.email}
                      </Card.Text>
                      <Card.Text>
                        <BsPhone className="me-2" />{" "}
                        {number.phoneNumber.includes("*") ? (
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              handleUnhidePhone(company.phoneNumber)
                            }
                          >
                            {number.phoneNumber}
                          </span>
                        ) : (
                          <a
                            href={`tel:${number.phoneNumber}`}
                            style={{ textDecoration: "none" }}
                          >
                            {number.phoneNumber}
                          </a>
                        )}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
}
export default CompanyProfile;
