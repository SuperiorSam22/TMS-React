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
      return res.status(404).json({ message: "Ticket not found" });
    }

    const comment = ticket.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // if (comment.userId.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    ticket.comments.pull({ _id: req.params.commentId });
    await ticket.save();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  editComment,
  deleteComment,
};
