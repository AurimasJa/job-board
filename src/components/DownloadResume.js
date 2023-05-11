import React, { useState, useEffect } from "react";
import { Font } from "@react-pdf/renderer";

import { Document, Line, Page, Text, View } from "@react-pdf/renderer";
import { BsPhoneFill } from "react-icons/bs";

function DownloadResume({ formValues }) {
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
  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
        fontWeight: 300,
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
        fontWeight: 400,
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
        fontWeight: 500,
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
        fontWeight: 600,
      },
    ],
  });
  return (
    <>
      <Document>
        <Page
          style={{
            padding: "40px",
            fontFamily: "Roboto",
          }}
        >
          <View>
            {formValues.fullName ? (
              <Text style={{ fontSize: 26 }}>{formValues.fullName}</Text>
            ) : null}
            {formValues.email ? (
              <Text style={{ fontSize: 22 }}>{formValues.email}</Text>
            ) : null}
            <Line
              y1={10}
              x2={200}
              y2={10}
              style={{
                borderBottom: 1,
                borderColor: "black",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            />
            <Text style={{ fontSize: 16 }}>{formValues.phoneNumber}</Text>
            <Text style={{ fontSize: 16 }}>{formValues.address}</Text>
            <Text style={{ fontSize: 16 }}>{formValues.city}</Text>

            {formValues.educations &&
            formValues.educations.length > 0 &&
            formValues.educations[0].startDate &&
            formValues.educations[0].school ? (
              <>
                <Text
                  style={{
                    fontSize: 24,
                    marginTop: "20px",
                    marginBottom: "5px",
                  }}
                >
                  Išsilavinimas
                </Text>
                {formValues.educations.map((education) => (
                  <div key={education.id}>
                    <Text style={{ fontSize: 20 }}>{education.school}</Text>
                    <Text style={{ fontSize: 16 }}>
                      {degreeStrings[education.degree]}
                    </Text>
                    {education.isCurrent ? (
                      <Text style={{ fontSize: 16 }}>
                        {education.startDate.slice(0, 10)} - Dabar
                      </Text>
                    ) : (
                      <Text style={{ fontSize: 16 }}>
                        {education.startDate.slice(0, 10)} -{" "}
                        {education.endDate.slice(0, 10)}
                      </Text>
                    )}
                  </div>
                ))}
              </>
            ) : null}

            {formValues.experiences &&
            formValues.experiences.length > 0 &&
            formValues.experiences[0].company ? (
              <>
                <Text
                  style={{
                    fontSize: 24,
                    marginTop: "20px",
                    marginBottom: "5px",
                  }}
                >
                  Patirtis
                </Text>
                {formValues.experiences.map((experience) => (
                  <div key={experience.id}>
                    <Text style={{ fontSize: 20 }}>{experience.company}</Text>
                    <Text style={{ fontSize: 16 }}>{experience.position}</Text>
                    {experience.isCurrent ? (
                      <Text style={{ fontSize: 16 }}>
                        {experience.startDate.slice(0, 10)} - Dabar
                      </Text>
                    ) : (
                      <Text style={{ fontSize: 16 }}>
                        {experience.startDate.slice(0, 10)} -{" "}
                        {experience.endDate.slice(0, 10)}
                      </Text>
                    )}
                  </div>
                ))}
              </>
            ) : null}

            {formValues.summary ? (
              <>
                <Text
                  style={{
                    fontSize: 24,
                    marginTop: "20px",
                    marginBottom: "5px",
                  }}
                >
                  Aprašymas
                </Text>
                <Text style={{ fontSize: 16 }}>{formValues.summary}</Text>
              </>
            ) : null}
            {formValues.position ? (
              <>
                <Text
                  style={{
                    fontSize: 24,
                    marginTop: "20px",
                    marginBottom: "5px",
                  }}
                >
                  Ieškoma pozicijos sritis
                </Text>
                <Text style={{ fontSize: 16 }}>{formValues.position}</Text>
              </>
            ) : null}

            {formValues.references ? (
              <>
                <Text
                  style={{
                    fontSize: 24,
                    marginTop: "20px",
                    marginBottom: "5px",
                  }}
                >
                  Rekomendacijos
                </Text>
                <Text style={{ fontSize: 16 }}>{formValues.references}</Text>
              </>
            ) : null}

            {formValues.skills &&
            formValues.skills.length > 0 &&
            formValues.skills[0].name ? (
              <>
                <Text
                  style={{
                    fontSize: 24,
                    marginTop: "20px",
                    marginBottom: "5px",
                  }}
                >
                  Savybės
                </Text>
                {formValues.skills.map((skill) => (
                  <div key={skill.id}>
                    <Text style={{ fontSize: 16 }}>{skill.name}</Text>
                  </div>
                ))}
              </>
            ) : null}
          </View>
        </Page>
      </Document>
    </>
  );
}

export default DownloadResume;
