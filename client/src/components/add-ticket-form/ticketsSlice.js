import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  error: "",
  successMsg: "",
  selectedTicket: {},
  replyMsg: "",
  replyTicketError: "",
};

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    openNewTicketPending: (state) => {
      state.isLoading = true;
    },
    openNewTicketSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.successMsg = payload;
    },
    openNewTicketFail: (state, { payload }) => {
      state.isLoading = true;
      state.error = payload;
    },
    restSuccessMSg: (state) => {
      state.isLoading = true;
      state.successMsg = "";
    },
    fetchSingleTicketPending: (state) => {
      state.isLoading = true;
    },
    fetchSingleTicketSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.selectedTicket = payload;
      state.error = "";
    },
    fetchSingleTicketFail: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
    replyTicketPending: (state) => {
      state.isLoading = true;
    },
    replyTicketSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.replyMsg = payload;
      state.replyTicketError = "";
    },
    replyTicketFail: (state, { payload }) => {
      state.isLoading = false;
      state.replyTicketError = payload;
    },
    closeTicketPending: (state) => {
      state.isLoading = true;
    },
    closeTicketSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.successMsg = payload;
      state.error = "";
      if (state.selectedTicket) {
        state.selectedTicket.status = "Closed";
      }
    },
    closeTicketFail: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
    deleteTicketPending: (state) => {
      state.isLoading = true;
    },
    deleteTicketSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.successMsg = payload;
      state.error = "";
    },
    deleteTicketFail: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
    resetResponseMsg: (state) => {
      state.isLoading = false;
      state.successMsg = "";
      state.error = "";
      state.replyMsg = "";
      state.replyTicketError = "";
    },
  },
});

export const {
  openNewTicketPending,
  openNewTicketSuccess,
  openNewTicketFail,
  restSuccessMSg,
  fetchSingleTicketPending,
  fetchSingleTicketSuccess,
  fetchSingleTicketFail,
  replyTicketPending,
  replyTicketSuccess,
  replyTicketFail,
  closeTicketPending,
  closeTicketSuccess,
  closeTicketFail,
  deleteTicketPending,
  deleteTicketSuccess,
  deleteTicketFail,
  resetResponseMsg,
} = ticketsSlice.actions;
