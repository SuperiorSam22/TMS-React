const express = require("express");
const commentsRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  editComment,
  deleteComment,
} = require("../controllers/commentController");

//route to edit a comment
commentsRouter
  .route("/:ticketId/comments/:commentId")
  .put(
    // authMiddleware,
    editComment
  )
  .delete(
    // authMiddleware,
    deleteComment);

module.exports = commentsRouter;
