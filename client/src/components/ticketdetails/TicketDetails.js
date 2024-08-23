import React, { useEffect, useState } from "react";
import qs from "qs";
import { useLocation } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";

const TicketDetailsPage = () => {


  const [comments, setComments] = React.useState([]);
  const commentsRef = React.useRef(null);
  const [dummyData, setDummyData] = React.useState([]);


  const [reply, setReply] = React.useState("");

  const queryString = window.location.search;
  const ticketData = qs.parse(queryString);
  const [data, setData] = useState({});

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const newData = {};
    for (const [key, value] of searchParams.entries()) {
      newData[key] = value;
    }
    setDummyData(localStorage.getItem("ticket"));
    console.log("This is dummy Data", dummyData);
    
    setData(newData);
  }, []);

  const ticketId = data.tId;


  const handleReplyChange = (event) => {
    setReply(event.target.value);
    
  };

  const handleReplySubmit = async () => {

  }
  

  //fetch all comments 
  const getAllComments = async (id) => {
    const authToken = sessionStorage.getItem("accessJWT");
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/tickets/${id}/comments`,
        headers: { 
          Authorization: `Bearer ${authToken}`,
        }
      };
      
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  React.useEffect(() => {
    const fetchComments = async () => {
      const comments = await getAllComments(ticketId);
      console.log(comments)
      setComments(comments);  
    };
    fetchComments(ticketId);
  }, [ticketId]);

  return (
    <Box display="flex" height="100vh">
        {/* <div>
          <h1>{data.tId}</h1>
          <h1>{data.ticketId}</h1>
          <h1>{data.title}</h1>
          <p>{data.description}</p>
          <p>Severity: {data.severity}</p>
          <p>Status: {data.status}</p>
          
          <h2>Comments:</h2>
        </div> */}
        <Box display="flex" width="50%" height="100%">
          Ticket Detail section 
        </Box>


        <Box display="flex" flexDirection="column" width="50%" height="100%">
          <Typography
          sx={{
            fontSize: 24,
            fontWeight: 'bold'
          }}
          >Comments</Typography>
        <Box
              className="comment-section"
              mt={1}
              sx={{
                // background: "#eaeaea",
                // border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "8px",
                maxHeight: "80%",
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
               
              >
                Submit
              </Button>
              
            </Box>
          </Box>
        </Box>


    </Box>
  );
};

export default TicketDetailsPage;
