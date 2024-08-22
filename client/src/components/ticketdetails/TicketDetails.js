import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const TicketDetailsPage = () => {
  const [data, setData] = useState({});

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const newData = {};
    for (const [key, value] of searchParams.entries()) {
      newData[key] = value;
    }
    setData(newData);
  }, [searchParams]);

  return (
    <div>
      <h1>{data.tId}</h1>
      <h1>{data.ticketId}</h1>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <p>Severity: {data.severity}</p>
      <p>Status: {data.status}</p>
      <p>Start Date: {new Date(data.startDate).toLocaleString()}</p>
      <p>Due Date: {new Date(data.dueDate).toLocaleString()}</p>
      <h2>Comments:</h2>
    </div>
  );
};

export default TicketDetailsPage;
