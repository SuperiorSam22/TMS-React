const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    // default: uuid.v4,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
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
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedOperator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});


ticketSchema.pre("save", async function(next) {
  const counter = await Counter.findOne({ _id: "ticketId" });
  if (!counter) {
    const newCounter = new Counter({ _id: "ticketId", seq: 1 });
    await newCounter.save();
    this.ticketId = `PROJ-${newCounter.seq}`;
  } else {
    counter.seq += 1;
    await counter.save();
    this.ticketId = `PROJ-${counter.seq}`;
  }
  next();
});

const Counter = mongoose.model(
  "Counter",
  new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } })
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
