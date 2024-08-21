import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import { TicketTable } from "../../components/ticket-table/TicketTable.comp";
import tickets from "../../assets/data/dummy-tickets.json";
import { PageBreadcrumb } from "../../components/breadcrumb/Breadcrumb.comp";
import { Link } from "react-router-dom";

import { fetchAllTickets } from "../ticket-list/ticketsAction";
import { Box, Divider, Grid } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchBar from "../../components/search/search";
import PieChart from "../../components/charts/PieChart";
import Header from "../../components/header/header";
import CustomAccordions from "../../components/Accordion/Accordion";
import QueryStatsIcon from '@mui/icons-material/QueryStats';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.tickets);

  const [expanded, setExpanded] = React.useState("panel1");
  const [showChart, setShowChart] = React.useState(true);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setShowChart(true);
  };

  useEffect(() => {
    if (!tickets.length) {
      dispatch(fetchAllTickets());
    }
  }, [tickets, dispatch]);

  const pendingTickets = tickets.filter((row) => row.status !== "Closed");
  const totlatTickets = tickets.length;
  return (
    <div className="main-dashboard">
      <Header />
      <Divider />
      <Box className="content">
        <h2>Dashboard</h2>
        <Box mt={3} className="section1">
          <p className="heading">Active projects</p>
          <Grid container spacing={3}>
            <Grid item sm={8} md={8}>
              <CustomAccordions
                expanded={expanded}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item sm={4} md={4}>
              <Box className="chart-box">
                {showChart ? (
                  <PieChart />
                ) : (
                  <Box sx={{ p: 4 }}>
                    <QueryStatsIcon className="stats-icon"/>
                    <p>Selecet project to view it's stats</p>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};
