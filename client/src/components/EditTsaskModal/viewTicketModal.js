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
import { Close, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BasicDateField from "../date/basicDateField";
import dayjs from "dayjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 880,
  bgcolor: "background.paper",
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
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

  // const handleReplySubmit = async () => {
  //   const updatedTitle = editedTitle;
  //   const updatedDescription = editedDescription;
  //   const updatedSeverity = editedSeverity;
  //   const updatedStatus = editedStatus;
  //   const startDate = editedStartDate;
  //   const dueDate = editedDueDate;

  //   const user = sessionStorage.getItem("user");
  //   const userName = JSON.parse(user).name;

  //   if (reply.trim() === "") {
  //     setError("Reply cannot be empty");
  //     setTimeout(() => {
  //       setError(null);
  //     }, 2000);
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     // Update ticket details if in edit mode
  //     if (isEditMode) {
  //       await axios.patch(
  //         `http://localhost:8000/api/tickets/${ticket._id}`,
  //         {
  //           title: updatedTitle,
  //           description: updatedDescription,
  //           severity: updatedSeverity,
  //           status: updatedStatus,
  //           startDate: startDate,
  //           dueDate: dueDate,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${authToken}`,
  //           },
  //         }
  //       );
  //       // Set edit mode back to false after saving
  //       setIsEditMode(false);
  //     }

  //     // Add the comment to the ticket
  //     const commentResponse = await axios.post(
  //       `http://localhost:8000/api/tickets/${ticket._id}/comments`,
  //       {
  //         text: reply,
  //         role: "user",
  //         name: userName,
  //         date: new Date().toISOString(),
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       }
  //     );

  //     if (commentResponse.status === 200) {
  //       setCommennt(commentResponse.data.comments);
  //       setReply("");
  //       commentsRef.current.scrollTo({
  //         top: commentsRef.current.scrollHeight,
  //         behavior: "smooth",
  //       });
  //       handleCloseModal();
  //       toast.success("Ticket updated successfully!");
  //     }
  //   } catch (error) {
  //     toast.error("Error updating ticket. Please try again.");
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    // localStorage.removeItem("ticket");
    // localStorage.setItem("ticket", JSON.stringify(ticket));
    // navigate("/ticket-details");
    const ticketData = {
      tId: ticket._id,
      ticketId: ticket.ticketId,
      title: ticket.title,
      description: ticket.description,
      severity: ticket.severity,
      status: ticket.status,
      startDate: ticket.startDate,
      dueDate: ticket.dueDate,
      // comments: comments,
    };
    localStorage.setItem("ticket", JSON.stringify(ticketData));
    console.log("ticketData: ",ticketData)
  
    navigate({
      pathname:"/ticket-details",
      search:`?${Object.keys(ticketData).map((key) => `${key}=${ticketData[key]}`).join('&')}`,
    
    })
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

  const handleAssign = async () => {
    console.log(ticket._id);
    await fetch(`http://localhost:8000/api/tickets/${ticket._id}/assign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedUser, assignedOperator }),
    });
  };

  return (
    <div className="ViewTicket">
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Close sx={{ marginLeft: 90 }} onClick={handleCloseModal} />
          <Box display="flex" justifyContent="space-between">
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ fontSize: 18 }}
            >
              Ticket Id: {ticket.ticketId}
            </Typography>
            <Box display="flex">
              <Button
                sx={{ marginRight: 0 }}
                variant="contained"
                color="primary"
                onClick={handleViewClick}
              >
                View
              </Button>
            </Box>
          </Box>

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
                <Typography
                  sx={{
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
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", paddingTop: 1.5 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditToggle}
                  startIcon={<Edit />}
                >
                  {isEditMode ? "Save" : "Edit"}
                </Button>
              </Box>
            </Box>
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
              rows={4}
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
                  <Typography
                    sx={{
                      paddingLeft: 1,
                      paddingTop: 2,
                      paddingRight: 1,
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
                <Box display="flex" gap={2}>
                  <Typography
                    sx={{
                      paddingLeft: 1,
                      paddingTop: 2,
                      paddingRight: 1,
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
                  <Typography
                    sx={{
                      paddingLeft: 1,
                      paddingRight: 1,
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

            <Box
              className="comment-section"
              mt={1}
              sx={{
                background: "#eaeaea",
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
                    flexDirection="column"
                    sx={{
                      backgroundColor: "#fff",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      marginBottom: "16px",
                      width: "100%",
                    }}
                  >
                    <Typography variant="body2" color="textPrimary">
                      <strong>
                        {comment.name} ({comment.role.toUpperCase()}):
                      </strong>{" "}
                      {comment.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ alignSelf: "flex-end" }}
                    >
                      {new Date(comment.date).toLocaleDateString("en-GB")}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ alignSelf: "flex-start" }}
                    >
                      {new Date(comment.date).toLocaleTimeString("en-GB")}
                    </Typography>
                    <hr
                      style={{
                        border: "none",
                        height: "1px",
                        backgroundColor: "#ddd",
                        margin: "8px 0",
                      }}
                    />
                  </Box>
                ))
              )}
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
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
