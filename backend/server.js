const { connectDB } = require("./config/db");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const TicketRouter = require('./routes/ticketRoutes')
const userRouter = require("./routes/userRoutes");
const path = require('path');
const commentsRouter = require("./routes/commentsRoutes");
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//database connection
connectDB();

//routes
app.use('/api/tickets', TicketRouter);
app.use('/api/users', userRouter);
app.use('/api/comments', commentsRouter)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT;
//start the server
app.listen(PORT, console.log(`listening on port ${PORT}`));
