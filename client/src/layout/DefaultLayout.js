import React from "react";
import { Header } from "./partials/Header.comp";
import { Footer } from "./partials/Footer.comp";
import ResponsiveDrawer from "../components/sidebar/drawer";
import { Box, Grid } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useLocation, useNavigate } from "react-router-dom";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import image from '../assets/img/cropped-credex_updated1-removebg-preview (1).png'

export const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const navLinks = [
    {
      navName: "Dashboard",
      navLink: "/dashboard",
      navIcon: <DashboardIcon />,
    },
    {
      navName: "Board",
      navLink: "/board",
      navIcon: <SpaceDashboardOutlinedIcon />,
    },
    {
      navName: "Setting",
      navLink: "/setting",
      navIcon: <SettingsIcon />,
    },
    {
      navName: "Log out",
      navLink: "/",
      navIcon: <LogoutIcon />,
    },
  ];

  const handleNav = (route) => {
    navigate(route);
  };

  return (
    <div className="default-layout">
      {/* <header className="header mb-2">
        <Header />
      </header> */}
      <Grid container className="dashboard-layout">
        <Grid item sm={2} className="sidebar">
         
            <img src={image} alt="Logo" /> 
          
          <Box className="navigation">
            {navLinks.map((item) => {
              return (
                <Box
                  key={item.navLink} // Add a unique key prop here
                  className={`${path === item.navLink ? "nav-box-selected" : ""} nav-box`}
                  onClick={() => handleNav(item.navLink)}
                >
                  {item.navIcon}
                  <span>{item.navName}</span>
                </Box>
              );
            })}
          </Box>
        </Grid>
        <Grid item sm={10} className="outlet-grid">
          {children}
        </Grid>
      </Grid>

      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
};