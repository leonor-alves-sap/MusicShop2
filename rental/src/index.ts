import express, { Request, Response } from "express";
import { rentalController } from "./controllers/rentalController";
const PORT = process.env.PORT || 3000;

//App
const app = express();
app.use(express.json()); // Add this middleware to parse JSON requests

// Mounting controllers/routers
app.use("/api/rentals", rentalController); // Mount clientController at /api/rentals

app.listen(PORT, async () => {
  console.log(process.env.PORT);
  console.log(`app listening on port ${PORT}`);
});
