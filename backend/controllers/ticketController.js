const { default: mongoose } = require("mongoose");
const Ticket = require("../models/Ticket");
const transporter = require("../utils/email");
const uuid = require("uuid");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

//get all tickets of all users
const getAllTickets = async (req, res) => {
  try {
    if (req.user.role !== "operator") {
      return res
        .status(403)
        .json({ message: "You do not have permission to view all tickets" });
    }

    const tickets = await Ticket.find().populate("user", "name email");

    return res.status(200).json(tickets);
  } catch (error) {
    console.error(error); // log the error for debugging purposes
    res.status(500).json({ message: "Server error!" });
  }
};

//get all tickets of a specific user
//route GET /api/tickets
const getTicketByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const sort = req.query.sort;
    const order = req.query.order;
    const tickets = await Ticket.find({ user: userId }).populate(
      "user",
      "name email"
    );
    if (!tickets || tickets.length === 0) {
      return res.json(404).json({ message: "no tickets found for the user" });
    }
    if (sort === "date" && order === "desc") {
      tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    //  res.status(500).json({ message: "Server Error" });
  }
};

//Create a new ticket
//route POST /api/tickets
const createNewTicket = async (req, res) => {
  const { title, description, severity, dueDate, startDate } = req.body;
  const { id: user, name: username, role, email } = req.user;
  const ticketId = uuid.v4().slice(0, 8);

  try {
    // Create a new ticket instance
    const newTicket = new Ticket({
      ticketId,
      title,
      description,
      severity,
      user: user,
      image: req.file ? req.file.filename : null, // Save the image filename if it exists
      startDate: startDate,
      dueDate: dueDate,
    });

    // Save the new ticket to the database
    const ticket = await newTicket.save();
    console.log(ticket);

    // Send email notification to the user
    const companyName = process.env.COMPANY_NAME;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "sandeep.lal@credextechnology.com", // Adjust this as needed
      subject: `New Ticket Created: ${newTicket.title}`,
      text: `
        Dear ${username}

        A new ticket has been created with the following details:
        Title: ${newTicket.title}
        Description: ${newTicket.description}
        Severity: ${newTicket.severity}

        If you have any further questions or concerns, please don't hesitate to reach out to us.
        Thank you for your patience and cooperation.

        Best regards,
        ${companyName} Team
      `,
    };
    console.log("mail options", mailOptions);

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");

    // Send the newly created ticket as the response
    return res.status(200).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(400).json({ message: `Invalid Ticket Data` });
  }
};

//Upadate a ticket
//route PUT /api/tickets/:id
const updateTicket = async (req, res) => {
  const { severity, status, title, description, startDate, dueDate } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    ticket.severity = severity || ticket.severity;
    ticket.status = status || ticket.status;
    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;
    ticket.startDate = startDate || ticket.startDate;
    ticket.dueDate = dueDate || ticket.dueDate;

    const updatedTicket = await ticket.save();
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(400).json({ message: "Invalid Ticket data" });
  }
};

//delete a ticket
//route DELETE /api/tickets/:id
const deleteTicket = async (req, res) => {
  try {
    // if (req.user.role !== "operator") {
    //   return res
    //     .status(403)
    //     .json({ message: "you dont have permission to delete ticket" });
    // }

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      return res.status(400).json({ message: "ticket not found" });
    }

    res.status(200).json({ message: "Ticket removed successfully!" });
  } catch (error) {
    return res.status(500).json({ messaage: "server error" });
  }
};

//Get ticket by ticket ID
//route /api/tickets/:id
const getTicketByTicketId = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.status(200).json(ticket);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//Add commnent to the ticket with id
//route POST  /api/tickets/:id/comments
const addCommentToTicket = async (req, res) => {
  try {
    const { id: user, name: username, role, email } = req.user;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const newComment = {
      user: user,
      userName: username,
      text: req.body.text,
      role: role,
    };

    ticket.comments.push(newComment);
    await ticket.save();

    if (!email) {
      return res
        .status(404)
        .json({ message: "no recipient email address found" });
    }

    //send an email to the user
    const companyName = process.env.COMPANY_NAME;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "sandeep.lal@credextechnology.com",
      subject: `Ticket #${ticket.ticketId} ${ticket.title} updated`,
      text: `Dear ${username},

A new comment has been added to ticket #${ticket.title}
Description: ${ticket.description}
Comment: ${newComment.text}
If you have any further questions or concerns, please don't hesitate to reach out to us.
Thank you for your patience and cooperation.

Best regards,
${companyName} Team`,
    };
    console.log("mail options", mailOptions);

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }

    return res.status(200).json(ticket);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Failed to add comment : ${error}` });
  }
};

const getCommentsByTicketId = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const comments = ticket.comments;
    res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: "Server error!" });
  }
};

//assign user/operator to the ticket
const assignUserToTicket = async (req, res) => {
  const { assignedUser, assignedOperator } = req.body;
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedUser, assignedOperator },
      { new: true }
    );
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: "Error assigning user/operator to ticket" });
  }
};

const deleteAttachment = async (req, res) => {
  const { ticketId, fileName } = req.params;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "ticket not found" });
    }
    //remove the file from the attachment array
    // ticket.image = ticket.image.filter((file) => file !== filename);
    ticket.image = null;
    await ticket.save();
    res.status(200).json({ message: "File removed successfully" });

    //delete the file from the file system
    // const filePath = path.join(_dirname, "/uploads", filename);
    // fs.unlink(filePath, (err) => {
    //   if (err) {
    //     console.error("error deleting file", err);
    //     return res.status(500).json({ message: "error deleting file" });
    //   }
    // });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};

//export all
module.exports = {
  getAllTickets,
  getTicketByUserId,
  createNewTicket,
  updateTicket,
  deleteTicket,
  getTicketByTicketId,
  addCommentToTicket,
  getCommentsByTicketId,
  assignUserToTicket,
  deleteAttachment,
};
