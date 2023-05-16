import React, { useState } from "react";
import { Modal, Button, Form, Nav, Row, Col } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Spinner from "react-bootstrap/Spinner";
import { Typeahead } from "react-bootstrap-typeahead";
import cities from "../data/cities";

function Login(props) {
  const [show, setShow] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [customError, setCustomError] = useState("");
  const [showRegistrasionSuccessful, setShowRegistrasionSuccessful] =
    useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [registerData, setRegisterData] = useState({
    name: "",
    surname: "",
    email: "",
    aboutSection: "",
    password: "",
    dateOfBirth: "",
  });
  const [registerCompanyData, setRegisterCompanyData] = useState({
    name: "",
    surname: "",
    aboutSection: "",
    email: "",
    password: "",
    city: location,
    address: "",
    site: "",
    phoneNumber: "",
    companyName: "",
    companyCode: "",
  });

  const [errors, setErrors] = useState({});
  const [activeRegLog, setActiveRegLog] = useState("login");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //#########################################
  const validateLogin = (values) => {
    let errors = {};
    if (!values.email || !values.email === "")
      errors.email = "El. pašto adresas yra privalomas";
    else if (!/\S+@\S+\.\S+/.test(values.email))
      errors.email = "El. pašto adresas neteisingas. (pavyzdys@pastas.lt)";
    if (!values.password) errors.password = "Slaptažodis yra privalomas!";

    return errors;
  };
  //#########################################
  const validateUserRegister = (values) => {
    let errors = {};
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`-])[A-Za-z\d!@#$%^&,.*\/\\()_+~`-]{8,}$/;
    const emailRegex = /\S+@\S+\.\S+/;
    if (!values.email || !values.email === "")
      errors.email = "El. pašto adresas yra privalomas";
    else if (!emailRegex.test(values.email))
      errors.email = "El. pašto adresas neteisingas. (pavyzdys@pastas.lt)";
    if (!values.password || !values.password === "")
      errors.password = "Slaptažodis yra privalomas!";
    else if (!passwordRegex.test(values.password))
      errors.password =
        "Slaptažodis turi būti bent 8 simbolių ilgio ir turėti specialų simbolį (pvz. ! arba @...), didžiąją raidę ir skaičių";
    if (!values.name || !values.name === "")
      errors.name = "Vardas yra privalomas";
    if (!values.surname || !values.surname === "")
      errors.surname = "Pavardė yra privaloma";
    if (!values.dateOfBirth || values.dateOfBirth === "")
      errors.dateOfBirth = "Neteisinga data";

    return errors;
  };

  const validateCompanyRegister = (values) => {
    let errors = {};
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`-])[A-Za-z\d!@#$%^&,.*\/\\()_+~`-]{8,}$/;
    const companyCodeRegex = /^\d{9}$/;
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\+370\d{6}(\d{1})?(\d{2})?$/;

    if (!values.email || !values.email === "")
      errors.email = "El. pašto adresas yra privalomas";
    else if (!emailRegex.test(values.email))
      errors.email = "El. pašto adresas neteisingas. (pavyzdys@pastas.lt)";
    if (!values.password || !values.password === "")
      errors.password = "Slaptažodis yra privalomas!";
    else if (!passwordRegex.test(values.password))
      errors.password =
        "Slaptažodis turi būti bent 8 simbolių ilgio ir turėti specialų simbolį (pvz. ! arba @...), didžiąją raidę ir skaičių";
    if (
      !values.phoneNumber ||
      !values.phoneNumber === "" ||
      !phoneRegex.test(values.phoneNumber)
    )
      errors.phoneNumber =
        "Telefono nr. neteisingas, turi prasidėti: +3706....... (pvz.: +37060000000)";

    if (!values.companyCode || !values.companyCode === "")
      errors.companyCode = "Įmonės kodas yra privalomas";
    else if (!companyCodeRegex.test(values.companyCode))
      errors.companyCode = "Patikrinkite įmonės kodą";
    if (!values.companyName || !values.companyName === "")
      errors.companyName = "Įmonės pavadinimas yra privalomas";
    if (!values.city || !values.city === "")
      errors.city = "Miestas yra privalomas";
    if (!values.address || !values.address === "")
      errors.address = "Adresas yra privalomas";
    if (!values.aboutSection || !values.aboutSection === "")
      errors.aboutSection = "Šis laukelis negali būti tuščias";
    if (!values.name || !values.name === "")
      errors.name = "Vardas yra privalomas";
    if (!values.surname || !values.surname === "")
      errors.surname = "Pavardė yra privaloma";

    return errors;
  };

  const handleLocationChange = (newLocation) => {
    const temp = newLocation.join("");
    setRegisterCompanyData({
      ...registerCompanyData,
      city: temp,
    });
    setLocation(temp);
  };
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const errors = validateLogin(loginData);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      const errorss = await AuthService.login(
        loginData.email,
        loginData.password
      );
      if (errorss === "success") {
        setCustomError("");
        setButtonClicked(true);
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      } else if (typeof errorss === "string") {
        setCustomError(errorss);
      } else {
        const errorObj = Object.entries(errorss).reduce((acc, [key, value]) => {
          const newKey = key.toLowerCase();
          acc[newKey] = value[0];
          return acc;
        }, {});
        setErrors(errorObj);
      }
    } else {
      setErrors(errors);
    }
  };
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const errors = validateUserRegister(registerData);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      const errorss = await AuthService.registerUser(
        registerData.name,
        registerData.surname,
        registerData.email,
        registerData.aboutSection,
        registerData.password,
        registerData.dateOfBirth
      );
      if (errorss === "success") {
        setButtonClicked(true);
        setShowRegistrasionSuccessful(true);
        setTimeout(function () {
          setCustomError("");
          handleRegLogClick("login");
          setButtonClicked(false);
        }, 1500);
      } else if (typeof errorss === "string") {
        setCustomError(errorss);
      } else {
        const errorObj = Object.entries(errorss).reduce((acc, [key, value]) => {
          const newKey = key.toLowerCase();
          acc[newKey] = value[0];
          return acc;
        }, {});
        setErrors(errorObj);
      }
    } else {
      setErrors(errors);
    }
  };
  const handleCompanyRegisterSubmit = async (event) => {
    event.preventDefault();

    const errors = validateCompanyRegister(registerCompanyData);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      const errorss = await AuthService.registerCompany(
        registerCompanyData.name,
        registerCompanyData.surname,
        registerCompanyData.phoneNumber,
        registerCompanyData.email,
        registerCompanyData.password,
        registerCompanyData.aboutSection,
        registerCompanyData.address,
        registerCompanyData.city,
        registerCompanyData.companyCode,
        registerCompanyData.companyName,
        registerCompanyData.site
      );
      if (errorss === "success") {
        setButtonClicked(true);
        setShowRegistrasionSuccessful(true);
        setTimeout(function () {
          setCustomError("");
          handleRegLogClick("login");
          setButtonClicked(false);
        }, 1500);
      } else if (typeof errorss === "string") {
        setCustomError(errorss);
      } else {
        const errorObj = Object.entries(errorss).reduce((acc, [key, value]) => {
          const newKey = key.toLowerCase();
          acc[newKey] = value[0];
          return acc;
        }, {});
        setErrors(errorObj);
      }
    } else {
      setErrors(errors);
    }
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (activeRegLog === "login") {
      setLoginData({ ...loginData, [name]: value });
    } else if (activeRegLog === "regComp") {
      setRegisterCompanyData({ ...registerCompanyData, [name]: value });
    } else {
      setRegisterData({ ...registerData, [name]: value });
    }
  };

  const handleRegLogClick = (tab) => {
    setActiveRegLog(tab);
  };
  const textColorBlack = props.textColorBlack === "b" ? "#212529" : "";

  return (
    <>
      <Nav>
        <Nav.Link
          variant="primary"
          onClick={handleShow}
          style={{ color: textColorBlack }}
        >
          Prisijungti/Registruotis
        </Nav.Link>
      </Nav>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {activeRegLog === "login"
              ? "Prisijungimas"
              : activeRegLog === "regComp"
              ? "Registracija įmonei"
              : "Registracija"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {showRegistrasionSuccessful && (
              <p>Registracija sėkminga, galite prisijungti!</p>
            )}
            {customError && <p style={{ color: "red" }}>{customError}</p>}
            <Col md={8}>
              <div className="d-flex justify-content-evenly mb-3">
                <Button
                  variant={activeRegLog === "login" ? "primary" : "secondary"}
                  onClick={() => handleRegLogClick("login")}
                >
                  Prisijungimas
                </Button>
                <Button
                  variant={
                    activeRegLog === "register" ? "primary" : "secondary"
                  }
                  onClick={() => handleRegLogClick("register")}
                >
                  Registracija
                </Button>{" "}
                <Button
                  variant={activeRegLog === "regComp" ? "primary" : "secondary"}
                  onClick={() => handleRegLogClick("regComp")}
                >
                  Registracija įmonei
                </Button>
              </div>
              {buttonClicked ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Spinner animation="grow" />
                </div>
              ) : activeRegLog === "login" ? (
                <Form onSubmit={handleLoginSubmit}>
                  <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>El. paštas</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Įvesk el pašto adresą"
                      name="email"
                      value={loginData.email}
                      onChange={handleInputChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Label>Slaptažodis</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Įvesk slaptažodį"
                      name="password"
                      value={loginData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Prisijungti
                  </Button>
                </Form>
              ) : activeRegLog === "regComp" ? (
                <Form onSubmit={handleCompanyRegisterSubmit}>
                  <Form.Group controlId="formBasicCompanyName" className="mb-3">
                    <Form.Label>Įmonės pavadinimas</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Įvesk įmonės pavadinimą"
                      name="companyName"
                      value={registerCompanyData.companyName}
                      onChange={handleInputChange}
                      isInvalid={!!errors.companyName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.companyName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formBasicCompanyCode" className="mb-3">
                    <Form.Label>Įmonės kodas</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Įvesk įmonės kodą"
                      name="companyCode"
                      value={registerCompanyData.companyCode}
                      onChange={handleInputChange}
                      isInvalid={!!errors.companyCode}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.companyCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicName" className="mb-3">
                    <Form.Label>Kompanijos atstovo vardas</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Įvesk kompanijos atstovo vardą"
                      name="name"
                      value={registerCompanyData.name}
                      onChange={handleInputChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicSurname" className="mb-3">
                    <Form.Label>Kompanijos atstovo pavardė</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Įvesk kompanijos atstovo pavardę"
                      name="surname"
                      value={registerCompanyData.surname}
                      onChange={handleInputChange}
                      isInvalid={!!errors.surname}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.surname}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formBasicPhoneNumber" className="mb-3">
                    <Form.Label>Telefono numeris</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Jūsų telefono numeris"
                      name="phoneNumber"
                      value={registerCompanyData.phoneNumber}
                      onChange={handleInputChange}
                      isInvalid={!!errors.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formBasicAddress" className="mb-3">
                    <Form.Label>Kompanijos adresas</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Įvesk kompanijos adresą"
                      name="address"
                      value={registerCompanyData.address}
                      onChange={handleInputChange}
                      isInvalid={!!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formBasicCity">
                    <Form.Label>Miestas</Form.Label>
                    <Typeahead
                      className="d-flex justify-content-center mb-3"
                      id="cities"
                      name="cities"
                      placeholder="Miestas"
                      onChange={handleLocationChange}
                      options={cities}
                      isInvalid={!!errors.city}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>El. paštas</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Įvesk el. paštą"
                      name="email"
                      value={registerCompanyData.email}
                      onChange={handleInputChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    controlId="formBasicAboutSection"
                    className="mb-3"
                  >
                    <Form.Label>Apie įmonę</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Įvesk apie įmonę"
                      name="aboutSection"
                      value={registerCompanyData.aboutSection}
                      onChange={handleInputChange}
                      isInvalid={!!errors.aboutSection}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.aboutSection}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Label>Slaptažodis</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Įvesk slaptažodį"
                      name="password"
                      value={registerCompanyData.password}
                      onChange={handleInputChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formBasicSite" className="mb-3">
                    <Form.Label>Įmonės svetainė</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Įvesk įmonės svetainę"
                      name="site"
                      value={registerCompanyData.site}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Registruotis
                  </Button>
                </Form>
              ) : (
                <Form onSubmit={handleRegisterSubmit}>
                  <Form.Group controlId="formBasicName" className="mb-3">
                    <Form.Label>Vardas</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Įvesk vardą"
                      name="name"
                      value={registerData.name}
                      onChange={handleInputChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicSurname" className="mb-3">
                    <Form.Label>Pavardė</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Įvesk pavardę"
                      name="surname"
                      value={registerData.surname}
                      onChange={handleInputChange}
                      isInvalid={!!errors.surname}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.surname}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>El. paštas</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Įvesk el paštą"
                      name="email"
                      value={registerData.email}
                      onChange={handleInputChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    controlId="formBasicAboutSection"
                    className="mb-3"
                  >
                    <Form.Label>Trumpai apie save</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Įvesk trumpai apie save"
                      name="aboutSection"
                      value={registerData.aboutSection}
                      onChange={handleInputChange}
                      isInvalid={!!errors.aboutSection}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.aboutSection}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Label>Slaptažodis</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Įvesk slaptažodį"
                      name="password"
                      value={registerData.password}
                      onChange={handleInputChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formBasicDate" className="mb-3">
                    <Form.Label>Gimimo data</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Gimimo diena"
                      name="dateOfBirth"
                      value={registerData.dateOfBirth}
                      onChange={handleInputChange}
                      isInvalid={!!errors.dateOfBirth}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.dateOfBirth}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Registruotis
                  </Button>
                </Form>
              )}
            </Col>
            <Col md={4} style={{ margin: "auto" }}>
              <div className=" justify-content-center text-center align-content-center align-items-center">
                <h3>AČIŪ</h3>
                <p>
                  {activeRegLog === "login"
                    ? "Ačiū, kad naudojatės šia sistema. Mes tikime, kad ši sistema padės Jums susirasti sau tinkamą darbą, o jei esate darbdavys, tikime, kad surasite sau tinkamą darbuotoją!"
                    : "Užsiregistruodamas sistemoje Tu mums parodai, kad tai yra reikalinga Tau ir tikime, kad surasi tai, ko ieškai. Svarbiausia - nebijok bandyti."}
                </p>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Login;
