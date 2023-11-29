import express, { Request, Response } from "express";
import { rentalController } from "./controllers/rentalController";
const PORT = process.env.PORT || 3000;

//App

const cors = require("cors");
const app = express();
app.use(express.json()); // Add this middleware to parse JSON requests
// Use CORS middleware
const corsOptions = {
  origin: "http://rental-frontend:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // enable set cookie
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Mounting controllers/routers
app.use("/api/rentals", rentalController);

app.listen(PORT, async () => {
  console.log(`app listening on port ${PORT}`);
});
