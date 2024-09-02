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
import { ArrowDropDownCircleOutlined, Close } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BasicDateField from "../date/basicDateField";
import dayjs from "dayjs";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LinkIcon from "@mui/icons-material/Link";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LabelIcon from "@mui/icons-material/Label";
import { cleanLeadingZeros } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  height: 900,
  bgcolor: "background.paper",
  borderRadius: 1,
  boxShadow: 24,
  p: 3,
  display: "flex",
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
  const [dateError, setDateError] = React.useState(null);
  const commentsRef = React.useRef(null);
  const [editedStartDate, setEditedStartDate] = React.useState(
    ticket.startDate ? dayjs(ticket.startDate) : dayjs()
  );

  const [imageUrl, setImageUrl] = React.useState("");

  const [editedDueDate, setEditedDueDate] = React.useState(
    ticket.dueDate ? dayjs(ticket.dueDate) : dayjs()
  );
  // State to manage edit mode
  const [isEditMode, setIsEditMode] = React.useState(false);

  const handleCloseModal = () => {
    setIsEditMode(false);
    handleClose();
  };

  React.useEffect(() => {
    setEditedTitle(ticket.title);
    setEditedDescription(ticket.description);
    setEditedStatus(ticket.status);
    setEditedSeverity(ticket.severity);
    setEditedStartDate(ticket.startDate ? dayjs(ticket.startDate) : dayjs());
    setEditedDueDate(ticket.dueDate ? dayjs(ticket.dueDate) : dayjs());
    setAssignedUser(ticket.assignedUser);
    setAssignedOperator(ticket.assignedOperator);
    setReply("");
  }, [open, ticket]);

  React.useEffect(() => {
    if (ticket.image) {
      setImageUrl(`http://localhost:8000/uploads/${ticket.image}`);
    }
  }, [ticket.image]);

  // const handleRemoveAttachment = () => {
  //   setSelectedFile(null);
  //   setImageUrl("");
  // };

  // Editable fields
  const [editedTitle, setEditedTitle] = React.useState(ticket.title);
  const [editedDescription, setEditedDescription] = React.useState(
    ticket.description
  );
  const [editedStatus, setEditedStatus] = React.useState(ticket.status);
  const [editedSeverity, setEditedSeverity] = React.useState(ticket.severity);

  const [users, setUsers] = React.useState([]);
  const [operators, setOperators] = React.useState([]);
  const [assignedUser, setAssignedUser] = React.useState(ticket.assignedUser);
  const [assignedOperator, setAssignedOperator] = React.useState(
    ticket.assignedOperator
  );
  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleReplyChange = (event) => {
    setReply(event.target.value);
    setError(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    // Make API call to your Multer backend
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  const handleSelectChange = (e, type) => {
    if (type === "user") {
      const selectedUserId = e.target.value;
      setAssignedUser(selectedUserId);
      console.log(selectedUserId);
      localStorage.setItem("assignedUser", selectedUserId);
    } else if (type === "operator") {
      const selectedOperatorId = e.target.value;
      setAssignedOperator(selectedOperatorId);
      console.log(selectedOperatorId);
      localStorage.setItem("assignedOperator", selectedOperatorId);
    }
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

    if (startDate > dueDate) {
      setDateError("Start date cannot be after due date");
      setTimeout(() => {
        setDateError(null);
      }, 2000);
      return;
    }

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
      // if (isEditMode) {
      try {
        await axios.patch(
          `http://localhost:8000/api/tickets/${ticket._id}/ticketdetails`,
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
      } catch (error) {
        console.error(error);
        toast.error("Error updating ticket. Please try again.");
      }
      // }

      // Assign user and operator to the ticket
      try {
        const assignData = {
          assignedUser: assignedUser,
          assignedOperator: assignedOperator,
        };
        const response = await axios.put(
          `http://localhost:8000/api/tickets/${ticket._id}/assign`,
          assignData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        // handle success response
        console.log(response);
      } catch (error) {
        console.error(error);
        if (error.response) {
          console.error(error.response);
          toast.error("Error updating Assignie. Please try again.");
        } else {
          console.error(error.message);
        }
      }

      // Add the comment to the ticket
      try {
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
        console.error(error);
        toast.error("Error adding comment. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageRedirect = (ticket) => {
    sessionStorage.setItem("ticketDetails", JSON.stringify(ticket));
    sessionStorage.setItem("ticketComments", JSON.stringify(comments));
    window.open("/ticket-details", "_blank");
  };

  React.useEffect(() => {
    // const storedAssignedUser = localStorage.getItem("assignedUser");
    const storedAssignedOperator = localStorage.getItem("assignedOperator");
    // if (storedAssignedUser) {
    //   setAssignedUser(storedAssignedUser);
    // }

    if (storedAssignedOperator) {
      setAssignedOperator(storedAssignedOperator);
    }
    // Fetch users and operators from the backend
    const fetchUsersAndOperators = async () => {
      try {
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
      } min${diffMinutes % 60 > 1 ? "s" : ""}`;
    } else if (diffMinutes > 1) {
      return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  }

  const getLastCommentDate = () => {
    if (comments.length === 0) return null;
    return comments[comments.length - 1].date;
  };

  const lastCommentDate = getLastCommentDate();

  return (
    <div className="ViewTicket">
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box width="100%" display="flex" flexDirection="row" overflow="auto">
            <Box display="flex" flexDirection="column" width="100%">
              <Box display="flex" justifyContent="space-between">
                <Box width="70%">
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    fontFamily="serif"
                    sx={{
                      fontSize: 18,
                      paddingTop: 2,
                      cursor: "pointer",
                      display: "inline-block",
                      maxWidth: "100%",
                      "&:hover": {
                        color: "blue",
                      },
                    }}
                    onClick={() => handlePageRedirect(ticket)}
                  >
                    Ticket Id: {ticket.ticketId}
                  </Typography>
                </Box>
              </Box>
              <TextField
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                variant="outlined"
                // disabled={!isEditMode}
                defaultValue={ticket.title}
                size="small"
                sx={{
                  width: 600,
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#070924",
                    pl: 0,
                    fontFamily: "unset",
                  },
                  "& .MuiInputBase-root:hover": {
                    // add this
                    backgroundColor: "#F0F1F4",
                  },
                }}
              />

              <Box display="flex" flexDirection="row" sx={{ marginBottom: 3 }}>
                <Box width="100%">
                  {/* <Button
                    type="button"
                    variant="text"
                    sx={{
                      fontSize: 10,
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "rgba(146, 175, 247, 0.2)",
                      },
                    }}
                  >
                    <span
                      sx={{
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "rgba(146, 175, 247, 0.2)",
                        },
                      }}
                    >
                      <AttachFileIcon fontSize="small" />
                    </span>
                    Attach
                  </Button> */}

                  {/* <Button
                    type="button"
                    variant="text"
                    sx={{
                      fontSize: 10,
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "rgba(146, 175, 247, 0.2)",
                      },
                    }}
                  >
                    <span>
                      <LinkIcon fontSize="small" />
                    </span>
                    Add a child issue
                  </Button>
                  <Button
                    type="button"
                    variant="text"
                    sx={{
                      fontSize: 10,
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "rgba(146, 175, 247, 0.2)",
                      },
                    }}
                  >
                    <span>
                      <LinkIcon fontSize="small" />
                    </span>
                    Link issue
                  </Button>
                  <span display="flex" alignItems="center">
                    <MoreHorizIcon />
                  </span> */}
                </Box>
              </Box>

              <Typography
                sx={{
                  fontSize: "16px",
                  mt: 2,
                  color: isEditMode ? "black" : "balck",
                  fontWeight: "bold",
                }}
              >
                Description
              </Typography>
              <TextField
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                variant="outlined"
                multiline
                defaultValue={ticket.description}
                // disabled={!isEditMode}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: isEditMode ? "none" : "none",
                    padding: 0,
                    width: "80%",
                  },
                  "& .MuiInputBase-root": {
                    fontSize: 14, // increase font size
                    pl: 0,
                    pt: 0.5,
                  },
                  "& .MuiInputBase-root:hover": {
                    // add this
                    backgroundColor: "#F0F1F4",
                  },
                  height: "auto",
                }}
                inputProps={{ style: { height: "auto" } }}
              />

              {/* Attachment section  */}
              <Typography
                sx={{ fontSize: 16, color: "black", fontWeight: "bold", pt: 1 }}
              >
                Attachments
              </Typography>
              <Box
                className="attachment-section"
                sx={{
                  mt: 1,
                  height: "220px",
                }}
              >
                <Box
                  className="image-container"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  sx={{
                    width: "25%",
                  }}
                >
                  <Box
                    className="attachment-section"
                    mt={1}
                    sx={{
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "8px",
                      height: "120px",
                      width: "140px",
                    }}
                  >
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Ticket Attachment"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                  </Box>
                  <DownloadIcon
                    sx={{ color: "green", cursor: "pointer" }}
                    onClick={() => {
                      const filename = imageUrl.split("/").pop(); // Extract filename from image URL
                      window.location.href = `/download/${filename}`; // Make GET request to download route
                    }}
                  />
                  {/* <Close
                    sx={{ color: "red", cursor: "pointer" }}
                    onClick={handleRemoveAttachment}
                  /> */}
                </Box>
                <Typography sx={{ fontSize: 10 }}>{ticket.image}</Typography>
              </Box>

              <Typography
                sx={{ fontSize: 16, color: "black", fontWeight: "bold" }}
              >
                Activity
              </Typography>

              <Box display="flex">
                <Typography
                  sx={{ fontSize: "14px", paddingTop: 0.5, paddingRight: 2 }}
                >
                  Show:
                </Typography>
                <Box display="flex" justifyContent="space-between" width="35%">
                  {/* <Button
                  type="button"
                  variant="text"
                  sx={{
                    fontSize: 10,
                    fontWeight: "bold",
                    backgroundColor: "rgba(146, 175, 247, 0.2)",
                    "&:hover": {
                      backgroundColor: "rgba(146, 175, 247, 0.3)",
                    },
                  }}
                >
                  <span>All</span>
                </Button> */}
                  <Button
                    type="button"
                    variant="text"
                    sx={{
                      fontSize: 10,
                      fontWeight: "bold",
                      backgroundColor: "rgba(146, 175, 247, 0.2)",
                      "&:hover": {
                        backgroundColor: "rgba(146, 175, 247, 0.3)",
                      },
                    }}
                  >
                    <span>Comments</span>
                  </Button>
                  {/* <Button
                  type="button"
                  variant="text"
                  sx={{
                    fontSize: 10,
                    fontWeight: "bold",
                    backgroundColor: "rgba(146, 175, 247, 0.2)",
                    "&:hover": {
                      backgroundColor: "rgba(146, 175, 247, 0.3)",
                    },
                  }}
                >
                  <span>Activity</span>
                </Button> */}
                </Box>
              </Box>

              <Box
                className="comment-section"
                mt={1}
                sx={{
                  background: "#fff",
                  borderRadius: "4px",
                  padding: "8px",
                  // maxHeight: "290px",
                  // overflowY: "auto",
                  width: "100%",
                }}
                ref={commentsRef}
              >
                {comments.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
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
                          width: 100,
                          height: 100,
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
                        justifyContent="start"
                        sx={{
                          width: "5%",
                        }}
                      >
                        <AccountCircleIcon
                          sx={{ color: "#543d7a" }}
                          fontSize="large"
                        />
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="column"
                        sx={{ marginLeft: 2 }}
                      >
                        <Box display="flex">
                          <Typography sx={{ fontSize: 14 }}>
                            {ticket.user.name.toUpperCase()}
                            {" ("}
                            {comment.role}
                            {")"}{" "}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 14,
                              color: "grey",
                              paddingLeft: "7px",
                            }}
                          >
                            {getCommentTime(comment.date)} ago
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: 14 }}>
                          {comment.text}
                        </Typography>
                        {/* <Box
                          display="flex"
                          width="40%"
                          justifyContent="space-between"
                        >
                          <Typography
                            sx={{
                              borderRadius: 2,
                              padding: "2px",
                              fontSize: 14,
                              "&:hover": {
                                textDecoration: "underline",
                                cursor: "pointer",
                              },
                            }}
                          >
                            Edit
                          </Typography>
                          <Typography>.</Typography>
                          <Typography
                            sx={{
                              borderRadius: 2,
                              padding: "2px",
                              fontSize: 14,
                              "&:hover": {
                                textDecoration: "underline",
                                cursor: "pointer",
                              },
                            }}
                          >
                            Delete
                          </Typography>
                        </Box> */}
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
              <Box display="flex" justifyContent="center" gap={5}>
                <TextField
                  id="reply"
                  placeholder="Add a comment"
                  multiline
                  rows={1}
                  value={reply}
                  onChange={handleReplyChange}
                  variant="outlined"
                  sx={{
                    width: "80%",
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      mt: 1,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReplySubmit}
                  disabled={loading}
                  sx={{
                    height: "49px",
                    marginTop: 0.5,
                    display: "flex",
                    alignItems: "center",
                    "& .MuiCircularProgress-root": {
                      marginLeft: 1,
                    },
                  }}
                >
                  Reply
                  {loading ? (
                    <CircularProgress size={20} sx={{ marginRight: 1 }} />
                  ) : null}
                </Button>
              </Box>

              {error && (
                <Typography color="error" sx={{ marginTop: "8px" }}>
                  {error}
                </Typography>
              )}

              {/* REPLY SECTION  */}

              {/* 60% box */}
            </Box>
          </Box>

          <Box
            height={780}
            width="2px"
            sx={{ backgroundColor: "rgba(179, 177, 177, 0.5)" }}
          ></Box>
          <Box width="40%">
            <Box display="flex" justifyContent="end">
              <Close onClick={handleCloseModal} sx={{ cursor: "pointer" }} />
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="end"
              gap={2}
              sx={{ paddingTop: 2 }}
            >
              {/* <Button
                variant="contained"
                color="primary"
                onClick={handleEditToggle}
                startIcon={<Edit />}
              >
                {isEditMode ? "Save" : "Edit"}
              </Button> */}
              {/* <Button
                sx={{ marginRight: 0, marginTop: 1 }}
                variant="contained"
                color="primary"
                onClick={handleViewClick}
              >
                View
              </Button> */}
            </Box>
            <Box className="parentBox40" sx={{ marginLeft: 4, marginRight: 4 }}>
              <Box display="flex" flexDirection="row" gap={4}>
                <Box paddingLeft="20px" display="flex" flexDirection="column">
                  <Typography
                    sx={{
                      paddingTop: 2,
                      color: isEditMode ? "black" : "black",
                      fontSize: 14,
                    }}
                  >
                    Status
                  </Typography>
                  <Select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    fullWidth={false}
                    defaultValue={ticket.status}
                    // disabled={!isEditMode}
                    sx={{
                      fontSize: "16px", // reduce font size
                      padding: "2px 4px", // reduce padding
                      height: "35px", // reduce height
                      width: "140px",

                      "& .MuiOutlinedInput-notchedOutline": {
                        border: isEditMode ? "1px solid" : "1px solid",
                        color: isEditMode ? "black" : "black",
                      },
                      "&:hover": {
                        background: "#DEE7FE",
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
                      color: isEditMode ? "black" : "black",
                      marginLeft: "15px",
                      fontSize: 14,
                    }}
                  >
                    Severity
                  </Typography>
                  <Select
                    value={editedSeverity}
                    onChange={(e) => setEditedSeverity(e.target.value)}
                    fullWidth={false}
                    defaultValue={ticket.severity}
                    // disabled={!isEditMode}
                    sx={{
                      marginLeft: "15px",
                      fontSize: "16px", // reduce font size
                      padding: "2px 4px", // reduce padding
                      height: "35px", // reduce height
                      width: "140px",

                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid",
                        color: isEditMode ? "black" : "black",
                        paddingRight: 10,
                      },
                      "&:hover": {
                        background: "#DEE7FE",
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
                      color: isEditMode ? "black" : "black",
                      fontSize: 14,
                    }}
                  >
                    Start Date
                  </Typography>
                  <BasicDateField
                    value={editedStartDate}
                    onChange={(e) => setEditedStartDate(e.target.value)}
                    name="startDate"
                    // disabled={!isEditMode}
                  />
                </Box>
                <Box display="flex" flexDirection="column">
                  <Typography
                    sx={{
                      paddingTop: 2,
                      color: isEditMode ? "black" : "black",
                      fontSize: 14,
                    }}
                  >
                    Due Date
                  </Typography>
                  <BasicDateField
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                    name="dueDate"
                    // disabled={!isEditMode}
                  />
                </Box>
              </Box>
              {dateError && (
                <Typography
                  color="error"
                  sx={{ marginLeft: 2.5, marginTop: "8px" }}
                >
                  {dateError}
                </Typography>
              )}
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                  marginLeft: 2.5,
                  width: "95%",
                  marginTop: 2,
                  border: "1px solid",
                  borderRadius: "4px",
                }}
              >
                <Typography sx={{ marginLeft: 2, paddingTop: 1.5 }}>
                  Details
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "rgba(165, 166, 168, 0.7)",
                    height: "2px",
                  }}
                >
                  {" "}
                </Box>
                <Box display="flex">
                  <Box>
                    <Typography
                      sx={{
                        paddingTop: 1,
                        paddingRight: 2,
                        paddingLeft: 2,
                        color: isEditMode ? "black" : "black",
                        fontSize: "14px",
                      }}
                    >
                      Assignee
                    </Typography>
                  </Box>
                  <Box>
                    <Select
                      value={assignedUser ? assignedUser : ""}
                      onChange={(e) => handleSelectChange(e, "user")}
                      sx={{
                        fontSize: "14px",
                        padding: "2px 2px",
                        height: "35px",
                        width: "160px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: isEditMode ? "1px solid" : "1px solid",
                          color: isEditMode ? "black" : "black",
                        },
                      }}
                    >
                      {users.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>
                <Box display="flex">
                  <Box>
                    <Typography
                      sx={{
                        paddingTop: 1,
                        paddingRight: 2,
                        paddingLeft: 2,
                        paddingBottom: 2,
                        color: isEditMode ? "black" : "black",
                        fontSize: "14px",
                      }}
                    >
                      Reporter
                    </Typography>
                  </Box>

                  <Box sx={{ paddingLeft: 0.4 }}>
                    <Select
                      value={assignedOperator ? assignedOperator : ""}
                      onChange={(e) => handleSelectChange(e, "operator")}
                      sx={{
                        fontSize: "14px",
                        padding: "2px 2px",
                        height: "35px",
                        width: "160px",

                        "& .MuiOutlinedInput-notchedOutline": {
                          border: isEditMode ? "1px solid" : "1px solid",
                          color: isEditMode ? "black" : "black",
                        },
                      }}
                    >
                      {operators.map((operator) => (
                        <MenuItem key={operator._id} value={operator._id}>
                          {operator.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography
                  sx={{ color: "#706e6e", pl: 2, pt: 2, fontSize: "14px" }}
                >
                  Created at{" "}
                  {new Date(ticket.startDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
                <Typography sx={{ color: "#706e6e", pl: 2, fontSize: "14px" }}>
                  {lastCommentDate ? (
                    <>
                      Updated at{" "}
                      {new Date(lastCommentDate).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </>
                  ) : (
                    "No comments yet!"
                  )}
                </Typography>
              </Box>
            </Box>

            {/* <Box sx={{ position: "absolute", bottom: 0, right: 0, padding: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleReplySubmit}
                disabled={loading}
              >
                Submit
                {loading && <CircularProgress size={20} />}
              </Button>
            </Box> */}

            {/* 40% box */}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
