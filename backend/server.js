const { connectDB } = require("./config/db");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const TicketRouter = require('./routes/ticketRoutes')
const userRouter = require("./routes/userRoutes");

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

const PORT = process.env.PORT;
//start the server
app.listen(PORT, console.log(`listening on port ${PORT}`));
