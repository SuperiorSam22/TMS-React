import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import SearchBar from "../search/search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useDispatch, useSelector } from "react-redux";

function Header() {
  const { user } = useSelector((state) => state.user);

  const userName = JSON.parse(sessionStorage.getItem('user')).name;

  return (
    <Box className="header" justifyContent="end">
      {/* <h1>Dashboard</h1> */}
      {/* <SearchBar /> */}
      <Box className="header-group">
        <Box className="profile">
          <AccountCircleIcon fontSize="medium"/>
          <Typography>
            {userName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
