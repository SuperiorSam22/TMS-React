// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Spinner,
//   Alert,
// } from "react-bootstrap";
// import { newUserRegistration } from "./userRegAction";
// import { useDispatch, useSelector } from "react-redux";

// const initialState = {
//   name: "Prem Acharya",
//   phone: "0410000000",
//   email: "fakeemail@email.com",
//   company: "Dented Code",
//   address: "George st Sydney",
//   password: "sfsd#3Dsg",
//   confirmPass: "sfsd#3Dsg",
// };
// const passVerificationError = {
//   isLenthy: false,
//   hasUpper: false,
//   hasLower: false,
//   hasNumber: false,
//   hasSpclChr: false,
//   confirmPass: false,
// };

// const RegistrationForm = () => {
//   const dispatch = useDispatch();
//   const [newUser, setNewUser] = useState(initialState);
//   const [passwordError, setPasswordError] = useState(passVerificationError);

//   const { isLoading, status, message } = useSelector(
//     (state) => state.registration
//   );

//   useEffect(() => {}, [newUser]);

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;

//     setNewUser({ ...newUser, [name]: value });

//     if (name === "password") {
//       const isLenthy = value.length > 8;
//       const hasUpper = /[A-Z]/.test(value);
//       const hasLower = /[a-z]/.test(value);
//       const hasNumber = /[0-9]/.test(value);
//       const hasSpclChr = /[@,#,$,%,&]/.test(value);

//       setPasswordError({
//         ...passwordError,
//         isLenthy,
//         hasUpper,
//         hasLower,
//         hasNumber,
//         hasSpclChr,
//       });
//     }

//     if (name === "confirmPass") {
//       setPasswordError({
//         ...passwordError,
//         confirmPass: newUser.password === value,
//       });
//     }
//   };

//   const handleOnSubmit = (e) => {
//     e.preventDefault();
//     // console.log(newUser);
//     const { name, phone, email, company, address, password } = newUser;

//     const newRegistration = {
//       name,
//       phone,
//       email,
//       company,
//       address,
//       password,
//     };
//     dispatch(newUserRegistration(newRegistration));
//   };

//   return (
//     <Container>
//       <Row>
//         <Col>
//           <h1 className="text-info">User Registration</h1>
//         </Col>
//       </Row>
//       <hr />
//       <Row>
//         <Col>
//           {message && (
//             <Alert variant={status === "success" ? "success" : "danger"}>
//               {message}
//             </Alert>
//           )}
//         </Col>
//       </Row>

//       <Row>
//         <Col>
//           <Form onSubmit={handleOnSubmit}>
//             <Form.Group>
//               <Form.Label>Full Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="name"
//                 value={newUser.name}
//                 onChange={handleOnChange}
//                 placeholder="Your name"
//                 required
//               />
//             </Form.Group>

//             <Form.Group>
//               <Form.Label>Phone</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="phone"
//                 value={newUser.phone}
//                 onChange={handleOnChange}
//                 placeholder="Phone"
//                 required
//               />
//             </Form.Group>

//             <Form.Group>
//               <Form.Label>Email address</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={newUser.email}
//                 onChange={handleOnChange}
//                 placeholder="Enter email"
//                 required
//               />
//             </Form.Group>

//             <Form.Group>
//               <Form.Label>Company name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="company"
//                 value={newUser.company}
//                 onChange={handleOnChange}
//                 placeholder="Company name"
//                 required
//               />
//             </Form.Group>

//             <Form.Group>
//               <Form.Label>Address</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="address"
//                 value={newUser.address}
//                 onChange={handleOnChange}
//                 placeholder="Full address"
//                 required
//               />
//             </Form.Group>

//             <Form.Group>
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="password"
//                 value={newUser.password}
//                 onChange={handleOnChange}
//                 placeholder="Password"
//                 required
//               />
//             </Form.Group>

//             <Form.Group>
//               <Form.Label>Confirm Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="confirmPass"
//                 value={newUser.confirmPass}
//                 onChange={handleOnChange}
//                 placeholder="Confirm Password"
//                 required
//               />
//             </Form.Group>
//             <Form.Text>
//               {!passwordError.confirmPass && (
//                 <div className="text-danger mb-3">Password doesn't match!</div>
//               )}
//             </Form.Text>

//             <ul className="mb-4">
//               <li
//                 className={
//                   passwordError.isLenthy ? "text-success" : "text-danger"
//                 }
//               >
//                 Min 8 characters
//               </li>
//               <li
//                 className={
//                   passwordError.hasUpper ? "text-success" : "text-danger"
//                 }
//               >
//                 At least one upper case
//               </li>
//               <li
//                 className={
//                   passwordError.hasLower ? "text-success" : "text-danger"
//                 }
//               >
//                 At least one lower case
//               </li>
//               <li
//                 className={
//                   passwordError.hasNumber ? "text-success" : "text-danger"
//                 }
//               >
//                 At least one number
//               </li>
//               <li
//                 className={
//                   passwordError.hasSpclChr ? "text-success" : "text-danger"
//                 }
//               >
//                 At least on of the special characters i.e @ # $ % &{" "}
//               </li>
//             </ul>

//             <Button
//               variant="primary"
//               type="submit"
//               disabled={Object.values(passwordError).includes(false)}
//             >
//               Submit
//             </Button>
//             {isLoading && <Spinner variant="info" animation="border" />}
//           </Form>
//         </Col>
//       </Row>
//       <Row className="py-4">
//         <Col>
//           Already have an account <a href="/">Login Now</a>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default RegistrationForm;






// // import React, { useState, useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { Alert, Box, Button, Divider, FormControl, InputLabel, styled, Typography } from "@mui/material";
// // import { newUserRegistration } from "./userRegAction";
// // import { alpha, InputBase } from "@mui/material";
// // import { Spinner } from "react-bootstrap";
// // import { Navigate } from "react-router-dom";

// // const BootstrapInput = styled(InputBase)(({ theme }) => ({
// //   "label + &": {
// //     marginTop: theme.spacing(3),
// //   },
// //   "& .MuiInputBase-input": {
// //     borderRadius: 4,
// //     position: "relative",
// //     backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
// //     border: "1px solid",
// //     borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
// //     fontSize: 14,
// //     width: "100%",
// //     padding: "10px 12px",
// //     transition: theme.transitions.create([
// //       "border-color",
// //       "background-color",
// //       "box-shadow",
// //     ]),
// //     fontFamily: [
// //       "-apple-system",
// //       "BlinkMacSystemFont",
// //       '"Segoe UI"',
// //       "Roboto",
// //       '"Helvetica Neue"',
// //       "Arial",
// //       "sans-serif",
// //       '"Apple Color Emoji"',
// //       '"Segoe UI Emoji"',
// //       '"Segoe UI Symbol"',
// //     ].join(","),
// //     "&:focus": {
// //       boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
// //       borderColor: theme.palette.primary.main,
// //     },
// //   },
// // }));

// // const initialState = {
// //   name: "",
// //   phone: "",
// //   email: "",
// //   company: "",
// //   address: "",
// //   password: "",
// //   confirmPass: "",
// // };

// // const passVerificationError = {
// //   isLenthy: false,
// //   hasUpper: false,
// //   hasLower: false,
// //   hasNumber: false,
// //   hasSpclChr: false,
// //   confirmPass: false,
// // };

// // const RegistrationForm = () => {
// //   const dispatch = useDispatch();
// //   const [newUser, setNewUser] = useState(initialState);
// //   const [passwordError, setPasswordError] = useState(passVerificationError);

// //   const { isLoading, status, message } = useSelector(
// //     (state) => state.registration
// //   );

// //   useEffect(() => {}, [newUser]);

// //   const handleOnChange = (e) => {
// //     const { name, value } = e.target;

// //     setNewUser({ ...newUser, [name]: value });

// //     if (name === "password") {
// //       const isLenthy = value.length > 8;
// //       const hasUpper = /[A-Z]/.test(value);
// //       const hasLower = /[a-z]/.test(value);
// //       const hasNumber = /[0-9]/.test(value);
// //       const hasSpclChr = /[@,#,$,%,&]/.test(value);

// //       setPasswordError({
// //         ...passwordError,
// //         isLenthy,
// //         hasUpper,
// //         hasLower,
// //         hasNumber,
// //         hasSpclChr,
// //       });
// //     }

// //     if (name === "confirmPass") {
// //       setPasswordError({
// //         ...passwordError,
// //         confirmPass: newUser.password === value,
// //       });
// //     }
// //   };

// //   const handleOnSubmit = (e) => {
// //     e.preventDefault();
// //     const { name, phone, email, company, address, password } = newUser;

// //     const newRegistration = {
// //       name,
// //       phone,
// //       email,
// //       company,
// //       address,
// //       password,
// //     };
// //     dispatch(newUserRegistration(newRegistration));
// //   };

// //   return (
// //     <>
// //       <Box className="auth-box">
// //         <h2>Create an Account</h2>
// //         {message && (
// //           <Alert variant={status === "success" ? "success" : "danger"}>
// //             {message}
// //           </Alert>
// //         )}
// //         <form onSubmit={handleOnSubmit}>
// //           <Box className="input-fields" mt={5}>
// //             <FormControl variant="standard">
// //               <InputLabel shrink htmlFor="bootstrap-input">
// //                 Full Name
// //               </InputLabel>
// //               <BootstrapInput
// //                 id="bootstrap-input"
// //                 name="name"
// //                 value={newUser.name}
// //                 onChange={handleOnChange}
// //                 placeholder="Your name"
// //                 required
// //               />
// //             </FormControl>
// //             <FormControl variant="standard">
// //               <InputLabel shrink htmlFor="bootstrap-input">
// //                 Phone
// //               </InputLabel>
// //               <BootstrapInput
// //                 id="bootstrap-input"
// //                 name="phone"
// //                 value={newUser.phone}
// //                 onChange={handleOnChange}
// //                 placeholder="Phone"
// //                 required
// //               />
// //             </FormControl>
// //             <FormControl variant="standard">
// //               <InputLabel shrink htmlFor="bootstrap-input">
// //                 Email
// //               </InputLabel>
// //               <BootstrapInput
// //                 id="bootstrap-input"
// //                 name="email"
// //                 value={newUser.email}
// //                 onChange={handleOnChange}
// //                 placeholder="Enter email"
// //                 required
// //               />
// //             </FormControl>
// //             <FormControl variant="standard">
// //               <InputLabel shrink htmlFor="bootstrap-input">
// //                 Company
// //               </InputLabel>
// //               <BootstrapInput
// //                 id="bootstrap-input"
// //                 name="company"
// //                 value={newUser.company}
// //                 onChange={handleOnChange}
// //                 placeholder="Company name"
// //                 required
// //               />
// //             </FormControl>
// //             <FormControl variant="standard">
// //               <InputLabel shrink htmlFor="bootstrap-input">
// //                 Address
// //               </InputLabel>
// //               <BootstrapInput
// //                 id="bootstrap-input"
// //                 name="address"
// //                 value={newUser.address}
// //                 onChange={handleOnChange}
// //                 placeholder="Full address"
// //                 required
// //               />
// //             </FormControl>
// //             <FormControl variant="standard">
// //               <InputLabel shrink htmlFor="bootstrap-input">
// //                 Password
// //               </InputLabel>
// //               <BootstrapInput
// //                 id="bootstrap-input"
// //                 name="password"
// //                 type="password"
// //                 value={newUser.password}
// //                 onChange={handleOnChange}
// //                 placeholder="Password"
// //                 required
// //               />
// //             </FormControl>
// //             <FormControl variant="standard">
// //               <InputLabel shrink htmlFor="bootstrap-input">
// //                 Confirm Password
// //               </InputLabel>
// //               <BootstrapInput
// //                 id="bootstrap-input"
// //                 name="confirmPass"
// //                 type="password"
// //                 value={newUser.confirmPass}
// //                 onChange={handleOnChange}
// //                 placeholder="Confirm Password"
// //                 required
// //               />
// //             </FormControl>

// //             {!passwordError.confirmPass && (
// //               <Typography color="error" className="mb-3">
// //                 Password doesn't match!
// //               </Typography>
// //             )}

// //             <ul className="mb-4">
// //               <li
// //                 className={
// //                   passwordError.isLenthy ? "text-success" : "text-danger"
// //                 }
// //               >
// //                 Min 8 characters
// //               </li>
// //               <li
// //                 className={
// //                   passwordError.hasUpper ? "text-success" : "text-danger"
// //                 }
// //               >
// //                 At least one uppercase
// //               </li>
// //               <li
// //                 className={
// //                   passwordError.hasLower ? "text-success" : "text-danger"
// //                 }
// //               >
// //                 At least one lowercase
// //               </li>
// //               <li
// //                 className={
// //                   passwordError.hasNumber ? "text-success" : "text-danger"
// //                 }
// //               >
// //                 At least one number
// //               </li>
// //               <li
// //                 className={
// //                   passwordError.hasSpclChr ? "text-success" : "text-danger"
// //                 }
// //               >
// //                 At least one special character (@, #, $, %, &)
// //               </li>
// //             </ul>

// //             <Button
// //               variant="outlined"
// //               type="submit"
// //               size="small"
// //               className="register-btn"
// //               disabled={Object.values(passwordError).includes(false)}
// //             >
// //               {isLoading ? (
// //                 <Spinner variant="primary" animation="border" />
// //               ) : (
// //                 "Register"
// //               )}
// //             </Button>
// //             <Divider>or</Divider>
// //             <Typography
// //               style={{ cursor: "pointer", color: "#1976d2" }}
// //               onClick={() => Navigate("/login")}
// //             >
// //               Already have an account? Login Now
// //             </Typography>
// //           </Box>
// //         </form>
// //       </Box>
// //     </>
// //   );
// // };

// // export default RegistrationForm;




// // import React, { useState, useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { Alert, Box, Button, Divider, FormControl, InputLabel, styled, Typography } from "@mui/material";
// // import { newUserRegistration } from "./userRegAction";
// // import { alpha, InputBase } from "@mui/material";
// // import { Spinner } from "react-bootstrap";
// // import { Navigate } from "react-router-dom";

// // const BootstrapInput = styled(InputBase)(({ theme }) => ({
// //   "label + &": {
// //     marginTop: theme.spacing(3),
// //   },
// //   "& .MuiInputBase-input": {
// //     borderRadius: 4,
// //     position: "relative",
// //     backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
// //     border: "1px solid",
// //     borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
// //     fontSize: 14,
// //     width: "100%",
// //     padding: "10px 12px",
// //     transition: theme.transitions.create([
// //       "border-color",
// //       "background-color",
// //       "box-shadow",
// //     ]),
// //     fontFamily: [
// //       "-apple-system",
// //       "BlinkMacSystemFont",
// //       '"Segoe UI"',
// //       "Roboto",
// //       '"Helvetica Neue"',
// //       "Arial",
// //       "sans-serif",
// //       '"Apple Color Emoji"',
// //       '"Segoe UI Emoji"',
// //       '"Segoe UI Symbol"',
// //     ].join(","),
// //     "&:focus": {
// //       boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
// //       borderColor: theme.palette.primary.main,
// //     },
// //   },
// // }));

// // const initialState = {
// //   name: "",
// //   phone: "",
// //   email: "",
// //   company: "",
// //   address: "",
// //   password: "",
// //   confirmPass: "",
// // };

// // const passVerificationError = {
// //   isLenthy: false,
// //   hasUpper: false,
// //   hasLower: false,
// //   hasNumber: false,
// //   hasSpclChr: false,
// //   confirmPass: false,
// // };

// // const RegistrationForm = () => {
// //   const dispatch = useDispatch();
// //   const [newUser, setNewUser] = useState(initialState);
// //   const [passwordError, setPasswordError] = useState(passVerificationError);

// //   const { isLoading, status, message } = useSelector(
// //     (state) => state.registration
// //   );

// //   useEffect(() => {}, [newUser]);

// //   const handleOnChange = (e) => {
// //     const { name, value } = e.target;

// //     setNewUser({ ...newUser, [name]: value });

// //     if (name === "password") {
// //       const isLenthy = value.length > 8;
// //       const hasUpper = /[A-Z]/.test(value);
// //       const hasLower = /[a-z]/.test(value);
// //       const hasNumber = /[0-9]/.test(value);
// //       const hasSpclChr = /[@,#,$,%,&]/.test(value);

// //       setPasswordError({
// //         ...passwordError,
// //         isLenthy,
// //         hasUpper,
// //         hasLower,
// //         hasNumber,
// //         hasSpclChr,
// //       });
// //     }

// //     if (name === "confirmPass") {
// //       setPasswordError({
// //         ...passwordError,
// //         confirmPass: newUser.password === value,
// //       });
// //     }
// //   };

// //   const handleOnSubmit = (e) => {
// //     e.preventDefault();
// //     const { name, phone, email, company, address, password } = newUser;

// //     const newRegistration = {
// //       name,
// //       phone,
// //       email,
// //       company,
// //       address,
// //       password,
// //     };
// //     dispatch(newUserRegistration(newRegistration));
// //   };

// //   return (
// //     <Box className="auth-box" sx={{ padding: 5, backgroundColor: "#F3F6F9", borderRadius: 2 }}>
// //       <Typography variant="h4" sx={{ marginBottom: 2 }}>
// //         Create an Account
// //       </Typography>
// //       {message && (
// //         <Alert variant={status === "success" ? "success" : "danger"}>
// //           {message}
// //         </Alert>
// //       )}
// //       <form onSubmit={handleOnSubmit}>
// //         <Box className="input-fields" mt={5}>
// //           <FormControl variant="standard" sx={{ marginBottom: 2 }}>
// //             <InputLabel shrink htmlFor="bootstrap-input">
// //               Full Name
// //             </InputLabel>
// //             <BootstrapInput
// //               id="bootstrap-input"
// //               name="name"
// //               value={newUser.name}
// //               onChange={handleOnChange}
// //               placeholder="Your name"
// //               required
// //             />
// //           </FormControl>
// //           <FormControl variant="standard" sx={{ marginBottom: 2 }}>
// //             <InputLabel shrink htmlFor="bootstrap-input">
// //               Phone
// //             </InputLabel>
// //             <BootstrapInput
// //               id="bootstrap-input"
// //               name="phone"
// //               value={newUser.phone}
// //               onChange


// // placeholder="Phone"
// //               required
// //             />
// //           </FormControl>
// //           <FormControl variant="standard">
// //             <InputLabel shrink htmlFor="bootstrap-input">
// //               Email
// //             </InputLabel>
// //             <BootstrapInput
// //               id="bootstrap-input"
// //               name="email"
// //               value={newUser.email}
// //               onChange={handleOnChange}
// //               placeholder="Enter email"
// //               required
// //             />
// //           </FormControl>
// //           <FormControl variant="standard">
// //             <InputLabel shrink htmlFor="bootstrap-input">
// //               Company
// //             </InputLabel>
// //             <BootstrapInput
// //               id="bootstrap-input"
// //               name="company"
// //               value={newUser.company}
// //               onChange={handleOnChange}
// //               placeholder="Company name"
// //               required
// //             />
// //           </FormControl>
// //           <FormControl variant="standard">
// //             <InputLabel shrink htmlFor="bootstrap-input">
// //               Address
// //             </InputLabel>
// //             <BootstrapInput
// //               id="bootstrap-input"
// //               name="address"
// //               value={newUser.address}
// //               onChange={handleOnChange}
// //               placeholder="Full address"
// //               required
// //             />
// //           </FormControl>
// //           <FormControl variant="standard">
// //             <InputLabel shrink htmlFor="bootstrap-input">
// //               Password
// //             </InputLabel>
// //             <BootstrapInput
// //               id="bootstrap-input"
// //               name="password"
// //               type="password"
// //               value={newUser.password}
// //               onChange={handleOnChange}
// //               placeholder="Password"
// //               required
// //             />
// //           </FormControl>
// //           <FormControl variant="standard">
// //             <InputLabel shrink htmlFor="bootstrap-input">
// //               Confirm Password
// //             </InputLabel>
// //             <BootstrapInput
// //               id="bootstrap-input"
// //               name="confirmPass"
// //               type="password"
// //               value={newUser.confirmPass}
// //               onChange={handleOnChange}
// //               placeholder="Confirm Password"
// //               required
// //             />
// //           </FormControl>

// //           {!passwordError.confirmPass && (
// //             <Typography color="error" className="mb-3">
// //               Password doesn't match!
// //             </Typography>
// //           )}

// //           <ul className="mb-4">
// //             <li
// //               className={
// //                 passwordError.isLenthy ? "text-success" : "text-danger"
// //               }
// //             >
// //               Min 8 characters
// //             </li>
// //             <li
// //               className={
// //                 passwordError.hasUpper ? "text-success" : "text-danger"
// //               }
// //             >
// //               At least one uppercase
// //             </li>
// //             <li
// //               className={
// //                 passwordError.hasLower ? "text-success" : "text-danger"
// //               }
// //             >
// //               At least one lowercase
// //             </li>
// //             <li
// //               className={
// //                 passwordError.hasNumber ? "text-success" : "text-danger"
// //               }
// //             >
// //               At least one number
// //             </li>
// //             <li
// //               className={
// //                 passwordError.hasSpclChr ? "text-success" : "text-danger"
// //               }
// //             >
// //               At least one special character (@, #, $, %, &)
// //             </li>
// //           </ul>

// //           <Button
// //             variant="outlined"
// //             type="submit"
// //             size="small"
// //             className="register-btn"
// //             disabled={Object.values(passwordError).includes(false)}
// //           >
// //             {isLoading ? (
// //               <Spinner variant="primary" animation="border" />
// //             ) : (
// //               "Register"
// //             )}
// //           </Button>
// //           <Divider>or</Divider>
// //           <Typography
// //             style={{ cursor: "pointer", color: "#1976d2" }}
// //             onClick={() => Navigate("/login")}
// //           >
// //             Already have an account? Login Now
// //           </Typography>
// //         </Box>
// //       </form>
// //     </Box>
// //   );
// // };

// // export default RegistrationForm;






// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Box,
//   Button,
//   Divider,
//   FormControl,
//   InputLabel,
//   Typography,
//   styled,
//   Paper,
//   Grid,
//   Alert,
// } from "@mui/material";
// import { newUserRegistration } from "./userRegAction";
// import { alpha, InputBase } from "@mui/material";
// import { Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// const BootstrapInput = styled(InputBase)(({ theme }) => ({
//   "label + &": {
//     marginTop: theme.spacing(2),
//   },
//   "& .MuiInputBase-input": {
//     borderRadius: 8,
//     position: "relative",
//     backgroundColor: theme.palette.background.paper,
//     border: `1px solid ${theme.palette.divider}`,
//     fontSize: 16,
//     width: "100%",
//     padding: "10px 12px",
//     transition: theme.transitions.create([
//       "border-color",
//       "background-color",
//       "box-shadow",
//     ]),
//     fontFamily: [
//       "-apple-system",
//       "BlinkMacSystemFont",
//       '"Segoe UI"',
//       "Roboto",
//       '"Helvetica Neue"',
//       "Arial",
//       "sans-serif",
//     ].join(","),
//     "&:focus": {
//       boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
//       borderColor: theme.palette.primary.main,
//     },
//   },
// }));

// const initialState = {
//   name: "",
//   phone: "",
//   email: "",
//   company: "",
//   address: "",
//   password: "",
//   confirmPass: "",
// };

// const passVerificationError = {
//   isLenthy: false,
//   hasUpper: false,
//   hasLower: false,
//   hasNumber: false,
//   hasSpclChr: false,
//   confirmPass: false,
// };

// const RegistrationForm = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [newUser, setNewUser] = useState(initialState);
//   const [passwordError, setPasswordError] = useState(passVerificationError);

//   const { isLoading, status, message } = useSelector(
//     (state) => state.registration
//   );

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;

//     setNewUser({ ...newUser, [name]: value });

//     if (name === "password") {
//       const isLenthy = value.length > 8;
//       const hasUpper = /[A-Z]/.test(value);
//       const hasLower = /[a-z]/.test(value);
//       const hasNumber = /[0-9]/.test(value);
//       const hasSpclChr = /[@,#,$,%,&]/.test(value);

//       setPasswordError({
//         ...passwordError,
//         isLenthy,
//         hasUpper,
//         hasLower,
//         hasNumber,
//         hasSpclChr,
//       });
//     }

//     if (name === "confirmPass") {
//       setPasswordError({
//         ...passwordError,
//         confirmPass: newUser.password === value,
//       });
//     }
//   };

//   const handleOnSubmit = (e) => {
//     e.preventDefault();
//     const { name, phone, email, company, address, password } = newUser;

//     const newRegistration = {
//       name,
//       phone,
//       email,
//       company,
//       address,
//       password,
//     };
//     dispatch(newUserRegistration(newRegistration));
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         backgroundColor: "#f4f6f8",
//       }}
//     >
//       <Paper
//         elevation={6}
//         sx={{
//           padding: "2rem",
//           borderRadius: "12px",
//           maxWidth: "500px",
//           width: "100%",
//         }}
//       >
//         <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
//           Create an Account
//         </Typography>
//         {message && (
//           <Alert
//             severity={status === "success" ? "success" : "error"}
//             sx={{ mb: 2 }}
//           >
//             {message}
//           </Alert>
//         )}
//         <form onSubmit={handleOnSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel shrink htmlFor="bootstrap-input-name">
//                   Full Name
//                 </InputLabel>
//                 <BootstrapInput
//                   id="bootstrap-input-name"
//                   name="name"
//                   value={newUser.name}
//                   onChange={handleOnChange}
//                   placeholder="Your name"
//                   required
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel shrink htmlFor="bootstrap-input-phone">
//                   Phone
//                 </InputLabel>
//                 <BootstrapInput
//                   id="bootstrap-input-phone"
//                   name="phone"
//                   value={newUser.phone}
//                   onChange={handleOnChange}
//                   placeholder="Phone"
//                   required
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel shrink htmlFor="bootstrap-input-email">
//                   Email
//                 </InputLabel>
//                 <BootstrapInput
//                   id="bootstrap-input-email"
//                   name="email"
//                   value={newUser.email}
//                   onChange={handleOnChange}
//                   placeholder="Enter email"
//                   required
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel shrink htmlFor="bootstrap-input-company">
//                   Company
//                 </InputLabel>
//                 <BootstrapInput
//                   id="bootstrap-input-company"
//                   name="company"
//                   value={newUser.company}
//                   onChange={handleOnChange}
//                   placeholder="Company name"
//                   required
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel shrink htmlFor="bootstrap-input-address">
//                   Address
//                 </InputLabel>
//                 <BootstrapInput
//                   id="bootstrap-input-address"
//                   name="address"
//                   value={newUser.address}
//                   onChange={handleOnChange}
//                   placeholder="Full address"
//                   required
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel shrink htmlFor="bootstrap-input-password">
//                   Password
//                 </InputLabel>
//                 <BootstrapInput
//                   id="bootstrap-input-password"
//                   name="password"
//                   type="password"
//                   value={newUser.password}
//                   onChange={handleOnChange}
//                   placeholder="Password"
//                   required
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel shrink htmlFor="bootstrap-input-confirmPass">
//                   Confirm Password
//                 </InputLabel>
//                 <BootstrapInput
//                   id="bootstrap-input-confirmPass"
//                   name="confirmPass"
//                   type="password"
//                   value={newUser.confirmPass}
//                   onChange={handleOnChange}
//                   placeholder="Confirm Password"
//                   required
//                 />
//               </FormControl>
//             </Grid>
//           </Grid>

//           {!passwordError.confirmPass && (
//             <Typography color="error" sx={{ mt: 1 }}>
//               Password doesn't match!
//             </Typography>
//           )}

//           <Box sx={{ mt: 2 }}>
//             <Typography variant="body2" color="textSecondary">
//               Password must contain:
//             </Typography>
//             <ul style={{ listStyleType: "none", paddingLeft: 0, marginTop: 0 }}>
//               <li
//                 className={
//                   passwordError.isLenthy ? "text-success" : "text-danger"
//                 }
//                 style={{ color: passwordError.isLenthy ? "green" : "red" }}
//               >
//                 Min 8 characters
//               </li>
//               <li
//                 className={
//                   passwordError.hasUpper ? "text-success" : "text-danger"
//                 }
//                 style={{ color: passwordError.hasUpper ? "green" : "red" }}
//               >
//                 At least one uppercase
//               </li>
//               <li
//                 className={
//                   passwordError.hasLower ? "text-success" : "text-danger"
//                 }
//                 style={{ color: passwordError.hasLower ? "green" : "red" }}
//               >
//                 At least one lowercase
//               </li>
//               <li
//                 className={
//                   passwordError.hasNumber ? "text-success" : "text-danger"
//                 }
//                 style={{ color: passwordError.hasNumber ? "green" : "red" }}
//               >
//                 At least one number
//               </li>
//               <li
//                 className={
//                   passwordError.hasSpclChr ? "text-success" : "text-danger"
//                 }
//                 style={{ color: passwordError.hasSpclChr ? "green" : "red" }}
//               >
//                 At least one special character (@, #, $, %, &)
//               </li>
//             </ul>
//           </Box>

//           <Divider sx={{ mt: 2 }} />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             sx={{ mt: 3, width: "100%", padding: "12px", borderRadius: 8 }}
//             disabled={isLoading || !passwordError.confirmPass}
//           >
//             {isLoading ? <Spinner animation="border" variant="light" /> : "Register"}
//           </Button>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default RegistrationForm;

















import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/users/register", formData);
      if (response.status === 201) {
        navigate("/board");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "400px",
        margin: "auto",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" textAlign="center">
        Sign Up
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TextField
          label="Role"
          variant="outlined"
          fullWidth
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={isLoading}
          sx={{ marginTop: "1rem" }}
        >
          {isLoading ? "Registering..." : "Sign Up"}
        </Button>
      </form>
      <Typography textAlign="center" sx={{ marginTop: "1rem" }}>
        Already have an account?{" "}
        <Button onClick={() => navigate("/")} sx={{ textTransform: "none" }}>
          Log In
        </Button>
      </Typography>
    </Box>
  );
};

export default Signup;