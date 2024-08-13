const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    default: Date.now,
  },
  comments: [{
      userId: 
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      },
      text: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      role: 
      {
        type: String,
        enum: ['user', 'operator'],
      }
    },
  ],
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;

