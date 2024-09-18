/* eslint-disable react-hooks/rules-of-hooks */

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
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LinkIcon from "@mui/icons-material/Link";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LabelIcon from "@mui/icons-material/Label";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  FormControl,
  Input,
  InputAdornment,
} from "@mui/material";

const style = {
  padding: 4,
  bgcolor: "background.paper",
  display: "flex",
  // alignItems: "center",
};

export default function ticketDetailsPage(setComment) {
  const [comments, setComments] = React.useState([]);
  const ticket = JSON.parse(sessionStorage.getItem("ticketDetails"));
  React.useEffect(() => {
    setComments(ticket?.comments);
    console.log(ticket?.comments);
    comments?.forEach((comment, index) => {
      // console.log(comment);
    });
  }, []);

  if (!ticket) return <div>No ticket? details available.</div>;

  // const [comments1, setComments] = React.useState([]);

  const authToken = sessionStorage.getItem("accessJWT");
  const [reply, setReply] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const commentsRef = React.useRef(null);
  const [editedStartDate, setEditedStartDate] = React.useState(
    ticket?.startDate ? dayjs(ticket?.startDate) : dayjs() // Initialize with a valid date value
  );

  const imgUrl = "file:///C:/Users/Sam/Desktop/TMS-React/backend/uploads/";
  const [imageUrl, setImageUrl] = React.useState("");

  const [editedDueDate, setEditedDueDate] = React.useState(
    ticket?.dueDate ? dayjs(ticket?.dueDate) : dayjs() // Initialize with a valid date value
  );
  // State to manage edit mode
  const [isEditMode, setIsEditMode] = React.useState(false);

  const [editedTitle, setEditedTitle] = React.useState(ticket?.title);
  const [editedDescription, setEditedDescription] = React.useState(
    ticket?.description
  );
  const [editedStatus, setEditedStatus] = React.useState(ticket?.status);
  const [editedSeverity, setEditedSeverity] = React.useState(ticket?.severity);

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
        const response = await axios.put(
          `http://localhost:8000/api/tickets/${ticket._id}/assign`,
          {
            assignedUser: assignedUser?._id,
            assignedOperator: assignedOperator?._id,
          },
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
          // setCommennt(commentResponse.data.comments);
          setReply("");
          commentsRef.current.scrollTo({
            top: commentsRef.current.scrollHeight,
            behavior: "smooth",
          });
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

  React.useEffect(() => {
    if (ticket.image) {
      setImageUrl(`http://localhost:8000/uploads/${ticket.image}`);
    }
  }, [ticket.image]);

  React.useEffect(() => {
    const storedAssignedUser = localStorage.getItem("assignedUser");
    const storedAssignedOperator = localStorage.getItem("assignedOperator");
    if (storedAssignedUser) {
      setAssignedUser(storedAssignedUser);
    }

    if (storedAssignedOperator) {
      setAssignedOperator(storedAssignedOperator);
    }
    // Fetch users and operators from the backend
    const fetchUsersAndOperators = async () => {
      try {
        const usersResponse = await axios.get(
          "http://localhost:8000/api/users/getOperators"
        );
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
    <Box sx={style}>
      <Box display="flex" flexDirection="column" width="59%">
        <Box display="flex" justifyContent="space-between">
          <Box width="70%">
            <Typography
              variant="h6"
              color="textSecondary"
              fontFamily="serif"
              sx={{ fontSize: 18, paddingTop: 2 }}
            >
              Ticket Id: {ticket?.ticketId}
            </Typography>
          </Box>
        </Box>
        <TextField
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          variant="outlined"
          // disabled={!isEditMode}
          defaultValue={ticket?.title}
          size="small"
          sx={{
            width: 600,
            "& .MuiOutlinedInput-notchedOutline": {
              // border: isEditMode ? "none" : "none",
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
          Description:
        </Typography>
        <Box>
          <TextField
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            variant="outlined"
            multiline
            rows={2}
            fullWidth
            defaultValue={ticket?.description}
            // disabled={!isEditMode}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: isEditMode ? "none" : "none",
                padding: 0,
              },
              "& .MuiInputBase-root": {
                fontSize: 14,
                pl: 0,
                pt: 0.5,
              },
              "& .MuiInputBase-root:hover": {
                backgroundColor: "#F0F1F4",
              },
            }}
          />
        </Box>

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
            height: "180px",
          }}
        >
          <Box
            className="image-container"
            display="flex"
            flexDirection="column"
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
            <Typography sx={{ fontSize: 10 }}>{ticket.image}</Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: 16, color: "black", fontWeight: "bold" }}>
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
          className="comment-container"
          mt={1}
          sx={{
            background: "#fff",

            borderRadius: "4px",
            padding: "8px",
            height: "320px",
            overflowY: "clip",
            width: "100%",
          }}
        >
          <Box
            className="comment-section"
            mt={1}
            sx={{
              background: "#fff",

              borderRadius: "4px",
              padding: "8px",
              maxHeight: "300px",
              overflowY: "auto",
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
                        {comment.role.toUpperCase()}{" "}
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
                    <Box
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
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>

        <TextField
          id="reply"
          placeholder="Add a comment"
          multiline
          rows={1}
          value={reply}
          onChange={handleReplyChange}
          variant="outlined"
          sx={{
            width: "100%",
            bottom: 5,
            mt: 1,
            "& .MuiOutlinedInput-root": {
              height: "45px",
              
            },
          }}
        />
        {error && (
          <Typography
            color="error"
            sx={{ position: "fixed", marginTop: "8px", bottom: 0 }}
          >
            {error}
          </Typography>
        )}

        {/* REPLY SECTION  */}
   
        {/* 60% box */}
      </Box>
      <Box height={800} width="2px" sx={{backgroundColor: "rgba(179, 177, 177, 0.7)"}} >
      </Box>

      
      <Box width="40%">
        {/* <Box
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
        </Box> */}
        <Box className="parentBox" sx={{ marginLeft: "80px" }}>
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
                defaultValue={ticket?.status}
                // disabled={!isEditMode}
                sx={{
                  fontSize: "14px", // reduce font size
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
                defaultValue={ticket?.severity}
                // disabled={!isEditMode}
                sx={{
                  marginLeft: "15px",
                  fontSize: "14px", // reduce font size
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
          <Box
            sx={{ paddingTop: 2, marginLeft: 2.5, width: "72%", marginTop: 1 }}
          >
            <Accordion fullWidth>
              <AccordionSummary
                sx={{ border: "1px solid", borderRadius: 1 }}
                expandIcon={<ArrowDropDownCircleOutlined />}
                id="panel1-header"
              >
                <Typography>Details</Typography>
              </AccordionSummary>
              <Box
                sx={{
                  borderTop: "1px solid #ddd",
                  margin: "0 16px",
                }}
              />
              <AccordionDetails sx={{ border: "1px solid", borderTop: "none" }}>
                <Box display="flex" flexDirection="column">
                  <Box
                    display="flex"
                    flexDirection="row"
                    sx={{ paddingBottom: 2, paddingTop: 2 }}
                    justifyContent="space-between"
                    width="65%"
                  >
                    <Box>
                      <Typography
                        sx={{
                          paddingTop: 1,
                          paddingRight: 2,
                          color: isEditMode ? "black" : "black",
                          fontSize: "14px",
                        }}
                      >
                        Assignee
                      </Typography>
                    </Box>
                    <Box sx={{ paddingLeft: 0.4 }}>
                      <Select
                        value={assignedUser}
                        onChange={(e) => setAssignedUser(e.target.value)}
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
                  <Box
                    display="flex"
                    flexDirection="row"
                    sx={{ paddingBottom: 2 }}
                    justifyContent="space-between"
                    width="65%"
                  >
                    <Box>
                      <Typography
                        sx={{
                          paddingTop: 1,
                          paddingRight: 2.2,
                          color: isEditMode ? "black" : "black",
                          fontSize: "14px",
                        }}
                      >
                        Reporter
                      </Typography>
                    </Box>
                    <Box sx={{ paddingLeft: 0.4 }}>
                      <Select
                        value={assignedOperator}
                        onChange={(e) => setAssignedOperator(e.target.value)}
                        sx={{
                          fontSize: "14px",
                          padding: "2px 2px",
                          height: "35px",
                          width: "162px",
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
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    flexDirection="row"
                    width="100%"
                  >
                    <Box sx={{}}>
                      <Typography sx={{ fontSize: "14px" }}>Labels</Typography>
                    </Box>
                    <Box sx={{ marginRight: "70px", width: "150px" }}>
                      <FormControl variant="standard">
                        <Input
                          id="input-with-icon-adornment"
                          startAdornment={
                            <InputAdornment position="start">
                              <LabelIcon
                                fontSize="small"
                                sx={{ color: "#3887D9" }}
                              />
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box>
            <Typography
              sx={{ color: "#706e6e", pl: 2, pt: 2, fontSize: "14px" }}
            >
              Created at{" "}
              {new Date(ticket?.startDate).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Typography>
            <Typography sx={{ color: "#706e6e", pl: 2, fontSize: "14px" }}>
              Updated at{" "}
              {/* {new Date(updatedAt).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            })} */}
            </Typography>
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
        </Box>

        {/* 40% box */}
      </Box>
    </Box>
  );
}
