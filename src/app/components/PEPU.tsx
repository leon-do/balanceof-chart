import React, { useEffect, useState } from "react";
import { BarChart, Bar, Rectangle, YAxis, Tooltip, Legend } from "recharts";

export default function PEPU() {
  // https://recharts.org/en-US/examples/SimpleBarChart
  const [data, setData] = useState([]);

  const dataaa = [
    {
      name: "Page A",
      date: 2400,
      amount: 2400,
    },
    {
      name: "Page B",
      date: 1398,
      amount: 2210,
    },
    {
      name: "Page C",
      date: 9800,
      amount: 2290,
    },
    {
      name: "Page D",
      date: 3908,
      amount: 2000,
    },
    {
      name: "Page E",
      date: 4800,
      amount: 2181,
    },
    {
      name: "Page F",
      date: 3800,
      amount: 2500,
    },
    {
      name: "Page G",
      date: 4300,
      amount: 2100,
    },
  ];

  return (
    <div>
      <BarChart
        width={500}
        height={300}
        data={dataaa}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="date"
          fill="#8884d8"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
      </BarChart>
    </div>
  );
}
