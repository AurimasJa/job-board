import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ProgressBar,
  Alert,
  Card,
} from "react-bootstrap";
import "../style.css";
import Footer from "./Footer";
import Navham from "./Navham";
import Resume from "./Resume";
import { useNavigate } from "react-router-dom";
import cities from "../data/cities";

import authService from "../services/auth.service";
import { Typeahead } from "react-bootstrap-typeahead";
import resumesService from "../services/resumes.service";

function CreateResume() {
  const [activeStep, setActiveStep] = useState(1);
  const [hasExperience, setHasExperience] = useState(false);
  const [errorsLabel, setErrorsLabel] = useState(false);
  const [showLabel, setShowLabel] = useState("");
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user && !user[1]) {
      navigate("/");
    }
  }, []);
  const DegreeEnum = {
    DEFAULT: 0,
    SECONDARY: 1,
    PROFFESIONAL: 2,
    COLLEGE: 3,
    UNIVERSITY: 4,
    MASTER: 5,
    DOCTOR: 6,
    OTHER: 7,
  };
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

  const handleLocationChange = (newLocation) => {
    const temp = newLocation.join("");
    setFormValues({
      ...formValues,
      city: temp,
    });
    setLocation(temp);
  };
  const [formValues, setFormValues] = useState({
    fullName: "",
    city: "",
    address: "",
    email: "",
    phoneNumber: "",
    educations: [
      {
        school: "",
        degree: DegreeEnum.DEFAULT,
        startDate: "",
        endDate: "",
        isCurrent: false,
      },
    ],
    experiences: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
      },
    ],
    skills: [{ name: "" }],
    references: "",
    position: "",
    summary: "",
    salary: null,
  });
  const validateData = (values) => {
    let errors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\+370\d{6}(\d{1})?(\d{2})?$/;

    if (!values.email || !values.email === "")
      errors.email = "El. pašto adresas yra privalomas";
    else if (!emailRegex.test(values.email))
      errors.email = "El. pašto adresas neteisingas. (pavyzdys@pastas.lt)";
    if (!values.fullName || !values.fullName === "")
      errors.fullName = "Vardas ir pavardė yra privalomi";
    if (
      !values.phoneNumber ||
      !values.phoneNumber === "" ||
      !phoneRegex.test(values.phoneNumber)
    )
      errors.phoneNumber =
        "Telefono nr. neteisingas, turi prasidėti: +3706....... (pvz.: +37060000000)";
    if (!values.city || !values.city === "")
      errors.city = "Miestas yra privalomas";
    if (!values.address || !values.address === "")
      errors.address = "Adresas yra privalomas";
    if (!values.summary || !values.summary === "")
      errors.summary = "Aprašymas yra privalomas";
    if (
      !Number(values.salary) < 0 ||
      !Number(values.salary) === "" ||
      !Number(values.salary)
    )
      errors.salary = "Blogai įvestas atlyginimas";
    else if (values.length < 20 || values.length > 1000)
      errors.summary =
        "Aprašymas yra neteisingas. Aprašymo ilgis nuo 20 iki 1000 simbolių.";

    if (!values.position || !values.position === "")
      errors.position = "Pozicijos sritis yra privaloma";

    values.educations.forEach((education, i) => {
      errors.educations = errors.educations || [];
      if (!education || !education.school || education.school === "") {
        errors.educations[i] = errors.educations[i] || {};
        errors.educations[i].school =
          "Mokymosi įstaigos pavadinimas yra privalomas";
      }
      if (education && (!education.startDate || education.startDate === "")) {
        errors.educations[i] = errors.educations[i] || {};
        errors.educations[i].startDate =
          "Pradžios data yra privaloma, įveskite kada pradėjote mokslus";
      }
      if (
        education &&
        !education.isCurrent &&
        (!education.endDate || education.endDate === "")
      ) {
        errors.educations[i] = errors.educations[i] || {};
        errors.educations[i].endDate =
          "Pabaigos data yra privaloma (jei mokotės, pažymėkite, kad dar mokotės)";
      }
      if (education && (!education.degree || education.degree === 0)) {
        errors.educations[i] = errors.educations[i] || {};
        errors.educations[i].degree = "Turite pasirinkti laipsnį";
      }
    });

    values.experiences.forEach((experience, i) => {
      errors.experiences = errors.experiences || [];
      if (!experience || !experience.company || experience.company === "") {
        errors.experiences[i] = errors.experiences[i] || {};
        errors.experiences[i].company =
          "Įmonės įstaigos pavadinimas yra privalomas";
      }
      if (
        experience &&
        (!experience.startDate || experience.startDate === "")
      ) {
        errors.experiences[i] = errors.experiences[i] || {};
        errors.experiences[i].startDate =
          "Pradžios data yra privaloma, įveskite kada pradėjote dirbti, jei patirties neturite, pažymėkite, kad neturite";
      }
      if (
        experience &&
        !experience.isCurrent &&
        (!experience.endDate || experience.endDate === "")
      ) {
        errors.experiences[i] = errors.experiences[i] || {};
        errors.experiences[i].endDate =
          "Pabaigos data yra privaloma (jei dirbate, pažymėkite, kad dar dirbate)";
      }
      if (experience && (!experience.position || experience.position === 0)) {
        errors.experiences[i] = errors.experiences[i] || {};
        errors.experiences[i].position = "Neteisinga pozicijos sritis";
      }
    });
    values.skills.forEach((skill, i) => {
      errors.skills = errors.skills || [];
      if (!skill || !skill.name || skill.name === "") {
        errors.skills[i] = errors.skills[i] || {};
        errors.skills[i].name =
          "Savybė yra privalomas. (pvz.: komunikabilus/i)";
      }
    });

    return errors;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
    };
    var errors = validateData(formValues);
    setErrors(errors);
    const newErrors = Object.keys(errors).reduce((acc, key) => {
      const value = errors[key];
      if (Array.isArray(value) && value.length === 0) {
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});
    if (Object.keys(newErrors).length === 0) {
      const response = await resumesService.createResume(formValues, headers);
      if (response.status === 201) navigate("/resume");
    } else {
      setErrorsLabel(true);
      setErrors(errors);
    }
  };
  const steps = [
    { label: "Informacija" },
    { label: "Išsilavinimas" },
    { label: "Darbo patirtis" },
    { label: "Apibendrinimas" },
  ];

  const handleNextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const handlePrevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handleAddEducation = () => {
    setFormValues({
      ...formValues,
      educations: [
        ...formValues.educations,
        {
          school: "",
          degree: null,
          startDate: "",
          endDate: "",
          isCurrent: false,
        },
      ],
    });
  };

  const handleRemoveEducation = (i) => {
    const educations = [...formValues.educations];
    educations.splice(i, 1);
    setFormValues({ ...formValues, educations });
  };

  const handleAddExperience = () => {
    setFormValues({
      ...formValues,
      experiences: [
        ...formValues.experiences,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
        },
      ],
    });
  };

  const handleRemoveExperience = (i) => {
    const experiences = [...formValues.experiences];
    experiences.splice(i, 1);
    setFormValues({ ...formValues, experiences });
  };

  const handleAddSkill = () => {
    setFormValues({
      ...formValues,
      skills: [
        ...formValues.skills,
        {
          name: "",
        },
      ],
    });
  };

  const handleRemoveSkills = (i) => {
    const skills = [...formValues.skills];
    skills.splice(i, 1);
    setFormValues({ ...formValues, skills });
  };

  return (
    <>
      <Navham />
      <Container>
        <Row>
          <Col md={4} className="mt-3 mb-3">
            <Card>
              <Card.Body>
                <div>
                  <ProgressBar
                    now={(activeStep / 4) * 100}
                    label={`${activeStep} žingsnis iš 4`}
                  />
                  <div className="step-bubbles">
                    {steps.map((step, index) => (
                      <div
                        key={index}
                        //activestep = 2, tai class step-bubble active 1 ir 2
                        className={`step-bubble ${
                          activeStep >= index + 1 ? "active" : ""
                        }`}
                        onMouseEnter={() => setShowLabel(index + 1)}
                        onMouseLeave={() => setShowLabel(null)}
                      >
                        {showLabel === index + 1 && (
                          <span className="step-label">{step.label}</span>
                        )}
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
                {errorsLabel && (
                  <p style={{ color: "red" }}>Patikrinkite įvestis!</p>
                )}
                {activeStep === 1 && (
                  <Form>
                    <Form.Group controlId="realfullNameId">
                      <Form.Label>Vardas ir pavardė</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Jūsų vardas ir pavardė"
                        value={formValues.fullName}
                        onChange={(event) =>
                          setFormValues({
                            ...formValues,
                            fullName: event.target.value,
                          })
                        }
                        isInvalid={!!errors.fullName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fullName}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="realEmailId">
                      <Form.Label>El. pašto adresas</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Jūsų el. paštas"
                        value={formValues.email}
                        onChange={(event) =>
                          setFormValues({
                            ...formValues,
                            email: event.target.value,
                          })
                        }
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="realPhoneNumberId">
                      <Form.Label>Telefono numeris</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Jūsų telefono numeris"
                        value={formValues.phoneNumber}
                        onChange={(event) =>
                          setFormValues({
                            ...formValues,
                            phoneNumber: event.target.value,
                          })
                        }
                        isInvalid={!!errors.phoneNumber}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phoneNumber}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="realSalaryId">
                      <Form.Label>Pageidautinas atlyginimas (nuo) €</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Jūsų pageidautinas atlyginimas (nuo) €"
                        value={formValues.salary}
                        onChange={(event) =>
                          setFormValues({
                            ...formValues,
                            salary: event.target.value,
                          })
                        }
                        isInvalid={!!errors.salary}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.salary}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="realAddressId">
                      <Form.Label>Adresas</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Jūsų adresas"
                        value={formValues.address}
                        onChange={(event) =>
                          setFormValues({
                            ...formValues,
                            address: event.target.value,
                          })
                        }
                        isInvalid={!!errors.address}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="selectCity">
                      <Form.Label>Miestas</Form.Label>
                      <Typeahead
                        className="d-flex justify-content-center mb-3"
                        id="cities"
                        name="cities"
                        placeholder="Miestas"
                        onChange={handleLocationChange}
                        defaultInputValue={formValues.city}
                        options={cities}
                        isInvalid={!!errors.city}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex justify-content-end mt-3">
                      {activeStep === 1 ? (
                        <Button
                          className="me-2"
                          onClick={handlePrevStep}
                          disabled
                        >
                          Grįžti
                        </Button>
                      ) : (
                        <Button className="me-2" onClick={handlePrevStep}>
                          Grįžti
                        </Button>
                      )}
                      <Button onClick={handleNextStep}>Toliau</Button>
                    </div>
                  </Form>
                )}
                {activeStep === 2 && (
                  <Form onSubmit={handleNextStep}>
                    <h5>Išsilavinimas:</h5>
                    {formValues.educations.map((education, i) => (
                      <div key={i} className="mb-3">
                        <Form.Group controlId={`school-${i}`}>
                          <Form.Label>Mokymosi įstaigos pavadinimas</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Mokymosi įstaigos pavadinimas"
                            value={education.school}
                            onChange={(event) => {
                              const newEducation = [...formValues.educations];
                              newEducation[i].school = event.target.value;
                              setFormValues({
                                ...formValues,
                                educations: newEducation,
                              });
                            }}
                            isInvalid={
                              !!(
                                errors.educations &&
                                errors.educations[i] &&
                                errors.educations[i].school
                              )
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.educations &&
                              errors.educations[i] &&
                              errors.educations[i].school}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId={`degree-${i}`}>
                          <Form.Label>Laipsnis</Form.Label>
                          <Form.Control
                            as="select"
                            defaultValue="0"
                            onChange={(event) => {
                              const newEducation = [...formValues.educations];
                              newEducation[i].degree = parseInt(
                                event.target.value
                              );
                              setFormValues({
                                ...formValues,
                                educations: newEducation,
                              });
                            }}
                            isInvalid={
                              !!(
                                errors.educations &&
                                errors.educations[i] &&
                                errors.educations[i].degree
                              )
                            }
                          >
                            {Object.values(degreeStrings).map(
                              (degree, index) => (
                                <option key={index} value={index}>
                                  {degree}
                                </option>
                              )
                            )}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.educations &&
                              errors.educations[i] &&
                              errors.educations[i].degree}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId={`startDate-${i}`}>
                          <Form.Label>Nuo</Form.Label>
                          <Form.Control
                            type="date"
                            placeholder="Įveskite pradžios datą"
                            value={education.startDate}
                            onChange={(event) => {
                              const newEducation = [...formValues.educations];
                              newEducation[i].startDate = event.target.value;
                              setFormValues({
                                ...formValues,
                                educations: newEducation,
                              });
                            }}
                            isInvalid={
                              !!(
                                errors.educations &&
                                errors.educations[i] &&
                                errors.educations[i].startDate
                              )
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.educations &&
                              errors.educations[i] &&
                              errors.educations[i].startDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                        {education.isCurrent ? (
                          ""
                        ) : (
                          <Form.Group controlId={`endDate-${i}`}>
                            <Form.Label>Iki</Form.Label>
                            <Form.Control
                              type="date"
                              className="mb-2"
                              placeholder="Įveskite pabaigos datą"
                              value={education.endDate}
                              onChange={(event) => {
                                const newEducation = [...formValues.educations];
                                newEducation[i].endDate = event.target.value;
                                setFormValues({
                                  ...formValues,
                                  educations: newEducation,
                                });
                              }}
                              isInvalid={
                                !!(
                                  errors.educations &&
                                  errors.educations[i] &&
                                  errors.educations[i].endDate
                                )
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.educations &&
                                errors.educations[i] &&
                                errors.educations[i].endDate}
                            </Form.Control.Feedback>
                          </Form.Group>
                        )}

                        <Form.Group controlId={`isCurrent-${i}`}>
                          <Form.Check
                            type="checkbox"
                            label="Mokausi"
                            checked={education.isCurrent}
                            onChange={(event) => {
                              const newEducation = [...formValues.educations];
                              newEducation[i].isCurrent = event.target.checked;
                              if (event.target.checked) {
                                newEducation[i].endDate = new Date()
                                  .toISOString()
                                  .substr(0, 10);
                              } else {
                                newEducation[i].endDate = "";
                              }
                              setFormValues({
                                ...formValues,
                                educations: newEducation,
                              });
                            }}
                          />
                        </Form.Group>
                        {i !== 0 && (
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveEducation(i)}
                          >
                            Pašalinti
                          </Button>
                        )}
                      </div>
                    ))}

                    <div className="d-flex justify-content-between">
                      <Button
                        variant="success"
                        onClick={() => handleAddEducation()}
                      >
                        Pridėti
                      </Button>
                      <div className="d-flex">
                        <Button className="me-2" onClick={handlePrevStep}>
                          Grįžti
                        </Button>
                        <Button onClick={handleNextStep}>Toliau</Button>
                      </div>
                    </div>
                  </Form>
                )}
                {activeStep === 3 && (
                  <Form onSubmit={handleNextStep}>
                    {formValues.experiences.map((experience, i) => (
                      <div key={i}>
                        <h5>Darbo patirtis: </h5>
                        <Form.Group controlId={`company-${i}`}>
                          <Form.Label>Įmonė</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Buvusi/esama įmonė"
                            value={experience.company}
                            onChange={(event) => {
                              const newExperience = [...formValues.experiences];
                              newExperience[i].company = event.target.value;
                              setFormValues({
                                ...formValues,
                                experiences: newExperience,
                              });
                            }}
                            isInvalid={
                              !!(
                                errors.experiences &&
                                errors.experiences[i] &&
                                errors.experiences[i].company
                              )
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.experiences &&
                              errors.experiences[i] &&
                              errors.experiences[i].company}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId={`position-${i}`}>
                          <Form.Label>Pozicijos sritis</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Jūsų buvusi/esama užimta pozicijos sritis"
                            value={experience.position}
                            onChange={(event) => {
                              const newExperience = [...formValues.experiences];
                              newExperience[i].position = event.target.value;
                              setFormValues({
                                ...formValues,
                                experiences: newExperience,
                              });
                            }}
                            isInvalid={
                              !!(
                                errors.experiences &&
                                errors.experiences[i] &&
                                errors.experiences[i].position
                              )
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.experiences &&
                              errors.experiences[i] &&
                              errors.experiences[i].position}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId={`startDate-${i}`}>
                          <Form.Label>Pradžios data</Form.Label>
                          <Form.Control
                            type="date"
                            placeholder="Įveskite pradžios datą"
                            value={experience.startDate}
                            onChange={(event) => {
                              const newExperience = [...formValues.experiences];
                              newExperience[i].startDate = event.target.value;
                              setFormValues({
                                ...formValues,
                                experiences: newExperience,
                              });
                            }}
                            isInvalid={
                              !!(
                                errors.experiences &&
                                errors.experiences[i] &&
                                errors.experiences[i].startDate
                              )
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.experiences &&
                              errors.experiences[i] &&
                              errors.experiences[i].startDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                        {experience.isCurrent ? (
                          ""
                        ) : (
                          <Form.Group controlId={`endDate-${i}`}>
                            <Form.Label>Pabaigos data</Form.Label>
                            <Form.Control
                              type="date"
                              className="mb-2"
                              placeholder="Įveskite pabaigos datą"
                              value={experience.endDate}
                              onChange={(event) => {
                                const newExperience = [
                                  ...formValues.experiences,
                                ];
                                newExperience[i].endDate = event.target.value;
                                setFormValues({
                                  ...formValues,
                                  experiences: newExperience,
                                });
                              }}
                              disabled={experience.isCurrent}
                              isInvalid={
                                !!(
                                  errors.experiences &&
                                  errors.experiences[i] &&
                                  errors.experiences[i].endDate
                                )
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.experiences &&
                                errors.experiences[i] &&
                                errors.experiences[i].endDate}
                            </Form.Control.Feedback>
                          </Form.Group>
                        )}

                        <Form.Group controlId={`isCurrent-${i}`}>
                          <Form.Check
                            type="checkbox"
                            label="Vis dar dirbu"
                            checked={experience.isCurrent}
                            onChange={(event) => {
                              const newExperience = [...formValues.experiences];
                              newExperience[i].isCurrent = event.target.checked;
                              if (event.target.checked) {
                                newExperience[i].endDate = new Date()
                                  .toISOString()
                                  .substr(0, 10);
                              } else {
                                newExperience[i].endDate = "";
                              }
                              setFormValues({
                                ...formValues,
                                experiences: newExperience,
                              });
                            }}
                          />
                        </Form.Group>

                        {i !== 0 && (
                          <Button
                            className="mt-2 mb-2"
                            variant="danger"
                            onClick={() => handleRemoveExperience(i)}
                          >
                            Pašalinti
                          </Button>
                        )}
                      </div>
                    ))}
                    <Form.Check
                      type="checkbox"
                      label="Darbo patirties neturiu"
                      checked={hasExperience}
                      className="mb-2"
                      onChange={(event) => {
                        setHasExperience(event.target.checked);
                        setFormValues({
                          ...formValues,
                          experiences: event.target.checked
                            ? []
                            : [
                                {
                                  company: "",
                                  position: "",
                                  startDate: "",
                                  endDate: "",
                                  isCurrent: false,
                                },
                              ],
                        });
                      }}
                    />

                    {hasExperience && (
                      <Alert variant="warning">Darbo patirties neturiu</Alert>
                    )}

                    <div className="d-flex justify-content-between">
                      {!hasExperience && (
                        <Button
                          variant="success"
                          onClick={() => handleAddExperience()}
                        >
                          Pridėti
                        </Button>
                      )}
                      <div className="d-flex">
                        <Button className="me-2" onClick={handlePrevStep}>
                          Grįžti
                        </Button>
                        <Button onClick={handleNextStep}>Toliau</Button>
                      </div>
                    </div>
                  </Form>
                )}
                {activeStep === 4 && (
                  <Form>
                    <Form.Group controlId="realSummaryId">
                      <Form.Label>Aprašymas apie Jus</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Jūsų trumpas aprašymas"
                        value={formValues.summary}
                        onChange={(event) =>
                          setFormValues({
                            ...formValues,
                            summary: event.target.value,
                          })
                        }
                        isInvalid={!!errors.summary}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.summary}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="realPositionId">
                      <Form.Label>Pozicijos sritis</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Jūsų ieškoma pozicijos sritis"
                        value={formValues.position}
                        onChange={(event) =>
                          setFormValues({
                            ...formValues,
                            position: event.target.value,
                          })
                        }
                        isInvalid={!!errors.position}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.position}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="realReferencesId">
                      <Form.Label>Rekomendacijos</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Rekomendacijos"
                        value={formValues.references}
                        onChange={(event) =>
                          setFormValues({
                            ...formValues,
                            references: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <h5>Jūsų savybės</h5>
                    {formValues.skills.map((skills, i) => (
                      <div key={i}>
                        <Form.Group controlId={`name-${i}`}>
                          <Form.Label>Savybės pavadinimas</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="pvz.: darbingas/a, komunikabilus/i"
                            value={skills.name}
                            onChange={(event) => {
                              const newSkills = [...formValues.skills];
                              newSkills[i].name = event.target.value;
                              setFormValues({
                                ...formValues,
                                skills: newSkills,
                              });
                            }}
                            isInvalid={
                              !!(
                                errors.skills &&
                                errors.skills[i] &&
                                errors.skills[i].name
                              )
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.skills &&
                              errors.skills[i] &&
                              errors.skills[i].name}
                          </Form.Control.Feedback>
                        </Form.Group>

                        {i !== 0 && (
                          <Button
                            className="mt-2 mb-1"
                            variant="danger"
                            onClick={() => handleRemoveSkills(i)}
                          >
                            Pašalinti
                          </Button>
                        )}
                      </div>
                    ))}
                    <div className="d-flex justify-content-between  mt-3">
                      <Button
                        className="me-3"
                        variant="success"
                        onClick={() => handleAddSkill()}
                      >
                        Pridėti
                      </Button>
                      <div className="d-flex">
                        <Button className="me-2" onClick={handlePrevStep}>
                          Grįžti
                        </Button>
                        {activeStep === 4 ? (
                          <Button onClick={handleSubmit}>Pateikti</Button>
                        ) : (
                          <Button onClick={handleNextStep}>Toliau</Button>
                        )}
                      </div>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={8} className="mt-3 mb-3">
            <Resume formValues={formValues} degreeStrings={degreeStrings} />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default CreateResume;
