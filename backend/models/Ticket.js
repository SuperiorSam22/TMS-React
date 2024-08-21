const mongoose = require("mongoose");
const uuid = require('uuid');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    default: uuid.v4,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  status: {
    type: String,
    enum: ["open", "closed", "in progress"],
    default: "open",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      role: {
        type: String,
        enum: ["user", "operator"],
      },
    },
  ],
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
