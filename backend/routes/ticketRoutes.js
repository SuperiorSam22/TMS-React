const express = require('express');

const upload = require('../utils/multer');

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



// Configure multer for image upload
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/'); // Specify the upload directory
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname); // Customize the filename
//     }
//   });
  
//   const upload = multer({ storage: storage });




TicketRouter.route('/getAll')
    .get(
        authMiddleware,
        getAllTickets
    );

TicketRouter.route('/:userId')
    .get(
        // authMiddleware, 
        getTicketByUserId)
    .post(
        authMiddleware,
        upload.single('image'), 
        createNewTicket
    );


TicketRouter.route('/:ticketId')
    .get(
        authMiddleware,
        getTicketByTicketId
    )
    .patch(
        authMiddleware,
        updateTicket
    )
    .delete(
        // authMiddleware,
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
