import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { ArrowDropDownCircleOutlined, Close, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BasicDateField from "../date/basicDateField";
import dayjs from "dayjs";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  height: 900,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  display: "flex",
  // alignItems: "center",
};

export default function ViewTaskModal({
  open,
  handleClose,
  ticket,
  comments,
  setCommennt,
}) {
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("accessJWT");
  const [reply, setReply] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const commentsRef = React.useRef(null);
  const [editedStartDate, setEditedStartDate] = React.useState(
    ticket.startDate ? dayjs(ticket.startDate) : dayjs() // Initialize with a valid date value
  );

  const [imageUrl, setImageUrl] = React.useState('');

  const [editedDueDate, setEditedDueDate] = React.useState(
    ticket.dueDate ? dayjs(ticket.dueDate) : dayjs() // Initialize with a valid date value
  );
  // State to manage edit mode
  const [isEditMode, setIsEditMode] = React.useState(false);

  const handleCloseModal = () => {
    setIsEditMode(false); // Reset isEditMode to false when the modal is closed
    handleClose(); // Call the parent handleClose function to close the modal
  };

  // Editable fields
  const [editedTitle, setEditedTitle] = React.useState(ticket.title);
  const [editedDescription, setEditedDescription] = React.useState(
    ticket.description
  );
  const [editedStatus, setEditedStatus] = React.useState(ticket.status);
  const [editedSeverity, setEditedSeverity] = React.useState(ticket.severity);

  const [users, setUsers] = React.useState([]);
  const [operators, setOperators] = React.useState([]);
  const [assignedUser, setAssignedUser] = React.useState("");
  const [assignedOperator, setAssignedOperator] = React.useState("");

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };


  const handleReplyChange = (event) => {
    setReply(event.target.value);
    setError(null);
  };

  const handleReplySubmit = async () => {
    const updatedTitle = editedTitle;
    const updatedDescription = editedDescription;
    const updatedSeverity = editedSeverity;
    const updatedStatus = editedStatus;
    const startDate = editedStartDate;
    const dueDate = editedDueDate;

    const user = sessionStorage.getItem("user");
    const userName = JSON.parse(user).name;

    if (reply.trim() === "") {
      setError("Reply cannot be empty");
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }

    setLoading(true);
    try {
      // Update ticket details if in edit mode
      if (isEditMode) {
        await axios.patch(
          `http://localhost:8000/api/tickets/${ticket._id}`,
          {
            title: updatedTitle,
            description: updatedDescription,
            severity: updatedSeverity,
            status: updatedStatus,
            startDate: startDate,
            dueDate: dueDate,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        // Set edit mode back to false after saving
        setIsEditMode(false);
      }

      // Assign user and operator to the ticket
      await fetch(`http://localhost:8000/api/tickets/${ticket._id}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ assignedUser, assignedOperator }),
      });

      // Add the comment to the ticket
      const commentResponse = await axios.post(
        `http://localhost:8000/api/tickets/${ticket._id}/comments`,
        {
          text: reply,
          role: "user",
          name: userName,
          date: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (commentResponse.status === 200) {
        setCommennt(commentResponse.data.comments);
        setReply("");
        commentsRef.current.scrollTo({
          top: commentsRef.current.scrollHeight,
          behavior: "smooth",
        });
        handleCloseModal();
        toast.success("Ticket updated successfully!");
      }
    } catch (error) {
      toast.error("Error updating ticket. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = () => {
    const ticketData = {
      tId: ticket._id,
      ticketId: ticket.ticketId,
      title: ticket.title,
      description: ticket.description,
      severity: ticket.severity,
      status: ticket.status,
      startDate: ticket.startDate,
      dueDate: ticket.dueDate,
    };
    localStorage.setItem("ticket", JSON.stringify(ticketData));
    console.log("ticketData: ", ticketData);

    navigate({
      pathname: "/ticket-details",
      search: `?${Object.keys(ticketData)
        .map((key) => `${key}=${ticketData[key]}`)
        .join("&")}`,
    });
    // const url = `ticket-details?${Object.keys(ticketData).map((key) => `${key}=${ticketData[key]}`).join('&')}`;
    // window.open(url, '_blank');
  };

  React.useEffect(() => {
    // Fetch users and operators from the backend
    const fetchUsersAndOperators = async () => {
      try {
        console.log("checking checking");
        const usersResponse = await axios.get(
          "http://localhost:8000/api/users/getOperators"
        );
        console.log(usersResponse.data[0].name);
        setUsers(usersResponse.data);

        const operatorsResponse = await axios.get(
          "http://localhost:8000/api/users/getUsers"
        );
        setOperators(operatorsResponse.data);
      } catch (error) {
        console.error("Error fetching users and operators:", error);
      }
    };

    fetchUsersAndOperators();
  }, []);

  function getCommentTime(commentDate) {
    const commentDateTime = new Date(commentDate);
    const currentDateTime = new Date();
    const diffTime = Math.abs(currentDateTime - commentDateTime);
    const diffSeconds = Math.ceil(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} and ${
        diffHours % 24
      } hour${diffHours % 24 > 1 ? "s" : ""}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} and ${
        diffMinutes % 60
      } minute${diffMinutes % 60 > 1 ? "s" : ""}`;
    } else if (diffMinutes > 1) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  }

  return (
    <div className="ViewTicket">
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box display="flex" flexDirection="column" width="60%">
            <Box display="flex" justifyContent="space-between">
              <Box width="70%">
                <Typography
                  variant="h6"
                  color="textSecondary"
                  sx={{ fontSize: 18, paddingTop: 2 }}
                >
                  Ticket Id: {ticket.ticketId}
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                paddingTop: 2,
                color: isEditMode ? "black" : "grey",
              }}
            >
              Title:
            </Typography>
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              variant="outlined"
              disabled={!isEditMode}
              defaultValue={ticket.title}
              size="small"
              sx={{
                background: "#eaeaea",
                width: 600,
                "& .MuiOutlinedInput-notchedOutline": {
                  border: isEditMode ? "1px solid" : "none",
                },
              }}
            />

            <Typography
              sx={{
                color: isEditMode ? "black" : "grey",
              }}
            >
              Description:
            </Typography>
            <TextField
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              variant="outlined"
              multiline
              rows={3}
              fullWidth
              defaultValue={ticket.description}
              disabled={!isEditMode}
              sx={{
                marginTop: 0.05,
                background: "#eaeaea",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: isEditMode ? "1px solid" : "none",
                },
              }}
            />

            {/* Attachment section  */}
              <Typography sx={{color: "grey", fontWeight: "bold", pt: 1}}> 
                Attachment
              </Typography>
            <Box
              className="attachment-section"
              sx={{
                background: "#000",
                mt: 1,

                height: "200px",
              }}
              
            >
                <Box className="attachment-section" mt={1} sx={{ background: "#fff", border: "1px solid #ddd", borderRadius: "4px", padding: "8px" }}>
            {imageUrl && (
              <img src="../../" alt="Attachment" style={{ width: 100, height: 100}} />
            )}
            {ticket.image}
          </Box>


            </Box>

            <Box
              className="comment-section"
              mt={1}
              sx={{
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "8px",
                maxHeight: "320px",
                overflowY: "auto",
                width: "100%",
              }}
              ref={commentsRef}
            >
              {comments.length === 0 ? (
                <Box
                  display="flex"
                  justifyContent="space-evenly"
                  sx={{
                    // alignItems: "center",
                    paddingTop: 2,
                    paddingBottom: 2,
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <img
                    src={require("../../assets/img/chat.png")}
                    alt="No comments"
                    style={{
                      width: 120,
                      height: 120,
                      opacity: 0.2,
                    }}
                  />
                  <Typography
                    display="flex"
                    alignItems="center"
                    fontSize="25px"
                    fontWeight="bold"
                    color="grey"
                    sx={{ opacity: 0.5 }}
                  >
                    No comments yet!
                  </Typography>
                </Box>
              ) : (
                comments.map((comment, index) => (
                  <Box
                    key={index}
                    className="comment-box"
                    mb={1}
                    display="flex"
                    flexDirection="row"
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      sx={{
                        width: "5%",
                      }}
                    >
                      <AccountCircleIcon />
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <Typography>
                        {comment.role.toUpperCase()}:{" "}
                        {new Date(comment.date).toLocaleDateString("en-GB")}
                      </Typography>
                      <Typography>{comment.text}</Typography>
                      <Typography sx={{ fontSize: 12 }}>
                        Commented {getCommentTime(comment.date)}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
            <TextField
              id="reply"
              placeholder="add a comment"
              multiline
              rows={1}
              value={reply}
              onChange={handleReplyChange}
              variant="outlined"
              sx={{ mt: 1, width: "100%" }}
            />
            {error && (
              <Typography color="error" sx={{ marginTop: "8px" }}>
                {error}
              </Typography>
            )}

            {/* REPLY SECTION  */}
            

            {/* 60% box */}
          </Box>
          <Box width="40%">
            <Box display="flex" justifyContent="end">
              <Close onClick={handleCloseModal} />
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="end"
              gap={2}
              sx={{ paddingTop: 2 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditToggle}
                startIcon={<Edit />}
              >
                {isEditMode ? "Save" : "Edit"}
              </Button>
              <Button
                sx={{ marginRight: 0 }}
                variant="contained"
                color="primary"
                onClick={handleViewClick}
              >
                View
              </Button>
            </Box>
            <Box display="flex" flexDirection="row" gap={8.5}>
              <Box paddingLeft="20px" display="flex" flexDirection="column">
                <Typography
                  sx={{
                    paddingTop: 2,
                    color: isEditMode ? "black" : "grey",
                  }}
                >
                  Select Status
                </Typography>
                <Select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  fullWidth={false}
                  defaultValue={ticket.status}
                  disabled={!isEditMode}
                  sx={{
                    fontSize: "16px", // reduce font size
                    padding: "2px 4px", // reduce padding
                    height: "50px", // reduce height
                    width: "195px",

                    "& .MuiOutlinedInput-notchedOutline": {
                      border: isEditMode ? "1px solid" : "none",
                      color: isEditMode ? "black" : "grey",
                    },
                  }}
                >
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                  <MenuItem value="in progress">In Progress</MenuItem>
                </Select>
              </Box>
              <Box display="flex" flexDirection="column">
                <Typography
                  sx={{
                    paddingTop: 2,
                    color: isEditMode ? "black" : "grey",
                  }}
                >
                  Select Severity
                </Typography>
                <Select
                  value={editedSeverity}
                  onChange={(e) => setEditedSeverity(e.target.value)}
                  fullWidth={false}
                  defaultValue={ticket.severity}
                  disabled={!isEditMode}
                  sx={{
                    fontSize: "16px", // reduce font size
                    padding: "2px 4px", // reduce padding
                    height: "50px", // reduce height
                    width: "175px",

                    "& .MuiOutlinedInput-notchedOutline": {
                      border: isEditMode ? "1px solid" : "none",
                      color: isEditMode ? "black" : "grey",
                    },
                  }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </Box>
            </Box>

            <Box display="flex" flexDirection="row" gap={6}>
              <Box paddingLeft="20px" display="flex" flexDirection="column">
                <Typography
                  sx={{
                    paddingTop: 2,
                    color: isEditMode ? "black" : "grey",
                  }}
                >
                  Start Date
                </Typography>
                <BasicDateField
                  value={editedStartDate}
                  onChange={(e) => setEditedStartDate(e.target.value)}
                  name="startDate"
                  disabled={!isEditMode}
                />
              </Box>
              <Box display="flex" flexDirection="column">
                <Typography
                  sx={{
                    paddingTop: 2,
                    color: isEditMode ? "black" : "grey",
                  }}
                >
                  Due Date
                </Typography>
                <BasicDateField
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                  name="dueDate"
                  disabled={!isEditMode}
                />
              </Box>
            </Box>
            <Box sx={{ paddingTop: 2, marginLeft: 2 }}>
              <Accordion fullWidth>
                <AccordionSummary
                  expandIcon={<ArrowDropDownCircleOutlined />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography>Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display="flex" flexDirection="column">
                    <Box
                      display="flex"
                      flexDirection="row"
                      sx={{ paddingBottom: 2 }}
                    >
                      <Typography
                        sx={{
                          paddingTop: 1,
                          paddingRight: 2,
                          color: isEditMode ? "black" : "grey",
                        }}
                      >
                        Assignee
                      </Typography>
                      <Select
                        value={assignedUser}
                        onChange={(e) => setAssignedUser(e.target.value)}
                        sx={{
                          fontSize: "16px", // reduce font size
                          padding: "2px 4px", // reduce padding
                          height: "50px", // reduce height
                          width: "150px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: isEditMode ? "1px solid" : "none",
                            color: isEditMode ? "black" : "grey",
                          },
                        }}
                      >
                        <option value="">Select User</option>
                        {users.map((user) => (
                          <MenuItem key={user._id} value={user._id}>
                            {user.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                    <Box display="flex" flexDirection="row">
                      <Typography
                        sx={{
                          paddingTop: 1,
                          paddingRight: 2,
                          color: isEditMode ? "black" : "grey",
                        }}
                      >
                        Reporter
                      </Typography>

                      <Select
                        value={assignedOperator}
                        onChange={(e) => setAssignedOperator(e.target.value)}
                        sx={{
                          fontSize: "16px", // reduce font size
                          padding: "2px 4px", // reduce padding
                          height: "50px", // reduce height
                          width: "150px",

                          "& .MuiOutlinedInput-notchedOutline": {
                            border: isEditMode ? "1px solid" : "none",
                            color: isEditMode ? "black" : "grey",
                          },
                        }}
                      >
                        <option value="">Select Operator</option>
                        {operators.map((operator) => (
                          <MenuItem key={operator._id} value={operator._id}>
                            {operator.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
            <Box>
              <Typography sx={{ color: "#706e6e", pl: 2, pt: 2 }}>
                Created at{" "}
                {new Date(ticket.startDate).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
              <Typography>Updated at</Typography>
            </Box>

            <Box sx={{ position: "absolute", bottom: 0, right: 0, padding: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleReplySubmit}
                disabled={loading}
              >
                Submit
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    marginLeft: "16px",
                  }}
                />
              )}
            </Box>

            {/* 40% box */}
          </Box>

          {/*
          

          <Box
            className="ViewTicketModalBox"
            sx={{
              width: "100%",
            }}
          >
            <Box
              sx={{ cursor: "pointer", ml: 2, paddingLeft: 88 }}
              onClick={handleClose}
            ></Box>
            <Box
              className="heading"
              mt={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box marginBottom="10px">
                
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", paddingTop: 1.5 }}
              >
                
              </Box>
            </Box>
            
            <Box
              className="info"
              mt={1}
              display="flex"
              flexDirection="column"
              gap={1}
              sx={{
                backgroundColor: "#f7f7f7",
                padding: 1,
                borderRadius: 1,
                width: 550,
              }}
            >
              <Box display="flex" justifyContent="space-between">
                
                <Box display="flex" gap={2}>
                  
                </Box>
                <Typography
                  sx={{
                    paddingLeft: 1,
                    paddingTop: 2,
                    paddingRight: 1,
                    color: isEditMode ? "black" : "grey",
                  }}
                >
                  Assignee
                </Typography>
                <Box display="flex">
                  <Select
                    value={assignedUser}
                    onChange={(e) => setAssignedUser(e.target.value)}
                    sx={{
                      fontSize: "16px", // reduce font size
                      padding: "2px 4px", // reduce padding
                      height: "50px", // reduce height

                      "& .MuiOutlinedInput-notchedOutline": {
                        border: isEditMode ? "1px solid" : "none",
                        color: isEditMode ? "black" : "grey",
                      },
                    }}
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography
                    sx={{
                      paddingLeft: 1,
                      paddingTop: 2,
                      paddingRight: 1,
                      color: isEditMode ? "black" : "grey",
                    }}
                  >
                    Reporter
                  </Typography>

                  <Select
                    value={assignedOperator}
                    onChange={(e) => setAssignedOperator(e.target.value)}
                    sx={{
                      fontSize: "16px", // reduce font size
                      padding: "2px 4px", // reduce padding
                      height: "50px", // reduce height

                      "& .MuiOutlinedInput-notchedOutline": {
                        border: isEditMode ? "1px solid" : "none",
                        color: isEditMode ? "black" : "grey",
                      },
                    }}
                  >
                    <option value="">Select Operator</option>
                    {operators.map((operator) => (
                      <MenuItem key={operator._id} value={operator._id}>
                        {operator.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
              <Box display="flex" justifyContent="space-around" width="530px">
                <Box display="flex" gap={2}>
                  
                </Box>
                <Box display="flex" gap={2}>
                  <Typography
                    sx={{
                      paddingLeft: 1,
                      paddingRight: 1,
                      color: isEditMode ? "black" : "grey",
                    }}
                  >
                    Due Date
                  </Typography>
                  <BasicDateField
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                    name="dueDate"
                    disabled={!isEditMode}
                    sx={{
                      fontSize: "12px", // reduce font size
                      padding: "2px 4px", // reduce padding
                      height: "20px", // reduce height
                    }}
                  />
                </Box>
              </Box>
            </Box>

            
          </Box>
          <Box
            className="reply-section"
            sx={{
              paddingBottom: "20px",
              maxWidth: "735px",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              position: "absolute",
              bottom: 0,
            }}
          >
            <TextField
              id="reply"
              label="Reply"
              multiline
              rows={2}
              value={reply}
              onChange={handleReplyChange}
              variant="outlined"
              sx={{ width: "100%", background: "#eaeaea" }}
            />
            {error && (
              <Typography color="error" sx={{ marginTop: "8px" }}>
                {error}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleReplySubmit}
                disabled={loading}
              >
                Submit
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    marginLeft: "16px",
                  }}
                />
              )}
            </Box>
          </Box> */}
        </Box>
      </Modal>
    </div>
  );
}
