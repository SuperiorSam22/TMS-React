const { connectDB } = require("./config/db");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const TicketRouter = require("./routes/ticketRoutes");
const userRouter = require("./routes/userRoutes");
const path = require("path");
const commentsRouter = require("./routes/commentsRoutes");
const fs = require("fs");
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//database connection
connectDB();

//routes
app.use("/api/tickets", TicketRouter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentsRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  console.log(`File path: ${filePath}`);

  fs.exists(filePath, (exists) => {
    console.log(`File exists: ${exists}`);

    if (!exists) {
      res.status(404).send(`File not found: ${filename}`);
      return;
    }

    res.set("Content-Type", "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename="${filename}"`);
    res.set("Content-Transfer-Encoding", "binary");

    fs.createReadStream(filePath).pipe(res);
  });
});

const PORT = process.env.PORT;
//start the server
app.listen(PORT, console.log(`listening on port ${PORT}`));
