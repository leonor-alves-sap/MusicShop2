import express, { Request, Response } from "express";
import { migrateTables } from "./repository/connection";
import { vinylController } from "./controllers/vinylController";
import { clientController } from "./controllers/clientController"; // Adjust the import based on your project structure
import { seedDb } from "./db/seed";

const PORT = process.env.PORT || 3000;

//App
const cors = require("cors");
const app = express();
app.use(express.json()); // Add this middleware to parse JSON requests

// Use CORS middleware
app.use("/api/clients", clientController); // Mount clientController at /api/clients
app.use("/api/vinyls", vinylController); // Mount vinylController at /api/vinyls

app.listen(PORT, async () => {
  console.log(`app listening on port ${PORT}`);
  migrateTables();
  seedDb();
});
