import { PieChart } from "@mui/x-charts";
import React, { useState, useEffect } from "react";
import axios from "axios";

function MyPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const userId =  JSON.parse(sessionStorage.getItem('user')).id;
      try {
        const response = await axios.get(`http://localhost:8000/api/tickets/${userId}`);
        const tickets = response.data;
        const pieChartData = [
          { id: 0, value: tickets.filter(ticket => ticket.status === "open").length, label: "Open" },
          { id: 1, value: tickets.filter(ticket => ticket.status === "closed").length, label: "Close" },
          { id: 2, value: tickets.filter(ticket => ticket.status === "in progress").length, label: "In Progress" },
        ];
        setData(pieChartData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTickets();
  }, []);

  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
        },
      ]}
      height={200}
    />
  );
}

export default MyPieChart;