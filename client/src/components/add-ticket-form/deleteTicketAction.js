import axios from "axios";
import {
  deleteTicketPending,
  deleteTicketSuccess,
  deleteTicketFail,
} from "./addTicketSlicer";

export const deleteTicket = (tId) => async (dispatch) => {
  try {
    dispatch(deleteTicketPending());

    const result = await axios.delete(`/api/tickets/${tId}`);

    if (result.data.status === "success") {
      dispatch(deleteTicketSuccess(result.data.message));
    } else {
      dispatch(deleteTicketFail(result.data.message));
    }
  } catch (error) {
    dispatch(deleteTicketFail(error.message));
  }
};