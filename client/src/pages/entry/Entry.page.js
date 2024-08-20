import React, { useState } from "react";
import { LoginForm } from "../../components/login/Login.comp";
import { ResetPassword } from "../../components/password-reset/PasswordReset.comp";

import { Box, Grid } from "@mui/material";

export const Entry = () => {
  const [frmLoad, setFrmLoad] = useState("login");

  const handleOnResetSubmit = (e) => {
    e.preventDefault();
  };

  const formSwitcher = (frmType) => {
    setFrmLoad(frmType);
  };

  return (
    <div className="login-signup">
      <Grid container spacing={2} className="grid-container">
        <Grid item sm={6} md={6} className="auth-section">
          <LoginForm />
        </Grid>
        <Grid item sm={6} md={6} className="img-section">
        </Grid>
      </Grid>
    </div>
  );
};
