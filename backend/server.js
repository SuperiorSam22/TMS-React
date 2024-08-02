const { connectDB } = require('./config/db')
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express(); 

app.use(bodyParser.json());

//database connection 
connectDB();


const PORT = process.env.PORT || 8001;
//start the server 
app.listen(PORT, console.log(`listening on port ${PORT}`));