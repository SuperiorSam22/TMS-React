const express = require('express');

const {
    getTicket,
    createNewTicket,
    updateTicket,
    deleteTicket,
    getTicketById,
    addCommentToTicket,
} = require('../controllers/ticketController');

const TicketRouter = express.Router();

TicketRouter.route('/AAAA')
    .get(getTicket)
    .post(createNewTicket);

TicketRouter.route('/:id')
    .get(getTicketById)
    .put(updateTicket)
    .delete(deleteTicket)

TicketRouter.route('/:id/comments')
    .post(addCommentToTicket);

module.exports = TicketRouter;
