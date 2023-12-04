import express, { Request, Response } from "express";
import { Client } from "../domain/entity/client";
import { clientRepository } from "../repository/clientRepository";
import { clientService } from "../services/clientService";

const router = express.Router();

// Post

// Create a client
router.post("/client", async (req: Request, res: Response) => {
  try {
    const { email, name, password, age, gender, balance } = req.body;
    const client = new Client(name, email, password, age, gender, balance);

    // Validate request parameters
    if (!client) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Delete the client
    await clientRepository.createClient(client);

    // Respond with a success message
    res.json({ message: "Client created successfully" });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/balance", async (req: Request, res: Response) => {
  try {
    const { email, balance } = req.body;
    console.log(req.body);
    // Assuming email and newBalance are provided in the request body
    if (!email || typeof balance !== "number") {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Call the service layer to update the client balance
    const updatedClient: Client | null = await clientService.updateClientBalance(
      email,
      balance,
    );
    console.log(updatedClient);
    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Respond with the updated client details
    return res.json(updatedClient);
  } catch (error) {
    console.error("Error updating client balance:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/update-client", async (req, res) => {
  try {
    const { email, name, age, gender, balance } = req.body;

    // Validate request parameters
    if (
      !email ||
      (!name &&
        typeof age !== "number" &&
        !gender &&
        typeof balance !== "number")
    ) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Check if the client exists
    const existingClient = await clientRepository.getClientByEmail(email);
    if (!existingClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    const client = new Client(
      name || existingClient.name,
      email,
      existingClient.password,
      age || existingClient.age,
      gender || existingClient.gender,
      balance || existingClient.balance,
    );

    // Update the client
    const updatedClient = await clientRepository.updateClientByEmail(
      email,
      client,
    );

    // Respond with the updated client
    res.json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get
router.get("/all-clients", async (req: Request, res: Response) => {
  try {
    // Call the service layer to update the client balance
    const updatedClient:
      | Client[]
      | null = await clientRepository.getAllClients();

    if (!updatedClient) {
      return res.status(404).json({ error: "No clients found" });
    }

    // Respond with the updated client details
    return res.json(updatedClient);
  } catch (error) {
    console.error("Error getting clients:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/client", async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    // Assuming email and newBalance are provided in the request body
    if (!email) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    if (typeof email !== "string") {
      return res.status(400).json({ error: "Invalid email parameter" });
    }

    // Call the service layer to update the client balance
    const updatedClient: Client | null = await clientRepository.getClientByEmail(
      email,
    );

    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Respond with the updated client details
    return res.json(updatedClient);
  } catch (error) {
    console.error("Error getting client:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a client
router.delete("/client", async (req: Request, res: Response) => {
  try {
    const email = req.query.email;

    // Validate request parameters
    if (!email) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    if (typeof email !== "string") {
      return res.status(400).json({ error: "Invalid email parameter" });
    }

    // Delete the client
    await clientRepository.deleteClientByEmail(email);

    // Respond with a success message
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as clientController };
