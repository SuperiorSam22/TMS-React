  import React, { useState, useEffect } from "react";
  import PropTypes from "prop-types";
  import { Spinner, Alert } from "react-bootstrap";
  import { useDispatch, useSelector } from "react-redux";
  import { useLocation, useNavigate } from "react-router-dom";

  import { loginPending, loginSuccess, loginFail } from "./loginSlice";
  import { userLogin } from "../../api/userApi";
  import { getUserProfile } from "../../pages/dashboard/userAction";
  import {
    alpha,
    Button,
    Box,
    Divider,
    FormControl,
    InputBase,
    InputLabel,
    styled,
    Typography,
  } from "@mui/material";

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

  export const LoginForm = ({ formSwitcher }) => {
    const dispatch = useDispatch();
    const history = useNavigate();
    let location = useLocation();
    const navigate = useNavigate();

    const { isLoading, isAuth, error } = useSelector((state) => state.login);
    let { from } = location.state || { from: { pathname: "/" } };

    useEffect(() => {
      sessionStorage.getItem("accessJWT") && history(from);
    }, [history, isAuth]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleOnChange = (e) => {
      const { name, value } = e.target;

      switch (name) {
        case "email":
          setEmail(value);
          break;

        case "password":
          setPassword(value);
          break;

        default:
          break;
      }
    };

    const handleOnSubmit = async (e) => {
      e.preventDefault();

      if (!email || !password) {
        return alert("Fill up all the form!");
      }

      dispatch(loginPending());
      

      try {
        const isAuth = await userLogin({ email, password });

        if (isAuth.status === "error") {
          return dispatch(loginFail(isAuth.message));
        }

        dispatch(loginSuccess());
        dispatch(getUserProfile());
        history("/dashboard");
      } catch (error) {
        dispatch(loginFail(error.message));
      }
    };

    const signIn = () => {
      navigate("/registration");
    };

    return (
      <>
        <Box className="auth-box">
          <h2>Welcome Back !</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <form onSubmit={handleOnSubmit}>
            <Box className="input-fields" mt={5}>
              <FormControl variant="standard">
                <InputLabel shrink htmlFor="bootstrap-input">
                  Email
                </InputLabel>
                <BootstrapInput
                  id="bootstrap-input"
                  name="email"
                  onChange={handleOnChange}
                />
              </FormControl>
              <FormControl variant="standard">
                <InputLabel shrink htmlFor="bootstrap-input">
                  Password
                </InputLabel>
                <BootstrapInput
                  id="bootstrap-input"
                  name="password"
                  type="password"
                  onChange={handleOnChange}
                />
              </FormControl>
              <Button
                variant="outlined"
                type="submit"
                size="small"
                className="login-btn"
              >
                {isLoading ? (
                  <Spinner variant="primary" animation="border" />
                ) : (
                  "Sign In"
                )}
              </Button>
              <Divider>or</Divider>
              <Typography
                style={{ cursor: "pointer", color:"#1976d2" }}
                onClick={() => navigate("/password-reset")}
              >
                Forget Password
              </Typography>
              <Typography>
                Don't Have an account? <span onClick={signIn}>Sign Up</span>
              </Typography>
            </Box>
          </form>
        </Box>
      </>
    );
  };

  LoginForm.propTypes = {
    formSwitcher: PropTypes.func.isRequired,
  };
