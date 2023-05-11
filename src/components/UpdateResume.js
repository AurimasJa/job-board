import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import cities from "../data/cities";
import "../style.css"; // import your CSS file
import { BsFillPencilFill } from "react-icons/bs";
import resumesService from "../services/resumes.service";

function UpdateResume({ resume }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [hasExperience, setHasExperience] = useState(false);
  const handleShow = () => setShow(true);
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState({});
  const [errorsLabel, setErrorsLabel] = useState(false);
  const user = authService.getCurrentUser();
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
  const [resumeUpdateData, setResumeUpdateData] = useState(resume);

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
  const handleLocationChange = (newLocation) => {
    const temp = newLocation.join("");
    setResumeUpdateData({
      ...resumeUpdateData,
      city: temp,
    });
    setLocation(temp);
  };

  const handleResumeUpdate = async (event) => {
    event.preventDefault();
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };
    for (let index = 0; index < resumeUpdateData.educations.length; index++) {
      if (resumeUpdateData.educations[index].isCurrent == null) {
        resumeUpdateData.educations[index].isCurrent = false;
      }
    }
    for (let index = 0; index < resumeUpdateData.experiences.length; index++) {
      if (resumeUpdateData.experiences[index].isCurrent == null) {
        resumeUpdateData.experiences[index].isCurrent = false;
      }
    }
    var errors = validateData(resumeUpdateData);
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
      const response = await resumesService.updateResume(
        resume.id,
        resumeUpdateData,
        headers
      );
      if (response.status === 200) window.location.reload();
    } else {
      setErrorsLabel(true);
      setErrors(errors);
    }
  };
  useEffect(() => {
    setResumeUpdateData(resume);
  }, [resume]);

  const handleAddEducation = () => {
    setResumeUpdateData({
      ...resumeUpdateData,
      educations: [
        ...resumeUpdateData.educations,
        {
          id: Date.now(),
          school: "",
          degree: degreeStrings[DegreeEnum.DEFAULT],
          startDate: "",
          endDate: "",
          isCurrent: false,
        },
      ],
    });
  };
  const handleAddExperience = () => {
    setResumeUpdateData({
      ...resumeUpdateData,
      experiences: [
        ...resumeUpdateData.experiences,
        {
          id: Date.now(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
        },
      ],
    });
  };
  const handleAddSkill = () => {
    setResumeUpdateData({
      ...resumeUpdateData,
      skills: [
        ...resumeUpdateData.skills,
        {
          id: Date.now(),
          name: "",
        },
      ],
    });
  };

  const handleRemoveEducation = (id) => {
    const educations = resumeUpdateData.educations.filter(
      (education) => education.id !== id
    );
    setResumeUpdateData({ ...resumeUpdateData, educations: educations });
  };

  const handleRemoveExperience = (id) => {
    const experiences = resumeUpdateData.experiences.filter(
      (experience) => experience.id !== id
    );
    setResumeUpdateData({ ...resumeUpdateData, experiences: experiences });
  };

  const handleRemoveSkills = (id) => {
    const skills = resumeUpdateData.skills.filter((skills) => skills.id !== id);
    setResumeUpdateData({ ...resumeUpdateData, skills: skills });
  };

  const handleEndDateChange = (event, i) => {
    const { value } = event.target;
    const updatedExperiences = resumeUpdateData.experiences.map(
      (experience, index) => {
        if (index === i) {
          return { ...experience, endDate: value };
        }
        return experience;
      }
    );
    setResumeUpdateData({
      ...resumeUpdateData,
      experiences: updatedExperiences,
    });
  };
  return (
    <>
      {user &&
      user[1] &&
      (user[1].includes("Darbuotojas") ||
        user[1].includes("Administratorius")) ? (
        <BsFillPencilFill
          onClick={() => handleShow()}
          style={{ cursor: "pointer" }}
          className="me-2 mt-1"
        />
      ) : null}

      <Modal
        size="lg"
        show={show}
        backdrop="static"
        onHide={handleClose}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Redaguoti Jūsų CV</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {errorsLabel && <p style={{ color: "red" }}>Patikrinkite įvestis!</p>}
          <Form onSubmit={handleResumeUpdate}>
            <Form.Group controlId="realfullNameId">
              <Form.Label>Vardas ir pavardė</Form.Label>
              <Form.Control
                type="text"
                placeholder="Jūsų vardas ir pavardė"
                value={resumeUpdateData.fullName}
                onChange={(event) =>
                  setResumeUpdateData({
                    ...resumeUpdateData,
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
                value={resumeUpdateData.email}
                onChange={(event) =>
                  setResumeUpdateData({
                    ...resumeUpdateData,
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
                value={resumeUpdateData.phoneNumber}
                name="phoneNumber"
                onChange={(event) =>
                  setResumeUpdateData({
                    ...resumeUpdateData,
                    phoneNumber: event.target.value,
                  })
                }
                isInvalid={!!errors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="realAddressId">
              <Form.Label>Adresas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Jūsų adresas"
                value={resumeUpdateData.address}
                onChange={(event) =>
                  setResumeUpdateData({
                    ...resumeUpdateData,
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
                defaultInputValue={resumeUpdateData.city}
                onChange={handleLocationChange}
                options={cities}
                isInvalid={!!errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {errors.city}
              </Form.Control.Feedback>
            </Form.Group>
            <h5>Išsilavinimas:</h5>
            {resumeUpdateData.educations.map((education, i) => (
              <div key={education.id} className="mb-3">
                <Form.Group controlId={`school-${i}`}>
                  <Form.Label>Mokymosi įstaigos pavadinimas</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Mokymosi įstaigos pavadinimas"
                    value={education.school || ""}
                    key={`school-${i}`}
                    onChange={(event) => {
                      const newEducation = [...resumeUpdateData.educations];
                      newEducation[i].school = event.target.value;
                      setResumeUpdateData({
                        ...resumeUpdateData,
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
                  />{" "}
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
                    value={education.degree}
                    onChange={(event) => {
                      const newEducation = [...resumeUpdateData.educations];
                      newEducation[i].degree = parseInt(event.target.value);
                      setResumeUpdateData({
                        ...resumeUpdateData,
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
                    {Object.values(degreeStrings).map((degree, index) => (
                      <option key={index} value={index}>
                        {degree}
                      </option>
                    ))}
                  </Form.Control>{" "}
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
                    value={
                      education.startDate
                        ? education.startDate.slice(0, 10)
                        : ""
                    }
                    onChange={(event) => {
                      const newEducation = [...resumeUpdateData.educations];
                      newEducation[i].startDate = event.target.value;
                      setResumeUpdateData({
                        ...resumeUpdateData,
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
                  />{" "}
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
                      value={
                        education.endDate ? education.endDate.slice(0, 10) : ""
                      }
                      onChange={(event) => {
                        const newEducation = [...resumeUpdateData.educations];
                        newEducation[i].endDate = event.target.value;
                        setResumeUpdateData({
                          ...resumeUpdateData,
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
                    />{" "}
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
                      const newEducation = [...resumeUpdateData.educations];
                      newEducation[i].isCurrent = event.target.checked;
                      if (event.target.checked) {
                        newEducation[i].endDate = new Date()
                          .toISOString()
                          .substr(0, 10);
                      } else {
                        newEducation[i].endDate = "";
                      }
                      setResumeUpdateData({
                        ...resumeUpdateData,
                        educations: newEducation,
                      });
                    }}
                  />
                </Form.Group>
                {i !== 0 && (
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveEducation(education.id)}
                  >
                    Pašalinti
                  </Button>
                )}
              </div>
            ))}{" "}
            <Button variant="success" onClick={() => handleAddEducation()}>
              Pridėti
            </Button>
            <h5 className="mt-3">Darbo patirtis: </h5>
            {resumeUpdateData.experiences.map((experience, i) => (
              <div key={experience.id}>
                <Form.Group controlId={`company-${i}`}>
                  <Form.Label>Įmonė</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Buvusi/esama įmonė"
                    value={experience && experience.company}
                    onChange={(event) => {
                      const newExperience = [...resumeUpdateData.experiences];
                      newExperience[i].company = event.target.value;
                      setResumeUpdateData({
                        ...resumeUpdateData,
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
                  />{" "}
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
                    value={experience && experience.position}
                    onChange={(event) => {
                      const newExperience = [...resumeUpdateData.experiences];
                      newExperience[i].position = event.target.value;
                      setResumeUpdateData({
                        ...resumeUpdateData,
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
                  />{" "}
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
                    value={
                      experience.startDate
                        ? experience.startDate.slice(0, 10)
                        : ""
                    }
                    onChange={(event) => {
                      const newExperience = [...resumeUpdateData.experiences];
                      newExperience[i].startDate = event.target.value;
                      setResumeUpdateData({
                        ...resumeUpdateData,
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
                  />{" "}
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
                      value={
                        experience.endDate
                          ? experience.endDate.slice(0, 10)
                          : ""
                      }
                      onChange={(event) => handleEndDateChange(event, i)}
                      disabled={experience.isCurrent}
                      isInvalid={
                        !!(
                          errors.experiences &&
                          errors.experiences[i] &&
                          errors.experiences[i].endDate
                        )
                      }
                    />{" "}
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
                      const newExperience = [...resumeUpdateData.experiences];
                      newExperience[i].isCurrent = event.target.checked;
                      if (event.target.checked) {
                        newExperience[i].endDate = new Date()
                          .toISOString()
                          .substr(0, 10);
                      } else {
                        newExperience[i].endDate = "";
                      }
                      setResumeUpdateData({
                        ...resumeUpdateData,
                        experiences: newExperience,
                      });
                    }}
                  />
                </Form.Group>
                {i !== 0 && (
                  <Button
                    className="mt-2 mb-2"
                    variant="danger"
                    onClick={() => handleRemoveExperience(experience.id)}
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
                setResumeUpdateData({
                  ...resumeUpdateData,
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
            )}{" "}
            <Button variant="success" onClick={() => handleAddExperience()}>
              Pridėti
            </Button>
            <Form.Group className="mt-2" controlId="realSummaryId">
              <Form.Label>Aprašymas apie Jus</Form.Label>
              <Form.Control
                type="text"
                placeholder="Jūsų trumpas aprašymas"
                value={resumeUpdateData.summary}
                onChange={(event) =>
                  setResumeUpdateData({
                    ...resumeUpdateData,
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
                value={resumeUpdateData.position}
                onChange={(event) =>
                  setResumeUpdateData({
                    ...resumeUpdateData,
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
                value={resumeUpdateData.references}
                onChange={(event) =>
                  setResumeUpdateData({
                    ...resumeUpdateData,
                    references: event.target.value,
                  })
                }
                isInvalid={!!errors.references}
              />
              <Form.Control.Feedback type="invalid">
                {errors.references}
              </Form.Control.Feedback>
            </Form.Group>
            <h5 className="mt-3">Jūsų savybės</h5>
            {resumeUpdateData.skills.map((skills, i) => (
              <div key={skills.id}>
                <Form.Group controlId={`name-${i}`}>
                  <Form.Label>Savybės pavadinimas</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="pvz.: darbingas/a, komunikabilus/i"
                    defaultValue={skills && skills.name}
                    onChange={(event) => {
                      const newSkills = [...resumeUpdateData.skills];
                      newSkills[i].name = event.target.value;
                      setResumeUpdateData({
                        ...resumeUpdateData,
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
                  />{" "}
                  <Form.Control.Feedback type="invalid">
                    {errors.skills && errors.skills[i] && errors.skills[i].name}
                  </Form.Control.Feedback>
                </Form.Group>

                {i !== 0 && (
                  <Button
                    className="mt-2 mb-2"
                    variant="danger"
                    onClick={() => handleRemoveSkills(skills.id)}
                  >
                    Pašalinti
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="success"
              className="mt-2"
              onClick={() => handleAddSkill()}
            >
              Pridėti
            </Button>
            <div className="d-flex justify-content-end">
              <Button variant="success" type="submit">
                Atnaujinti duomenis
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default UpdateResume;
