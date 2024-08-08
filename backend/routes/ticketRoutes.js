const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const {
    getAllTickets,
    getTicketByUserId,
    createNewTicket,
    updateTicket,
    deleteTicket,
    getTicketByTicketId,
    addCommentToTicket,
    getCommentsByTicketId
} = require('../controllers/ticketController');

const TicketRouter = express.Router();

TicketRouter.route('/getAll')
    .get(
        authMiddleware,
        getAllTickets
    );

TicketRouter.route('/:userId')
    .get(
        authMiddleware, 
        getTicketByUserId)
    .post(
        authMiddleware, 
        createNewTicket
    );


TicketRouter.route('/:id')
    .get(
        authMiddleware,
        getTicketByTicketId
    )
    .patch(
        authMiddleware,
        updateTicket
    )
    .delete(
        authMiddleware,
        deleteTicket
    )

TicketRouter.route('/:id/comments')
    .get(
        authMiddleware, 
        getCommentsByTicketId,
    )
    .post(
        authMiddleware, 
        addCommentToTicket
    )

module.exports = TicketRouter;
