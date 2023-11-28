import express, { Request, Response } from "express";
import { rentalController } from "./controllers/rentalController";
const PORT = process.env.PORT || 3000;

//App

const cors = require("cors");
const app = express();
app.use(express.json()); // Add this middleware to parse JSON requests
// Use CORS middleware
app.use(
  cors({
    origin: "http://rental-frontend:3000", // Update this to your frontend's URL
    credentials: true,
  }),
);

// Mounting controllers/routers
app.use("/api/rentals", rentalController); // Mount clientController at /api/rentals

app.listen(PORT, async () => {
  console.log(`app listening on port ${PORT}`);
});
