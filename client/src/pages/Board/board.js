import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Button,
  Divider,
  Fade,
  Paper,
  Popper,
  Typography
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import AddTaskModal from "../../components/AddTaskModal/modal";
import BoardView from "../../components/board/boardView";
import ListView from "../../components/board/listView";
import Header from "../../components/header/header";

function Board() {
  const [open, setOpen] = React.useState(false);
  const [priority, setPriority] = useState("Select");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popperOpen, setPopperOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const [toggleView, setToggleView] = useState("List");

  const [newTicket, setNewTicket] = useState(false);
  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setPopperOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  const handleOpen = () => setOpen(true);
  const handleClose123 = () => setOpen(false);
  const handlePriority = (value) => {
    setPriority(value);
    setPopperOpen(false);
  };

  const handleToggleView = (view) => {
    setToggleView(view);
  };

  const [getAllUserTickets, setGetAllUserTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = sessionStorage.getItem('accessJWT');
        if (!token) {
          console.error("No token found");
          return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const response = await axios.get(`http://localhost:8000/api/tickets/${userId}`);
        setGetAllUserTickets(response.data.reverse());
      } catch (error) {
        console.error(error);
      }
    };
    fetchTickets();
  }, []);


 

const todoList = getAllUserTickets.filter((ticket) => ticket.status === "open");
const inprogressList = getAllUserTickets.filter((ticket) => ticket.status === "closed");
const completedList = getAllUserTickets.filter((ticket) => ticket.status === "in progress");

  return (
    <div className="main-dashboard">
      <Header />
      <Divider />
      <Box className="content">
        <Box className="heading">
          <h2>Board</h2>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Ticket
          </Button>
        </Box>
        <Box className="project-block" mt={3}>
          <Box className="project-title">
            <Box className="icon">
            <AccountCircleIcon />
            {/* <img src={image} alt="Image" style={{ width: '100%', height: '100%' }} /> */}
            </Box>
            <p>
              Project 1
              <span>
                <KeyboardArrowDownIcon />
              </span>
            </p>
          </Box>
          <Box className="filter-section">
            <Box className="view-toggle">
              <Box
                className={`${toggleView === "List" ? "selected" : ""}`}
                onClick={() => handleToggleView("List")}
              >
                <p className="toggle-button">
                  <span>
                    <FormatListBulletedIcon />
                  </span>
                  List
                </p>
              </Box>
              {/* <Box
                className={`${toggleView === "Board" ? "selected" : ""}`}
                onClick={() => handleToggleView("Board")}
              >
                <p className="toggle-button">
                  <span>
                    <GridViewIcon />
                  </span>
                  Board
                </p>
              </Box> */}
            </Box>
            {/* <Box className="priority-filter">
              <p>
                Priority :{" "}
                <span
                  onBlur={() => setPopperOpen(false)}
                  onClick={handleClick("bottom")}
                >
                  {priority}
                </span>
                <span>
                  <KeyboardArrowDownIcon />
                </span>
              </p>
              <Popper
                sx={{ zIndex: 1200, width: "200px", padding: "10px" }}
                open={popperOpen}
                anchorEl={anchorEl}
                placement={placement}
                transition
                onBlur={()=>setPopperOpen(false)}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper sx={{ padding: "10px" }}>
                      <Box onClick={() => handlePriority("High")}>
                        <p style={{cursor:"pointer"}}>High</p>
                        <Divider />
                      </Box>
                      <Box onClick={() => handlePriority("Medium")}>
                        <p style={{cursor:"pointer"}}>Medium</p>
                        <Divider />
                      </Box>
                      <Box onClick={() => handlePriority("Low")}>
                        <p style={{cursor:"pointer"}}>Low</p>
                      </Box>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </Box> */}
            <Box className="assigne-filter">
              <AccountCircleIcon />
              <p>Assignee</p>
            </Box>
          </Box>
        </Box>
        {toggleView === "Board" ? (
          <BoardView
            todoList={todoList}
            inprogressList={inprogressList}
            completedList={completedList}
            priority={priority}
          />
        ) : (
          <ListView newTicket={newTicket} setNewTicket={setNewTicket} />
        )}
      </Box>
      <AddTaskModal
        open={open}
        handleClose={handleClose123}
        handleOpen={handleOpen}
        setNewTicket={setNewTicket}
      />
    </div>
  );
}

export default Board;
