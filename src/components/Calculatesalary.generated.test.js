import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Calculatesalary from "./Calculatesalary";
import userEvent from "@testing-library/user-event";
import { act } from "react-test-renderer";

describe("Calculatesalary component", () => {
  it("renders the component without errors", () => {
    render(<Calculatesalary />);
    expect(screen.getByText(/Atlyginimo skaičiuoklė/)).toBeInTheDocument();
  });
  test("updates the input value when user types in a number", () => {
    render(<Calculatesalary />);
    const inputElement = screen.getByRole("spinbutton");
    const inputNumber = 1000;
    act(() => {
      userEvent.type(inputElement, inputNumber.toString());
    });

    expect(inputElement).toHaveValue(inputNumber);
  });

  test("calculates the net salary when the form is submitted with a valid input value", () => {
    render(<Calculatesalary />);
    const inputElement = screen.getByRole("spinbutton");
    const calculateButton = screen.getByTestId("calculateButton");
    const inputNumber = 1000;
    act(() => {
      userEvent.type(inputElement, inputNumber.toString());
    });
    act(() => {
      fireEvent.click(calculateButton);
    });
    const netSalaryElement = screen.getByTestId("netSalary");
    expect(netSalaryElement).toHaveTextContent("716.56€");
  });
  test("calculates the net ssalary when the form is submitted with a negative input value", () => {
    render(<Calculatesalary />);
    const inputElement = screen.getByRole("spinbutton");
    const calculateButton = screen.getByTestId("calculateButton");
    const inputNumber = -5000;
    act(() => {
      userEvent.clear(inputElement);
    });
    act(() => {
      userEvent.type(inputElement, inputNumber.toString());
    });
    act(() => {
      fireEvent.click(calculateButton);
    });
    const netSalaryElement = screen.getByTestId("netSalary");
    expect(netSalaryElement).toHaveTextContent("3025.00");
  });
  test("calculates the net ssalary when the form is submitted with a negative input value", () => {
    render(<Calculatesalary />);
    const inputElement = screen.getByRole("spinbutton");
    const calculateButton = screen.getByTestId("calculateButton");
    const inputNumber = 0;
    act(() => {
      userEvent.clear(inputElement);
    });
    act(() => {
      userEvent.type(inputElement, inputNumber.toString());
    });
    act(() => {
      fireEvent.click(calculateButton);
    });
    const netSalaryElement = screen.getByTestId("netSalary");
    expect(netSalaryElement).toHaveTextContent("0");
  });
});
