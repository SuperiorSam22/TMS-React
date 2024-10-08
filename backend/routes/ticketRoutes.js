const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../utils/multer");

const {
  getAllTickets,
  getTicketByUserId,
  createNewTicket,
  updateTicket,
  deleteTicket,
  getTicketByTicketId,
  addCommentToTicket,
  getCommentsByTicketId,
  assignUserToTicket,
  deleteAttachment
} = require("../controllers/ticketController");

const TicketRouter = express.Router();

TicketRouter.route("/:id/getAll").get(authMiddleware, getAllTickets);

TicketRouter.route("/:userId")
  .get(authMiddleware, getTicketByUserId)
  .post(authMiddleware, upload.single("image"), createNewTicket);

TicketRouter.route("/:id/ticketdetails")
  .get(authMiddleware, getTicketByTicketId)
  .patch(authMiddleware, updateTicket)
  .delete(
    // authMiddleware,
    deleteTicket
  );

TicketRouter.route("/:id/comments")
  .get(authMiddleware, getCommentsByTicketId)
  .post(authMiddleware, addCommentToTicket);

TicketRouter.route("/:id/assign").put(authMiddleware, assignUserToTicket);

TicketRouter.route("/deleteAttachment/:ticketId/:filename").delete(
  authMiddleware,
  deleteAttachment
);

module.exports = TicketRouter;
