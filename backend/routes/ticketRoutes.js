const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const {
    getTicket,
    createNewTicket,
    updateTicket,
    deleteTicket,
    getTicketById,
    addCommentToTicket,
} = require('../controllers/ticketController');

const TicketRouter = express.Router();

TicketRouter.route('/tickets')
    .get(
        // authMiddleware, 
        getTicket)
    .post(
        authMiddleware, 
        createNewTicket);

TicketRouter.route('/:id')
    .get(
        // authMiddleware,
        getTicketById)
    .put(
        // authMiddleware,
        updateTicket)
    .delete(authMiddleware, deleteTicket)

TicketRouter.route('/:id/comments')
    .post(
        // authMiddleware, 
        addCommentToTicket);

module.exports = TicketRouter;
