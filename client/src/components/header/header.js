import { Box } from "@mui/material";
import React, { useEffect } from "react";
import SearchBar from "../search/search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../pages/dashboard/userAction";

function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  return (
    <Box className="header">
      {/* <h1>Dashboard</h1> */}
      {/* <SearchBar /> */}
      <Box className="header-group">
        <Box className="notify">
          <NotificationsNoneOutlinedIcon />
        </Box>
        <Box className="profile">
          <AccountCircleIcon />
          <p> user </p>
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
