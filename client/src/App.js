import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { PrivateRoute } from "./components/private-route/PrivateRoute.comp";
import { DefaultLayout } from "./layout/DefaultLayout";
import { Dashboard } from "./pages/dashboard/Dashboard.page";
import { UserVerification } from "./pages/user-verification/UserVerification.page";
import { Entry } from "./pages/entry/Entry.page";
import { PasswordOtpForm } from "./pages/password-reset/PasswordOtpForm.page";
import { Registration } from "./pages/registration/Registration.page";
import { AddTicket } from "./pages/new-ticket/AddTicket.page";
import { TicketLists } from "./pages/ticket-list/TicketLists.page";
import { Ticket } from "./pages/ticket/Ticket.page";
import Board from "./pages/Board/board";
import TicketDetails from "./components/ticketdetails/TicketDetails";
import { ToastContainer } from "react-toastify";
import TicketViewDetails from "./components/ticketView/ticketViewDetails";
import TicketDetailsPage from "./components/ticketdetails/TicketDetails";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Entry />} />
          <Route exact path="/registration" element={<Registration />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />

          <Route exact path="/password-reset" element={<PasswordOtpForm />} />

          <Route
            exact
            path="/verification/:_id/:email"
            element={<UserVerification />}
          />

          <Route exact path="/" element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="board" element={<Board />} />
            <Route path="add-ticket" element={<AddTicket />} />
            <Route path="ticket/:tId" element={<Ticket />} />
            <Route path="ticket" element={<TicketLists />} />
            <Route path="/ticket-details" element={<TicketDetailsPage />} />
          </Route>

          {/* <Route path="*">
            <h1>404 Page not found</h1>
          </Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
