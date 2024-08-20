import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  // Jumbotron,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { shortText } from "../../utils/validation";

import {
  alpha,
  Divider,
  FormControl,
  InputBase,
  InputLabel,
  styled,
  Box,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";

const initialFrmDt = {
  // subject: "",
  // issueDate: "",
  // message: "",
  // severity: "Low", // Default value for severity
  severity: '',
  status:'',
  date:'',
};
const initialFrmError = {
  subject: false,
  issueDate: false,
  message: false,
};

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    fontSize: 14,
    width: "100%",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const EditTicketForm = ({ ticket, setTodoList }) => {
  const [updatedTicket, setUpdatedTicket] = useState(ticket);

  // const [image, setImage] = useState(null);
  const [frmData, setFrmData] = useState(initialFrmDt);
  const [frmDataErro, setFrmDataErro] = useState(initialFrmError);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUpdatedTicket({
      ...updatedTicket,
      [name]: value,
    });
  };

  const handleOnFileChange = (e) => {
    setFrmData({
      ...frmData,
      image: e.target.files[0],
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setUpdatedTicket({
      ...updatedTicket,
      date: new Date(),
    });

    setTodoList((todoList) =>
      todoList.map((list) =>
          list._id === updatedTicket._id ? { ...list, ...updatedTicket } : list
      )
  );
      const userID = "66a8b803d6d0770e4036263c";
    console.log(updatedTicket);

    //   const res = await axios.post("http://localhost:8000/api/tickets/66a8b803d6d0770e4036263c",frmData);
    // console.log(res.data);

    // setFrmDataErro(initialFrmError);

    // const isSubjectValid = await shortText(frmData.subject);

    // setFrmDataErro({
    //   ...initialFrmError,
    //   subject: !isSubjectValid,
    // });
    // dispatch(openNewTicket({ ...frmData, sender: name }));
  };

  return (
    // <Jumbotron className="mt-3 add-new-ticket bg-light">
    <>
      <form onSubmit={handleOnSubmit}>
        <Box className="add-ticket">
          <h3>{updatedTicket.title}</h3>
          <p>{updatedTicket.description}</p>
          <Divider />
          <Box className="input-fields" mt={2}>
            
            <Box mt={2} sx={{ display: "flex", gap: "20px" }}>
              <Box sx={{width:"100%"}}>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Severity
                </InputLabel>
                <TextField
                  id="outlined-select-currency"
                  select
                  fullWidth
                  defaultValue={updatedTicket.severity}
                  name="severity"
                  onChange={handleOnChange}
                >
                  <MenuItem key={"low"} value={"low"}>
                    Low
                  </MenuItem>
                  <MenuItem key={"medium"} value={"medium"}>
                    Medium
                  </MenuItem>
                  <MenuItem key={"high"} value={"high"}>
                    High
                  </MenuItem>
                </TextField>
              </Box>
              <Box sx={{width:"100%"}}>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Status
                </InputLabel>
                <TextField
                  id="outlined-select-currency"
                  select
                  fullWidth
                  defaultValue={updatedTicket.status}
                  name="status"
                  onChange={handleOnChange}
                >
                  <MenuItem key={"Open"} value={"open"}>
                    Open
                  </MenuItem>
                  <MenuItem key={"In Progress"} value={"in progress"}>
                  In Progress
                  </MenuItem>
                  <MenuItem key={"Closed"} value={"closed"}>
                    Closed
                  </MenuItem>
                </TextField>
              </Box>
            </Box>
            {/* <Box mt={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Date
                </InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    name="date"
                    onChange={handleOnChange}
                  />
                </LocalizationProvider>
              </Box> */}
            {/* <Box mt={2}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Image
              </InputLabel>
              <input
                type="file"
                id="image"
                className="form-control"
                onChange={handleOnFileChange}
              />
            </Box> */}
          </Box>
          <Box mt={2}>
            <Button type="submit" variant="outlined">
              Submit
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
};
