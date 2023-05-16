import React from "react";
import { BsPhone } from "react-icons/bs";
import { FaAddressCard, FaCity } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";

function Resume(props) {
  const { education, degreeStrings } = props;
  const { forms, formValues } = props;
  return (
    <>
      <div
        style={{
          position: "sticky",
          top: "100px",
          height: "80vh",
          overflowY: "auto",
        }}
      >
        <div className="resume">
          <h3>
            {formValues.fullName === "" ? (
              <p className="text-muted">Vardas Pavardė</p>
            ) : (
              <p>{formValues.fullName}</p>
            )}
          </h3>
          <h4>
            {formValues.email === "" ? (
              <p className="text-muted">pavyzdys@pastas.lt</p>
            ) : (
              <p>{formValues.email}</p>
            )}
          </h4>
          <hr />
          <div>
            {formValues.salary === "" || formValues.salary === null ? (
              <p className="text-muted">
                <GiReceiveMoney /> Atlyginimas nuo 2000€
              </p>
            ) : (
              <>
                <p>
                  <GiReceiveMoney /> Atlyginimas nuo {formValues.salary}€
                </p>
              </>
            )}
            {formValues.phoneNumber === "" ? (
              <p className="text-muted">
                <BsPhone /> +37060000000
              </p>
            ) : (
              <>
                <p>
                  {" "}
                  <BsPhone /> {formValues.phoneNumber}
                </p>
              </>
            )}
            {formValues.address === "" ? (
              <p className="text-muted">
                <FaAddressCard /> Bičių g. 12-7
              </p>
            ) : (
              <>
                <p>
                  {" "}
                  <FaAddressCard /> {formValues.address}
                </p>
              </>
            )}

            {formValues.city === "" ? (
              <p className="text-muted">
                <FaCity /> Kaunas
              </p>
            ) : (
              <>
                <p>
                  {" "}
                  <FaCity /> {formValues.city}
                </p>
              </>
            )}
          </div>
          {formValues.educations && formValues.educations.length > 0 && (
            <div>
              <h4>Išsilavinimas</h4>
              {formValues.educations.map((education, i) => (
                <div key={i}>
                  {education.school === "" ? (
                    <h5 className="text-muted">Garliavos Jonučių gimnazija</h5>
                  ) : (
                    <h5>{education.school}</h5>
                  )}
                  {education.degree === 0 ? (
                    <p className="text-muted">Vidurinis</p>
                  ) : (
                    degreeStrings[education.degree]
                  )}
                  {education.isCurrent ? (
                    education.startDate === "" ||
                    education.startDate === null ? (
                      <p className="text-muted"> 2018-09-01 - Dabar</p>
                    ) : (
                      <p>{education.startDate.slice(0, 10)} - Dabar</p>
                    )
                  ) : education.startDate === "" ||
                    education.startDate === null ? (
                    <p className="text-muted"> 2018-09-01 - 2022-09-01</p>
                  ) : (
                    <p>
                      {education.startDate.slice(0, 10)} -{" "}
                      {education.endDate.slice(0, 10)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          {formValues.experiences && formValues.experiences.length > 0 && (
            <div>
              <h4>Patirtis</h4>
              {formValues.experiences.map((experience, i) => (
                <div key={i}>
                  {experience.position === "" ? (
                    <h5 className="text-muted">Barmenas</h5>
                  ) : (
                    <h5>{experience.position}</h5>
                  )}
                  {experience.company === "" ? (
                    <p className="text-muted">UAB Kompanija</p>
                  ) : (
                    <p>{experience.company}</p>
                  )}
                  {experience.isCurrent ? (
                    experience.startDate === "" ||
                    experience.startDate === null ? (
                      <p className="text-muted"> 2018-09-01 - Dabar</p>
                    ) : (
                      <p>{experience.startDate.slice(0, 10)} - Dabar</p>
                    )
                  ) : experience.startDate === "" ||
                    experience.startDate === null ? (
                    <p className="text-muted"> 2018-09-01 - 2022-09-01</p>
                  ) : (
                    <p>
                      {experience.startDate.slice(0, 10)} -{" "}
                      {experience.endDate.slice(0, 10)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mb-3">
            <h4>Aprašymas: </h4>
            {formValues.summary === "" ? (
              <p className="text-muted">
                Esu komunikabilus, mėgstu iššūkius ir komandinį darbą. Esu
                dirbęs pagalbiniu darbuotoju kavinėje prieš metus laiko.
              </p>
            ) : (
              formValues.summary
            )}
          </div>
          <h4>Ieškoma Pozicijos sritis: </h4>
          {formValues.position === "" ? (
            <p className="text-muted">Apsauga</p>
          ) : (
            formValues.position
          )}
          <h4 className="mt-3">Savybės: </h4>
          {formValues.skills &&
            formValues.skills.length > 0 &&
            formValues.skills.map((skill, i) => (
              <div key={i}>
                {skill.name === "" ? (
                  <p className="text-muted">C#</p>
                ) : (
                  skill.name
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Resume;
