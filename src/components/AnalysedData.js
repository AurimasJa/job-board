import React from "react";
import { Col } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Bar,
} from "recharts";

function AnalyzedData({ averageSalary }) {
  {
    /* <PieChart width={400} height={400}>
          <Pie
            dataKey="averageCitySalary"
            isAnimationActive={false}
            data={averageSalary}
            cx={200}
            cy={200}
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </PieChart> */
  }
  return (
    <Col sm={4}>
      {/*#################################################################*/}
      {averageSalary.length > 0
        ? <h3>Vidutinė miestų alga:</h3> && (
            <div style={{ color: "black" }}>
              <BarChart
                width={500}
                height={300}
                data={averageSalary}
                margin={{
                  top: 5,
                  right: 30,
                  left: 80,
                  bottom: 5,
                }}
                barSize={20}
              >
                <XAxis
                  dataKey="cityName"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar
                  dataKey="averageCitySalary"
                  fill="#8884d8"
                  background={{ fill: "#eee" }}
                />
              </BarChart>
            </div>
          )
        : "Nėra"}
    </Col>
  );
}
export default AnalyzedData;
