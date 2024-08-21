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
import { openNewTicket } from "./addTicketAction";
import { shortText } from "../../utils/validation";
import { restSuccessMSg } from "./addTicketSlicer";

import "./add-ticket-form.style.css";
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
  IconButton,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { Close, PhotoCamera } from "@mui/icons-material";
import { toast } from "react-toastify";

const initialFrmDt = {
  severity: "low",
  image: "", 
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

export const AddTicketForm = ({ setNewTicket, handleClose }) => {
  const dispatch = useDispatch();

  const {
    user: { name },
  } = useSelector((state) => state.user);

  const { isLoading, error, successMsg } = useSelector(
    (state) => state.openTicket
  );
  const [frmData, setFrmData] = useState(initialFrmDt);
  const [frmDataErro, setFrmDataErro] = useState(initialFrmError);
  const [isSpinning, setIsSpinning] = useState(false);

  //file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };


  useEffect(() => {
    return () => {
      successMsg && dispatch(restSuccessMSg());
    };
  }, [dispatch, frmData, frmDataErro]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFrmData({
      ...frmData,
      [name]: value,
    });
  };


  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsSpinning(true);
    const authToken = sessionStorage.getItem("accessJWT");
    const userId = JSON.parse(sessionStorage.getItem("user")).id;
  
    // Create a FormData object
    const formData = new FormData();
  
    // Append form data to the FormData object
    formData.append("title", frmData.title);
    formData.append("severity", frmData.severity);
    formData.append("description", frmData.description);
  
    // Append the selected file to the FormData object
    if (selectedFile) {
      formData.append("image", selectedFile); // 'image' is the key expected by your backend
    }
  
    try {
      const res = await axios.post(`http://localhost:8000/api/tickets/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        }
      });
      
      console.log(res.data);
      if (res.status === 200) {
        toast.success('Ticket added successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setNewTicket(true);
        handleClose();
      }
      dispatch(openNewTicket({ ...frmData, sender: name }));
    } catch (error) {
      toast.error('Error adding ticket!');
      console.error(error);
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    // <Jumbotron className="mt-3 add-new-ticket bg-light">
    <>
      <form onSubmit={handleOnSubmit}>
        <Box className="add-ticket">
          <Box display="flex" justifyContent="space-between">
            <h3> Add new ticket</h3>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>

          <Divider />

          <Box className="input-fields" mt={2}>
            <FormControl variant="standard" fullWidth>
              <InputLabel shrink htmlFor="bootstrap-input">
                Title
              </InputLabel>
              <BootstrapInput
                id="bootstrap-input"
                name="title"
                onChange={handleOnChange}
              />
            </FormControl>
            <Box mt={2} sx={{ display: "flex", gap: "20px" }}>
              <Box>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Severity
                </InputLabel>
                <TextField
                  id="outlined-select-currency"
                  select
                  size="small"
                  value={frmData.severity}
                  name="severity"
                  onChange={handleOnChange}
                  sx={{ width: "120px" }}
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
            </Box>
            <Box mt={2}>
              <FormControl variant="standard" fullWidth>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Description
                </InputLabel>
                <BootstrapInput
                  id="bootstrap-input"
                  name="description"
                  onChange={handleOnChange}
                  multiline
                  rows={5}
                />
              </FormControl>
            </Box>
          </Box>
          <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <InputLabel>Upload Image</InputLabel>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="image">
                <Button variant="contained" component="span">
                  Upload
                </Button>
                {fileName && <span style={{ marginLeft: 10 }}>{fileName}</span>}
              </label>
            </Box>
            <Button type="submit" variant="contained">
              Submit
              {isSpinning && (
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="ms-2"
                />
              )}
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
};