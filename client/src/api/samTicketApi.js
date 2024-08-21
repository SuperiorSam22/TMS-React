import axios from "axios";

//get all tickets
const getAllTickets = async () => {
  try {
    const response = await axios.get("/api/tickets");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Get tickets by user ID
const getTicketByUserId = async (userId) => {
  try {
    const response = await axios.get(`/api/tickets/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Create a new ticket
const createNewTicket = async (ticketData) => {
  try {
    const response = await axios.post("/api/tickets", ticketData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Update a ticket
const updateTicket = async (ticketId, ticketData) => {
  try {
    const response = await axios.put(`/api/tickets/${ticketId}`, ticketData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Delete a ticket
const deleteTicket = async (ticketId) => {
  try {
    const response = await axios.delete(`/api/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Get ticket by ticket ID
const getTicketByTicketId = async (ticketId) => {
  try {
    const response = await axios.get(`/api/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const addCommentToTicket = async (ticketId, commentData) => {
  try {
    const response = await axios.post(
      `/api/tickets/${ticketId}/comments`,
      commentData
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Get comments by ticket ID
const getCommentsByTicketId = async (ticketId) => {
  try {
    const response = await axios.get(`/api/tickets/${ticketId}/comments`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export {
  getAllTickets,
  getTicketByUserId,
  createNewTicket,
  updateTicket,
  deleteTicket,
  getTicketByTicketId,
  addCommentToTicket,
  getCommentsByTicketId,
};
