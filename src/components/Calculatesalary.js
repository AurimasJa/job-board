import React, { useState, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { BsCalculator } from "react-icons/bs";

function Calculatesalary() {
  const [clicked, setClicked] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const [result, setResult] = useState(0);
  const [npd, setNpd] = useState(0);
  const [monthNpd, setMonthNpd] = useState(0);
  const [tax, setTax] = useState(0);
  const [incomeTax, setIncomeTax] = useState(0);
  const [pension, setPension] = useState(false);
  const income = 1926;

  useEffect(() => {
    if (clicked) {
      let value = Number(inputValue);
      if (value < 0) {
        value = value * -1;
      }
      let res = 0;
      let tempNpd = 0;
      let tempMonthNpd = 0;
      let tempTax = 0;
      let tempIncomeTax = 0;
      if (value > income) {
        tempNpd = 400;
      } else {
        tempNpd = 625;
      }
      if (value > 840 && value < 1926) {
        tempMonthNpd = tempNpd - 0.42 * (value - 840);
      } else if (value > 1926) {
        tempMonthNpd = tempNpd - 0.18 * (value - 642);
        if (tempMonthNpd < 0) {
          tempMonthNpd = 0;
        }
      } else {
        tempMonthNpd = 625;
      }

      if (pension) {
        tempTax = value * 0.225;
      } else {
        tempTax = value * 0.195;
      }

      if (value > tempNpd) {
        tempIncomeTax = (value - tempMonthNpd) * 0.2;
      }

      res = value - tempTax - tempIncomeTax;
      setNpd(tempNpd);
      setMonthNpd(tempMonthNpd);
      setTax(tempTax);
      setIncomeTax(tempIncomeTax);
      setResult(res);
      setClicked(false);
    }
  }, [clicked, inputValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setClicked(true);
  };
  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title className="m-1 mb-3">
            <BsCalculator /> Atlyginimo skaičiuoklė
          </Card.Title>
          <div className="d-flex justify-content-center">
            <Card.Subtitle>Tavo atlyginimo skaičiuoklė</Card.Subtitle>
          </div>
        </Card.Header>
        <Form onSubmit={handleSubmit} className="p-2">
          <Form.Label>Atlyginimas ant popieriaus</Form.Label>
          <Form.Control
            type="number"
            value={inputValue}
            style={{ backgroundColor: "#f1f1f1" }}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="d-flex justify-content-end ">
            <div className="">
              <Button
                data-testid="calculateButton"
                type="submit"
                className="mt-3"
              >
                Skaičiuoti
              </Button>
            </div>
          </div>
        </Form>
        {result || result == 0 ? (
          <div className="p-2">
            {(inputValue || inputValue == 0) && (
              <p className="d-flex justify-content-between ">
                Atlyginimas ant popieriaus:{" "}
                <span data-testid="inputValue">{inputValue}€</span>
              </p>
            )}
            <hr />
            {(npd || npd == 0) && (
              <p className="d-flex justify-content-between ">
                Paskaičiuotas NPD: <span>{npd.toFixed(2)}€</span>
              </p>
            )}
            <hr />
            {(monthNpd || monthNpd == 0) && (
              <p className="d-flex justify-content-between ">
                Pritaikytas NPD: <span>{monthNpd.toFixed(2)}€</span>
              </p>
            )}
            <hr />
            {(tax || tax == 0) && (
              <p className="d-flex justify-content-between ">
                Sodra. Sveikatos ir pensijų, soc. draudimas:{" "}
                <span>{tax.toFixed(2)}€</span>
              </p>
            )}
            <hr />
            {(incomeTax || incomeTax == 0) && (
              <p className="d-flex justify-content-between ">
                Gyventojų pajamų mokestis: <span>{incomeTax.toFixed(2)}€</span>
              </p>
            )}
            <hr />
            {(result || result == 0) && (
              <p className="d-flex justify-content-between ">
                Atlyginimas į rankas:{" "}
                <span data-testid="result">{result.toFixed(2)}€</span>
              </p>
            )}
            <hr />
            <div>
              <Form.Check
                type="checkbox"
                className="mt-3 mb-2"
                label="Kaupiu pensijai (3%)"
                checked={pension}
                onChange={(event) => {
                  setPension(event.target.checked);
                }}
              />
            </div>
          </div>
        ) : (
          <p>Ivesk</p>
        )}
      </Card>
    </>
  );
}

export default Calculatesalary;
