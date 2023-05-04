import React, { useEffect, useState } from "react";
import "../style.css";
import cities from "../data/cities";
import "react-bootstrap-typeahead/css/Typeahead.css";
import {
  Button,
  Col,
  Container,
  Dropdown,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import { GiReceiveMoney } from "react-icons/gi";
import jobService from "../services/job.service";

function JobSearch() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState([""]);

  const [jobs, setJobs] = useState([]);
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const [selectedPositions, setSelectedPositions] = useState([]);
  const [salary, setSalary] = useState(0);
  const filteredJobs = jobs.filter((job) => {
    const isTitleMatch = job.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    var isLocationMatch = "";
    if (!location[0]) {
      location[0] = "";
    }
    if (location[0] === "" || location[0] !== "") {
      isLocationMatch = job.city
        .toLowerCase()
        .includes(location[0].toLowerCase());
    }

    const isOptionMatch =
      selectedPositions.length === 0 ||
      selectedPositions.some((optionLabel) =>
        job.position.includes(optionLabel)
      );

    const isSalaryMatch = salary === 0 || job.salary >= salary;

    if (location && searchQuery && !selectedPositions.length) {
      return isTitleMatch && isLocationMatch && isSalaryMatch;
    } else if (location && !searchQuery && !selectedPositions.length) {
      return isLocationMatch && isSalaryMatch;
    } else if (!location && searchQuery && !selectedPositions.length) {
      return isTitleMatch && isSalaryMatch;
    } else if (location && searchQuery && selectedPositions.length === 0) {
      return isTitleMatch && isLocationMatch && isSalaryMatch;
    } else {
      return isOptionMatch && isLocationMatch && isTitleMatch && isSalaryMatch;
    }
  });
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(!isPressed);
  };

  const handleInputChange = (event) => {
    setSalary(event.target.value);
  };
  const fetchJobs = async () => {
    const jobs = await jobService.fetchJobs();
    setJobs(jobs);
  };
  useEffect(() => {
    fetchJobs();
  }, []);

  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherPosition, setOtherPosition] = useState("");
  const [positionIndex, setPositionIndex] = useState(null);
  const isExist = !positionIndex;
  const isExistLength = positionIndex;
  const handlePositionChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    if (value === "Other") {
      setIsOtherSelected(checked);
    } else {
      let newSelectedPositions = selectedPositions.slice();
      if (checked) {
        newSelectedPositions.push(value);
      } else {
        newSelectedPositions = newSelectedPositions.filter((v) => v !== value);
      }
      setSelectedPositions(newSelectedPositions);
    }
  };
  const handleAdditionalPositionSearch = (e) => {
    const value = e.target.value;
    setOtherPosition(value);
  };
  const handleAddPosition = () => {
    let newSelectedPositions = selectedPositions.slice();
    if (otherPosition && otherPosition !== null) {
      newSelectedPositions.push(otherPosition);
      setSelectedPositions(newSelectedPositions);
      setPositionIndex(newSelectedPositions.length);
    }
  };
  const handleRemovePosition = () => {
    let newSelectedPositions = selectedPositions.slice();
    newSelectedPositions.splice(positionIndex - 1, 1);
    setSelectedPositions(newSelectedPositions);
    setPositionIndex(null);
  };

  const toJobList = (filteredJobs) => {
    navigate("/jobs/", {
      state: {
        filteredJobs: filteredJobs,
      },
    });
  };
  return (
    <>
      <div>
        <Container>
          <div className="line">
            <Col md={12} className="text-center mb-3">
              <hr className="mx-auto" />
            </Col>
          </div>
          <Col className="mb-2">
            <div className=" justify-content-center align-content-center">
              <h4 className="mb-3 text-center">Darbo paieška</h4>
              <Row className="justify-content-center">
                <Col md={4} className="d-flex justify-content-center row">
                  <Form className="">
                    <FloatingLabel
                      controlId="titleInput"
                      label="Raktinis žodis"
                      className="mb-3"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    >
                      <Form.Control type="text" placeholder="Pavadinimas" />
                    </FloatingLabel>
                  </Form>
                </Col>

                <Col md={3} className="d-flex justify-content-center row">
                  <Form.Group controlId="selectCity">
                    <Typeahead
                      className="d-flex justify-content-center mb-3"
                      style={{ width: "100%", height: "80%" }}
                      id="cities"
                      name="cities"
                      inputProps={{ required: true }}
                      placeholder="Pasirinkite miestą"
                      onChange={setLocation}
                      options={cities}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex justify-content-center row">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="primary"
                      id="dropdown-position"
                      style={{ width: "100%" }}
                      className="p-3 mb-3"
                    >
                      Pozicija
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="p-2">
                      <Form>
                        <Form.Check
                          type="checkbox"
                          label="Aptarnavimas"
                          value="Aptarnavimas"
                          onChange={handlePositionChange}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Apsauga"
                          value="Apsauga"
                          onChange={handlePositionChange}
                        />
                        <Form.Check
                          type="checkbox"
                          label="IT, telekomunikacija"
                          value="IT, telekomunikacija"
                          onChange={handlePositionChange}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Teisė"
                          value="Teisė"
                          onChange={handlePositionChange}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Statyba"
                          value="Statyba"
                          onChange={handlePositionChange}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Savanorystė"
                          value="Savanorystė"
                          onChange={handlePositionChange}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Administravimas"
                          value="Administravimas"
                          onChange={handlePositionChange}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Švietimas"
                          value="Švietimas"
                          onChange={handlePositionChange}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Logistika"
                          value="Logistika"
                          onChange={handlePositionChange}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Kita"
                          value="Other"
                          onChange={handlePositionChange}
                        />
                      </Form>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col md={2} className="d-flex justify-content-between row">
                  <Button
                    className="p-3 mb-3 "
                    onClick={() => toJobList(filteredJobs)}
                  >
                    Ieškoti
                  </Button>
                </Col>
                {isOtherSelected && (
                  <div>
                    <input
                      type="text"
                      value={otherPosition}
                      onChange={handleAdditionalPositionSearch}
                    />
                    <Button
                      onClick={handleAddPosition}
                      disabled={isExistLength}
                    >
                      Pridėti
                    </Button>
                    <Button onClick={handleRemovePosition} disabled={isExist}>
                      Ištrinti
                    </Button>
                  </div>
                )}
              </Row>
              <div
                className={`show-more-button ${isPressed ? "pressed" : ""}`}
                onClick={handleClick}
              >
                Daugiau pasirinkimų<span className="arrow"></span>
              </div>
              {isPressed && (
                <div>
                  <p>
                    <GiReceiveMoney className="me-2" /> Atlyginimas nuo:{" "}
                    {salary}€
                  </p>
                  <input
                    type="range"
                    max="20000"
                    value={salary}
                    onChange={handleInputChange}
                    style={{ width: "80%" }}
                  />
                </div>
              )}
            </div>
          </Col>
          <div className="line">
            <Col md={12} className="text-center mb-3">
              <hr className="mx-auto" />
            </Col>
          </div>
        </Container>
      </div>
    </>
  );
}
export default JobSearch;
