import { Box, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'
import AddIcon from "@mui/icons-material/Add";
import axios from 'axios';


const getAllUserTickets = async () => {
  try {
    const authToken = sessionStorage.getItem('accessJWT');
    const userId = JSON.parse(sessionStorage.getItem('user')).id;
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/tickets/${userId}`,
      headers: { 
        Authorization: `Bearer ${authToken}`
      }
    };

    const response = await axios.request(config);
    console.log(response)
    return response.data;
  } catch (error) { 
    console.log(error);
    return [];
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "in progress":
      return "#ffd19f";
    case "open":
      return "#ffe082";
    default:
      return "#A9A9A9";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "#ff9b9b";
    case "medium":
      return "#f9b062";
    case "low":
      return "#c6f4d6";
    default:
      return "#fff";
  }
};

function BoardView({ priority }) {
  const [tickets, setTickets] = useState([]);
  const [todoTickets, setTodoTickets] = useState([]);
  const [inprogressTickets, setInprogressTickets] = useState([]);
  const [completedTickets, setCompletedTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const tickets = await getAllUserTickets();
      if (Array.isArray(tickets)) {
        setTickets(tickets);
        setTodoTickets(tickets.filter((ticket) => ticket.status === "open"));
        setInprogressTickets(tickets.filter((ticket) => ticket.status === "in progress"));
        setCompletedTickets(tickets.filter((ticket) => ticket.status === "closed"));
      } else {
        console.error("Invalid response from API:", tickets);
      }
    };
    fetchTickets();
  }, []);

  return (
    <Box className="board task-container" mt={4}>
      <Grid container spacing={3}>
        <Grid item sm={4}>
          <Box className="task-grid">
            <Box className="task-header">
              <p>To do</p>
              <Box>
                <AddIcon />
              </Box>
            </Box>
            {todoTickets
              .filter((ticket) =>
                priority && priority !== "Select"
                  ? ticket.priority === priority
                  : ticket
              )
              .map((ticket) => {
                return (
                  <Box className="task-card" draggable>
                    <p className="title">{ticket.title}</p>
                    <p className="detail">{ticket.description}</p>
                    <Box className="card-footer" mt={2}>
                      <Box className="assigne">
                        <Box className="avatar"></Box>
                      </Box>
                      <Box
                        className="priority"
                        sx={{ background: getPriorityColor(ticket.severity) }}
                      >
                        <p>{ticket.severity}</p>
                      </Box>
                      <Box
                        className="status"
                        sx={{ background: getStatusColor(ticket.status) }}
                      >
                        <p>{ticket.status}</p>{" "}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </Grid>
        <Grid item sm={4}>
          <Box className="task-grid">
            <Box className="task-header">
              <p>In progress</p>
              <Box>
                <AddIcon />
              </Box>
            </Box>
            {inprogressTickets
              .filter((ticket) =>
                priority && priority !== "Select"
                  ? ticket.priority === priority
                  : ticket
              )
              .map((ticket) => {
                return (
                  <Box className="task-card" draggable>
                    <p className="title">{ticket.title}</p>
                    <p className="detail">{ticket.description}</p>
                    <Box className="card-footer" mt={2}>
                      <Box className="assigne">
                        <Box className="avatar"></Box>
                      </Box>
                      <Box
                        className="priority"
                        sx={{ background: getPriorityColor(ticket.severity) }}
                      >
                        <p>{ticket.severity}</p>
                      </Box>
                      <Box
                        className="status"
                        sx={{ background: getStatusColor(ticket.status) }}
                      >
                        <p>{ticket.status}</p>{" "}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </Grid>
        <Grid item sm={4}>
          <Box className="task-grid">
            <Box className="task-header">
              <p>closed</p>
              <Box>
                <AddIcon />
              </Box>
            </Box>
            {completedTickets
              .filter((ticket) =>
                priority && priority !== "Select"
                  ? ticket.priority === priority
                  : ticket
              )
              .map((ticket) => {
                return (
                  <Box className="task-card" draggable>
                    <p className="title">{ticket.title}</p>
                    <p className="detail">{ticket.description}</p>
                    <Box className="card-footer" mt={2}>
                      <Box className="assigne">
                        <Box className="avatar"></Box>
                      </Box>
                      <Box
                        className="priority"
                        sx={{ background: getPriorityColor(ticket.severity) }}
                      >
                        <p>{ticket.severity}</p>
                      </Box>
                      <Box
                        className="status"
                        sx={{ background: getStatusColor(ticket.status) }}
                      >
                        <p>{ticket.status}</p>{" "}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
              </Box>
            </Grid>
          </Grid>
        </Box>
  )
}

export default BoardView
