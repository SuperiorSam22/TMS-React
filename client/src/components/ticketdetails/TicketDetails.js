/* eslint-disable react-hooks/rules-of-hooks */
// import React, { useEffect, useState } from "react";
// import qs from "qs";
// import { useLocation } from "react-router-dom";
// import { Box, Button, TextField, Typography } from "@mui/material";
// import dayjs from "dayjs";
// import axios from "axios";

// const TicketDetailsPage = () => {


//   const [comments, setComments] = React.useState([]);
//   const commentsRef = React.useRef(null);
//   const [dummyData, setDummyData] = React.useState([]);


//   const [reply, setReply] = React.useState("");

//   const queryString = window.location.search;
//   const ticketData = qs.parse(queryString);
//   const [data, setData] = useState({});

//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);

//   useEffect(() => {
//     const newData = {};
//     for (const [key, value] of searchParams.entries()) {
//       newData[key] = value;
//     }
//     setDummyData(localStorage.getItem("ticket"));
//     console.log("This is dummy Data", dummyData);
    
//     setData(newData);
//   }, []);

//   const ticketId = data.tId;


//   const handleReplyChange = (event) => {
//     setReply(event.target.value);
    
//   };

//   const handleReplySubmit = async () => {

//   }
  

//   //fetch all comments 
//   const getAllComments = async (id) => {
//     const authToken = sessionStorage.getItem("accessJWT");
//     try {
//       const config = {
//         method: 'get',
//         maxBodyLength: Infinity,
//         url: `http://localhost:8000/api/tickets/${id}/comments`,
//         headers: { 
//           Authorization: `Bearer ${authToken}`,
//         }
//       };
      
//       const response = await axios.request(config);
//       return response.data;
//     } catch (error) {
//       console.log(error);
//       return [];
//     }
//   };

//   React.useEffect(() => {
//     const fetchComments = async () => {
//       const comments = await getAllComments(ticketId);
//       console.log(comments)
//       setComments(comments);  
//     };
//     fetchComments(ticketId);
//   }, [ticketId]);

//   return (
//     <Box display="flex" height="100vh">
//         {/* <div>
//           <h1>{data.tId}</h1>
//           <h1>{data.ticketId}</h1>
//           <h1>{data.title}</h1>
//           <p>{data.description}</p>
//           <p>Severity: {data.severity}</p>
//           <p>Status: {data.status}</p>
          
//           <h2>Comments:</h2>
//         </div> */}
//         <Box display="flex" width="50%" height="100%">
//           Ticket Detail section 
//         </Box>


//         <Box display="flex" flexDirection="column" width="50%" height="100%">
//           <Typography
//           sx={{
//             fontSize: 24,
//             fontWeight: 'bold'
//           }}
//           >Comments</Typography>
//         <Box
//               className="comment-section"
//               mt={1}
//               sx={{
//                 // background: "#eaeaea",
//                 // border: "1px solid #ddd",
//                 borderRadius: "4px",
//                 padding: "8px",
//                 maxHeight: "80%",
//                 overflowY: "auto",
//                 width: "100%",
//               }}
//               ref={commentsRef}
//             >
//               {comments.length === 0 ? (
//                 <Box
//                   display="flex"
//                   justifyContent="space-evenly"
//                   sx={{
//                     // alignItems: "center",
//                     paddingTop: 2,
//                     paddingBottom: 2,
//                     height: "100%",
//                     width: "100%",
//                   }}
//                 >
//                   <img
//                     src={require("../../assets/img/chat.png")}
//                     alt="No comments"
//                     style={{
//                       width: 120,
//                       height: 120,
//                       opacity: 0.2,
//                     }}
//                   />
//                   <Typography
//                     display="flex"
//                     alignItems="center"
//                     fontSize="25px"
//                     fontWeight="bold"
//                     color="grey"
//                     sx={{ opacity: 0.5 }}
//                   >
//                     No comments yet!
//                   </Typography>
//                 </Box>
//               ) : (
//                 comments.map((comment, index) => (
//                   <Box
//                     key={index}
//                     className="comment-box"
//                     mb={1}
//                     display="flex"
//                     flexDirection="column"
//                     sx={{
//                       backgroundColor: "#fff",
//                       padding: "8px",
//                       borderRadius: "4px",
//                       border: "1px solid #ddd",
//                       marginBottom: "16px",
//                       width: "100%",
//                     }}
//                   >
//                     <Typography variant="body2" color="textPrimary">
//                       <strong>
//                         {comment.name} ({comment.role.toUpperCase()}):
//                       </strong>{" "}
//                       {comment.text}
//                     </Typography>
//                     <Typography
//                       variant="caption"
//                       color="textSecondary"
//                       sx={{ alignSelf: "flex-end" }}
//                     >
//                       {new Date(comment.date).toLocaleDateString("en-GB")}
//                     </Typography>
//                     <Typography
//                       variant="caption"
//                       color="textSecondary"
//                       sx={{ alignSelf: "flex-start" }}
//                     >
//                       {new Date(comment.date).toLocaleTimeString("en-GB")}
//                     </Typography>
//                     <hr
//                       style={{
//                         border: "none",
//                         height: "1px",
//                         backgroundColor: "#ddd",
//                         margin: "8px 0",
//                       }}
//                     />
//                   </Box>
//                 ))
//               )}
//             </Box>
//             <Box
//             className="reply-section"
//             sx={{
//               paddingBottom: "20px",
//               maxWidth: "735px",
//               display: "flex",
//               flexDirection: "column",
//               width: "100%",
//               position: "absolute",
//               bottom: 0,
//             }}
//           >
















//             <TextField
//               id="reply"
//               label="Reply"
//               multiline
//               rows={2}
//               value={reply}
//               onChange={handleReplyChange}
//               variant="outlined"
//               sx={{ width: "100%", background: "#eaeaea" }}
//             />
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 marginTop: "16px",
//               }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleReplySubmit}
               
//               >
//                 Submit
//               </Button>
              
//             </Box>
//           </Box>
//         </Box>


//     </Box>
//   );
// };

// export default TicketDetailsPage;

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
  padding: 4,
  bgcolor: "background.paper",
  display: "flex",
  // alignItems: "center",
};

export default function TicketDetailsPage(
  setComment) {
  const ticket = JSON.parse(sessionStorage.getItem('ticketDetails'));
  // console.log(ticket._id);

  const comments = ticket.comments;
  comments.forEach((comment, index) => {
    // console.log(comment);
  });

  if (!ticket) return <div>No ticket details available.</div>;


  const [comments1, setComments] = React.useState([]);

  const authToken = sessionStorage.getItem("accessJWT");
  const [reply, setReply] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const commentsRef = React.useRef(null);
  const [editedStartDate, setEditedStartDate] = React.useState(
    ticket.startDate ? dayjs(ticket.startDate) : dayjs() // Initialize with a valid date value
  );

  const [imageUrl, setImageUrl] = React.useState("");

  const [editedDueDate, setEditedDueDate] = React.useState(
    ticket.dueDate ? dayjs(ticket.dueDate) : dayjs() // Initialize with a valid date value
  );
  // State to manage edit mode
  const [isEditMode, setIsEditMode] = React.useState(false);


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
      console.log(ticket._id);
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
      try {
        const response = await axios.put(
          `http://localhost:8000/api/tickets/${ticket._id}/assign`,
          { assignedUser, assignedOperator },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      } catch (error) {
        toast.error("Error updating Assignie. Please try again.");
        console.error("Error assigning ticket:", error);
      }

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
        setComments(commentResponse.data.comments);
        setReply("");
        commentsRef.current.scrollTo({
          top: commentsRef.current.scrollHeight,
          behavior: "smooth",
        });
        toast.success("Ticket updated successfully!");
      }
    } catch (error) {
      toast.error("Error updating ticket. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  React.useEffect(() => {
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
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              variant="outlined"
              disabled={!isEditMode}
              defaultValue={ticket.title}
              size="small"
              sx={{
                width: 600,
                "& .MuiOutlinedInput-notchedOutline": {
                  border: isEditMode ? "none" : "none",
                },
                "& .MuiInputBase-input": {
                  fontSize: 22, // increase font size
                  fontWeight: "bold", // make text bold
                  pl: 0,
                },
              }}
            />

            <Typography sx={{ mt: 2, color: isEditMode ? "black" : "grey" }}>
              Description:
            </Typography>
            <TextField
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              variant="outlined"
              rows={3}
              fullWidth
              defaultValue={ticket.description}
              disabled={!isEditMode}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  border: isEditMode ? "none" : "none",
                  padding: 0,
                },
                "& .MuiInputBase-input": {
                  fontSize: 18, // increase font size
                  pl: 0,
                },
              }}
            />

            {/* Attachment section  */}
            <Typography sx={{ color: "grey", fontWeight: "bold", pt: 1 }}>
              Attachments
            </Typography>
            <Box
              className="attachment-section"
              sx={{
                mt: 1,

                height: "210px",
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
                }}
              >
                {ticket.image}
              </Box>
            </Box>

            <Box
              className="comment-section"
              mt={1}
              sx={{
                background: "#fff",

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
        </Box>                                          
    // <Box p={3}>
    //   <Typography variant="h4">{ticket.title}</Typography>
    //   <Typography variant="body1">{ticket.description}</Typography>
    //   <Chip
    //     label={ticket.severity.charAt(0).toUpperCase() + ticket.severity.slice(1)}
    //     sx={{ background: getPriorityColor(ticket.severity), mt: 2 }}
    //   />
    //   <Chip
    //     label={ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
    //     sx={{ background: getStatusColor(ticket.status), mt: 2 }}
    //   />
    //   <Typography variant="body2">
    //     Start Date: {new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(new Date(ticket.startDate))}
    //   </Typography>
    //   <Typography variant="body2">
    //     Due Date: {new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(new Date(ticket.dueDate))}
    //   </Typography>
    //   {/* Add more details and comments */}
    // </Box>
  );
}
