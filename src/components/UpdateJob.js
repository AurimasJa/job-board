import { useEffect, useState } from "react";
import { Button, Card, FloatingLabel, Form, Modal } from "react-bootstrap";
import authService from "../services/auth.service";
import { Typeahead } from "react-bootstrap-typeahead";
import cities from "../data/cities";
import "../style.css"; // import your CSS file
import { BsFillPencilFill } from "react-icons/bs";
import jobService from "../services/job.service";

function UpdateJob({ job, desc, comp }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [errors, setErrors] = useState({});
  const [errorsLabel, setErrorsLabel] = useState(false);
  const [remoteWork, setRemoteWork] = useState(job.remoteWork);
  const user = authService.getCurrentUser();
  const [hasDescriptionChanged, setHasDescriptionChanged] = useState(false);
  const [hasCompanyOffersChanged, setHasCompanyOffersChanged] = useState(false);

  const [description, setDescription] = useState("");
  const [companyOffers, setCompanyOffers] = useState("");
  const [jobUpdateData, setJobUpdateData] = useState(job);
  useEffect(() => {
    const convertedDesc = desc.replace(/<br\s*\/?>/g, "\n");
    setDescription(convertedDesc);
  }, [desc]);
  useEffect(() => {
    const convertedComp = comp.replace(/<br\s*\/?>/g, "\n");
    setCompanyOffers(convertedComp);
  }, [comp]);

  const handleAddRequirement = () => {
    setJobUpdateData({
      ...jobUpdateData,
      requirements: [
        ...jobUpdateData.requirements,
        {
          id: Date.now(),
          name: "",
        },
      ],
    });
  };

  const handleLocationChange = (newLocation) => {
    const temp = newLocation.join("");
    setJobUpdateData({
      ...jobUpdateData,
      city: temp,
    });
  };
  const handleRemoveRequirement = (id) => {
    const requirements = jobUpdateData.requirements.filter(
      (requirement) => requirement.id !== id
    );
    setJobUpdateData({ ...jobUpdateData, requirements });
  };

  const validateJobUpdate = (values) => {
    let errors = {};

    if (!values.title || !values.title === "")
      errors.title = "Pavadinimas yra privalomas";
    else if (values.title.length < 5 || values.title.length > 100)
      errors.title =
        "Pavadinimas per trumpas arba per ilgas, pavadinimo ilgis nuo 5 iki 100 simbolių";
    if (!values.position || !values.position === "")
      errors.position = "Pozicijos sritis yra privaloma";
    if (!values.positionLevel || !values.positionLevel === "")
      errors.positionLevel =
        "Pareigų lygis(Vadovas, Specialistas, (ne)kvalifikuotas darbuotojas) yra privalomas";
    if (!values.city || !values.city === "")
      errors.city = "Miestas yra privalomas";
    if (!values.location || !values.location === "")
      errors.location = "Adresas yra privalomas";
    if (!values.salary || !values.salary === "")
      errors.salary = "Atlyginimas nuo yra privaloma";

    let tempSalary = Number(values.salary);
    let tempSalaryUp = Number(values.salaryUp);
    if (!values.salaryUp || !values.salaryUp === "")
      errors.salaryUp = "Atlyginimas iki yra privaloma";
    else if (tempSalary > tempSalaryUp) {
      errors.salary = "Atlyginimas iki negali būti mažesnė nei atlyginimas nuo";
      errors.salaryUp =
        "Atlyginimas iki negali būti mažesnė nei atlyginimas nuo";
    }
    if (!values.totalWorkHours || !values.totalWorkHours === "")
      errors.totalWorkHours = "Etatą nurodyti yra privaloma";
    if (!values.selection || !values.selection === "")
      errors.selection = "Atrankos būdo nurodymas yra privalomas";

    values.requirements.forEach((requirement, i) => {
      errors.requirements = errors.requirements || [];
      if (!requirement || !requirement.name || requirement.name === "") {
        errors.requirements[i] = errors.requirements[i] || {};
        errors.requirements[i].name = "Reikalavimus nurodyti būtina";
      }
    });
    return errors;
  };

  const handleJobUpdate = async (event) => {
    event.preventDefault();
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };

    const errors = validateJobUpdate(jobUpdateData);
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
      const response = await jobService.updateJob(
        job.id,
        hasCompanyOffersChanged,
        hasDescriptionChanged,
        jobUpdateData,
        description,
        companyOffers,
        headers
      );
      if (response.data === "Atnaujinta!") window.location.reload();
    } else {
      setErrorsLabel(true);
      setErrors(errors);
    }
  };
  useEffect(() => {
    setJobUpdateData({
      ...jobUpdateData,
      remoteWork: remoteWork,
    });
  }, [remoteWork]);
  const handleRequirementChange = (event, i) => {
    const { value } = event.target;
    const updatedRequirements = jobUpdateData.requirements.map(
      (requirement, index) => {
        if (index === i) {
          return { ...requirement, name: value };
        }
        return requirement;
      }
    );
    setJobUpdateData({ ...jobUpdateData, requirements: updatedRequirements });
  };

  return (
    <>
      {user &&
      user[1] &&
      user[0] === job.company.id &&
      (user[1].includes("Darbdavys") ||
        user[1].includes("Administratorius")) ? (
        <BsFillPencilFill
          onClick={() => handleShow()}
          className="mt-1"
          style={{ textAlign: "right", cursor: "pointer" }}
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
          <Modal.Title>Redaguoti darbo skelbimą</Modal.Title>
        </Modal.Header>
        {errorsLabel && <p style={{ color: "red" }}>Patikrinkite įvestis!</p>}
        <Modal.Body>
          <Form onSubmit={handleJobUpdate}>
            <Form.Group controlId="realTitle">
              <FloatingLabel
                controlId="titleInput"
                label="Pavadinimas"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  value={jobUpdateData.title}
                  onChange={(event) =>
                    setJobUpdateData({
                      ...jobUpdateData,
                      title: event.target.value,
                    })
                  }
                  placeholder="Pavadinimas"
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="realDescription">
              <FloatingLabel
                controlId="descriptionInput"
                label="Aprašymas"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  defaultValue={description}
                  style={{ height: "200px" }}
                  placeholder="Įmonės aprašymas"
                  onChange={(event) => {
                    setHasDescriptionChanged(true);
                    setDescription({
                      ...description,
                      description: event.target.value,
                    });
                  }}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="realPosition">
              <FloatingLabel
                controlId="positionInput"
                label="Pozicijos sritis"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  value={jobUpdateData.position}
                  onChange={(event) =>
                    setJobUpdateData({
                      ...jobUpdateData,
                      position: event.target.value,
                    })
                  }
                  placeholder="Įveskite poziciją"
                  isInvalid={!!errors.position}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.position}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="selectCity">
              <Typeahead
                className="d-flex justify-content-center mb-3"
                style={{ width: "100%", height: "58px" }}
                id="cities"
                name="cities"
                placeholder="Miestas"
                onChange={handleLocationChange}
                defaultInputValue={jobUpdateData.city}
                options={cities}
                isInvalid={!!errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {errors.city}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="realPositionLevel">
              <FloatingLabel
                controlId="positionInput"
                label="Pareigų lygis"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  value={jobUpdateData.positionLevel}
                  onChange={(event) =>
                    setJobUpdateData({
                      ...jobUpdateData,
                      positionLevel: event.target.value,
                    })
                  }
                  placeholder="Pareigų lygis"
                  isInvalid={!!errors.positionLevel}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.positionLevel}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="realCompanyOffers">
              <FloatingLabel
                controlId="companyOffersInput"
                label="Įmonė siūlo"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  defaultValue={companyOffers}
                  style={{ height: "200px" }}
                  placeholder="Įmonė siūlo"
                  onChange={(event) => {
                    setHasCompanyOffersChanged(true);
                    setCompanyOffers({
                      ...companyOffers,
                      companyOffers: event.target.value,
                    });
                  }}
                  isInvalid={!!errors.companyOffers}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.companyOffers}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Card>
              <Card.Header className="mb-3 fs-3">Reikalavimai:</Card.Header>
              <Card.Body>
                {jobUpdateData.requirements.map((requirement, i) => (
                  <div key={requirement.id} className="mb-3">
                    <Form.Group controlId={`name-${i}`}>
                      <FloatingLabel
                        controlId={`requirementsInput-${i}`}
                        label="Reikalavimas"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          placeholder="pvz.: Gerai išmanyti PHP, Darbo patirtis su PHP bent 3 metai"
                          value={requirement?.name || ""}
                          key={`requirementsInput-${i}`}
                          onChange={(event) =>
                            handleRequirementChange(event, i)
                          }
                          isInvalid={
                            !!(
                              errors.requirements &&
                              errors.requirements[i] &&
                              errors.requirements[i].name
                            )
                          }
                        />{" "}
                        <Form.Control.Feedback type="invalid">
                          {errors.requirements &&
                            errors.requirements[i] &&
                            errors.requirements[i].name}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                    <div>
                      {i !== 0 && (
                        <Button
                          variant="danger"
                          onClick={() =>
                            handleRemoveRequirement(requirement.id)
                          }
                        >
                          Pašalinti
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  className="justify-content-end"
                  variant="success"
                  onClick={() => handleAddRequirement()}
                >
                  Pridėti
                </Button>
              </Card.Body>
            </Card>
            <Form.Group controlId="realLocation">
              <FloatingLabel
                controlId="locationInput"
                label="Adresas"
                className="mb-3 mt-3"
              >
                <Form.Control
                  type="text"
                  value={jobUpdateData.location}
                  onChange={(event) =>
                    setJobUpdateData({
                      ...jobUpdateData,
                      location: event.target.value,
                    })
                  }
                  placeholder="Adresas"
                  isInvalid={!!errors.location}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.location}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Form.Group
                controlId="realSalary"
                style={{ width: "50%" }}
                className="me-3"
              >
                <FloatingLabel
                  controlId="salaryInput"
                  label="Atlyginimas (ant popieriaus) nuo"
                  className="mb-3"
                >
                  <Form.Control
                    type="number"
                    value={jobUpdateData.salary}
                    onChange={(event) =>
                      setJobUpdateData({
                        ...jobUpdateData,
                        salary: event.target.value,
                      })
                    }
                    placeholder="Atlyginimas"
                    isInvalid={!!errors.salary}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salary}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group controlId="realSalaryUp" style={{ width: "50%" }}>
                <FloatingLabel
                  controlId="salaryInputUp"
                  label="Atlyginimas (ant popieriaus) iki"
                  className="mb-3"
                >
                  <Form.Control
                    type="number"
                    value={jobUpdateData.salaryUp}
                    onChange={(event) =>
                      setJobUpdateData({
                        ...jobUpdateData,
                        salaryUp: event.target.value,
                      })
                    }
                    placeholder="Atlyginimas"
                    isInvalid={!!errors.salaryUp}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salaryUp}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
            </div>
            <Form.Group controlId="realTotalWorkHours">
              <FloatingLabel
                controlId="totalWorkHours"
                label="Etatas"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  value={jobUpdateData.totalWorkHours}
                  onChange={(event) =>
                    setJobUpdateData({
                      ...jobUpdateData,
                      totalWorkHours: event.target.value,
                    })
                  }
                  placeholder="Etatas"
                  isInvalid={!!errors.totalWorkHours}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.totalWorkHours}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="realSelection">
              <FloatingLabel
                controlId="selectionInput"
                label="Atrankos būdas"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  value={jobUpdateData.selection}
                  onChange={(event) =>
                    setJobUpdateData({
                      ...jobUpdateData,
                      selection: event.target.value,
                    })
                  }
                  placeholder="Atrankos būdas"
                  isInvalid={!!errors.selection}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.selection}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <div>
              <Form.Check
                type="checkbox"
                className="mt-3 mb-2"
                label="Darbas iš namų?"
                checked={remoteWork}
                onChange={(event) => {
                  setRemoteWork(event.target.checked);
                }}
              />
            </div>
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
export default UpdateJob;
