const { default: mongoose } = require("mongoose");
const Ticket = require("../models/Ticket");

const editComment = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const comment = ticket.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.text = req.body.text || comment.text;
    await ticket.save();

    res.status(200).json({ message: "Comment updated", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(400).json({ message: "Ticket not found" });
    }

    const commentIndex = ticket.comments.findIndex(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (commentIndex === -1) {
      return res.status(400).json({ message: "Comment not found" });
    }

    // if (
    //   ticket.comments[commentIndex].userId.toString() !==
    //   req.user._id.toString()
    // ) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    ticket.comments.splice(commentIndex, 1);
    await ticket.save();
    return res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error!" });
  }
};

module.exports = {
  editComment,
  deleteComment,
};
