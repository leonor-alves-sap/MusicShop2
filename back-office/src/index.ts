import express, { Request, Response } from "express";
import { migrateTables } from "./repository/connection";
import { clientService } from "./services/clientService";
import { vinylController } from "./controllers/vinylController";
import { clientController } from "./controllers/clientController"; // Adjust the import based on your project structure

const PORT = process.env.PORT || 3000;

//App

const app = express();
app.use(express.json()); // Add this middleware to parse JSON requests

// Mounting controllers/routers
app.use("/api/clients", clientController); // Mount clientController at /api/clients
app.use("/api/vinyls", vinylController); // Mount vinylController at /api/vinyls

app.listen(PORT, async () => {
  console.log(`app listening on port ${PORT}`);
  migrateTables();
});
