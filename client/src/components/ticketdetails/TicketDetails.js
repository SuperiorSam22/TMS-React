// TicketDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const getTicketDetails = async (id) => {
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/tickets/${id}`,
      headers: { 
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YThiODAzZDZkMDc3MGU0MDM2MjYzYyIsImlhdCI6MTcyMjkyMzc2MiwiZXhwIjoxNzI1NTE1NzYyfQ.3WrVkJU8mYtfvT8OT6EA5a-Sh9NJyxtB3hSpc0yrUd4' // replace with your actual auth token
      }
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const getTicketComments = async (id) => {
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/tickets/${id}/comments`,
      headers: { 
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YThiODAzZDZkMDc3MGU0MDM2MjYzYyIsImlhdCI6MTcyMjkyMzc2MiwiZXhwIjoxNzI1NTE1NzYyfQ.3WrVkJU8mYtfvT8OT6EA5a-Sh9NJyxtB3hSpc0yrUd4' // replace with your actual auth token
      }
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = React.useState({});
  const [comments, setComments] = React.useState([]);

  React.useEffect(() => {
    const fetchTicketDetails = async () => {
      const ticketDetails = await getTicketDetails(id);
      setTicket(ticketDetails);
    };
    const fetchTicketComments = async () => {
      const ticketComments = await getTicketComments(id);
      setComments(ticketComments);
    };
    fetchTicketDetails();
    fetchTicketComments();
  }, [id]);

  return (
    <div>
      <h1>Ticket {id}</h1>
      <p>Title: {ticket.title}</p>
      <p>Description: {ticket.description}</p>
      <p>Severity: {ticket.severity}</p>
      <p>Status: {ticket.status}</p>
      <h2>Comments:</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>{comment.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default TicketDetails;