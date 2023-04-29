import React, { useState } from "react";
import { PDFViewer, Document, Page, Text } from "@react-pdf/renderer";
import { FaDownload } from "react-icons/fa";

const MyPdf = ({ formValues }) => {
  const [pdfUrl, setPdfUrl] = useState("");

  const generatePdf = () => {
    const blob = new Blob([<MyDocument formValues={formValues} />], {
      type: "application/pdf",
    });
    setPdfUrl(URL.createObjectURL(blob));
  };

  return (
    <div>
      <button onClick={generatePdf}>
        <FaDownload /> Download PDF
      </button>
      {pdfUrl && (
        <PDFViewer style={{ width: "100%", height: "800px" }}>
          <Document file={pdfUrl}>
            <Page>
              <Text>Hello, world!</Text>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </div>
  );
};

const MyDocument = ({ formValues }) => (
  <Document>
    <Page>
      <Text>{formValues.fullName}</Text>
    </Page>
  </Document>
);
