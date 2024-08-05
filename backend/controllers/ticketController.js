const Ticket = require("../models/Ticket");
const User = require("../models/User");

//get all tickets
//route GET /api/tickets
const getTicket = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tickets = await Ticket.find({user: userId}).populate("user", "name email");
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

//Create a new ticket
//route POST /api/tickets
const createNewTicket =async (req, res) => {
  const { title, description, severity } = req.body;
  const userId = req.user._id;

  try {
    const newTicket = new Ticket({
      title,
      description,
      severity,
      user: userId,
    });
    const ticket = await newTicket.save();
    console.log(ticket);
    res.status(200).json(ticket);
  } catch (error) {
    res.status(400).json({ message: "Invalid Ticket Data" });
  }
};

//Upadate a ticket
//route PUT /api/tickets/:id
const updateTicket = async (req, res) => {
  const { severity, status, date } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    ticket.severity = severity || ticket.severity;
    ticket.status = status || ticket.status;
    ticket.date = date || Date.now();

    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } catch (error) {
    res.status(400).json({ message: "Invalid Ticket data" });
  }
};

//delete a ticket
//route /api/tickets/:id\
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findbyId(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await ticket.remove();
    res.status(200).json({ message: "Ticket removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//Get ticket by ID
//route /api/tickets/:id
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findbyId(req.params.id).populate(
      "user",
      "name email"
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//Add commnent to the ticket with id
//route POST  /api/tickets/:id/comments 
const addCommentToTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findbyId(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        const comment = {
            user: req.user._id,
            text,
        }

        ticket.comment.push(comment);
        await ticket.save();

        res.status(200).json(ticket);

    } catch (error) {
        res.json(400).json({message: 'Invalid comment data'});
    }
}

//export all
module.exports = {
    getTicket,
    createNewTicket,
    updateTicket,
    deleteTicket,
    getTicketById,
    addCommentToTicket,
}
