import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Chip } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditTaskModal from "../EditTsaskModal/editTaskModal";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ViewTaskModal from "../EditTsaskModal/viewTicketModal";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import TicketViewDetails from "../ticketView/ticketViewDetails";
import TicketDetailsPage from "../ticketdetails/TicketDetails";

const getAllUserTickets = async () => {
  try {
    const userId = JSON.parse(sessionStorage.getItem("user")).id;
    const authToken = sessionStorage.getItem("accessJWT");
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/tickets/${userId}?sort=date&order=desc`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const response = await axios.request(config);
    const tickets = response.data;
    const reversedTickets = [...tickets].reverse(); // create a copy of the array before reversing
    return reversedTickets;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getAllTickets = async () => {
  try {
    const userId = JSON.parse(sessionStorage.getItem("user")).id;
    const authToken = sessionStorage.getItem("accessJWT");
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/tickets/${userId}/getAll?sort=date&order=desc`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const response = await axios.request(config);
    const tickets = response.data;
    const reversedTickets = [...tickets].reverse(); // create a copy of the array before reversing
    return reversedTickets;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getAllComments = async (ticketId) => {
  const authToken = sessionStorage.getItem("accessJWT");
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/tickets/${ticketId}/comments`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const columns = [
  {
    id: "title",
    label: "Title",
    minWidth: 150,
  },
  {
    id: "detail",
    label: "Detail",
    minWidth: 500,
  },
  {
    id: "priority",
    label: "Priority",
    minWidth: 100,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
  },
  {
    id: "startDate",
    label: "Start Date",
    minWidth: 150,
  },
  {
    id: "dueDate",
    label: "Due Date",
    minWidth: 150,
  },
];

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "#ff9b9b";
    case "medium":
      return "#f9b062";
    case "low":
      return "#C6F4D6";
    default:
      return "#fff";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "in progress":
      return "#ffd19f";
    case "open":
      return "#ffe082";
    case "closed":
      return "#cdcdd1";
    default:
      return "#fff";
  }
};

export default function ListView({ newTicket, setNewTicket }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [todoList, setTodoList] = React.useState([]);
  const [ticketVal, setTicketVal] = React.useState([]);
  const [comments, setComments] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [openTaskModal, setOpenTaskModal] = React.useState(false);

  React.useEffect(() => {
    const user = sessionStorage.getItem("user");
    const userRole = JSON.parse(user).role;

    if (userRole === "operator") {
      const fetchTickets = async () => {
        const tickets = await getAllTickets();
        console.log("get All tickets", tickets);
        setTodoList(tickets);
      };
      fetchTickets();
    } else {
      const fetchTickets = async () => {
        const tickets = await getAllUserTickets();
        console.log("get all user tickets", tickets);
        setTodoList(tickets);
      };
      fetchTickets();
    }
  }, [newTicket, openModal, openTaskModal]);

  React.useEffect(() => {
    const fetchComments = async () => {
      const comments = await getAllComments(ticketVal._id);
      setComments(comments);
    };
    fetchComments(ticketVal._id);
  }, [ticketVal]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleShow = (ticket) => {
    setTicketVal(ticket);
    setOpenModal(true);
  };
  const handleShowTaskModal = (ticket) => {
    setTicketVal(ticket);
    setOpenTaskModal(true);
  };

  const handlePageRedirect = (ticket) => {
    sessionStorage.setItem("ticketDetails", JSON.stringify(ticket));
    sessionStorage.setItem("ticketComments", JSON.stringify(comments));
    window.open("/ticket-details", "_blank");
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleTaskModalClose = () => {
    setOpenTaskModal(false);
  };

  const [error, setError] = React.useState(null);

  const handleDelete = async (ticketId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/tickets/${ticketId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        // Remove the ticket from the view
        const updatedTodoList = todoList?.filter(
          (ticket) => ticket._id !== ticketId
        );
        setTodoList(updatedTodoList);
      } else {
        setError(response.statusText);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box sx={{ width: "100%" }} mt={3}>
      <TableContainer sx={{ maxHeight: "650px", overflow: "auto" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {todoList
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ticket) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={ticket._id}
                  >
                    <TableCell
                      onClick={() => handleShowTaskModal(ticket)}
                      sx={{ cursor: "pointer" }}
                    >
                      {ticket.title}
                    </TableCell>
                    <TableCell
                    onClick={()=> handlePageRedirect(ticket)}
                    sx={{cursor: "pointer"}}
                    >{ticket.description.length > 100 ? ticket.description.substring(0, 100) + "..." : ticket.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          ticket.severity.charAt(0).toUpperCase() +
                          ticket.severity.slice(1)
                        }
                        sx={{ background: getPriorityColor(ticket.severity) }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          ticket.status.charAt(0).toUpperCase() +
                          ticket.status.slice(1)
                        }
                        sx={{ background: getStatusColor(ticket.status) }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Intl.DateTimeFormat("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      }).format(new Date(ticket.startDate))}
                    </TableCell>
                    <TableCell>
                      {new Intl.DateTimeFormat("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      }).format(new Date(ticket.dueDate))}
                    </TableCell>
                    {/* <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box onClick={() => handleShow(ticket)} sx={{ cursor: 'pointer' }}>
                            <EditOutlinedIcon />
                          </Box>
                        </Box>
                        </TableCell> */}
                        </TableRow> 
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>       
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={todoList?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <EditTaskModal
        handleClose={handleModalClose}
        open={openModal}
        ticket={ticketVal}
        setTodoList={setTodoList}
      />
      <ViewTaskModal
        handleClose={handleTaskModalClose}
        open={openTaskModal}
        ticket={ticketVal}
        comments={comments}
        setCommennt={setComments}
      />
      {/* <TicketDetailsPage  ticket={ticketVal}
        comments={comments} setCommennt={setComments}/> */}
      {/* <TicketViewDetails handleClose={handleTaskModalClose} open={openTaskModal} ticket={ticketVal} comments={comments} setCommennt={setComments}/> */}
    </Box>
  );
}
