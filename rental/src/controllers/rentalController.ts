import express, { Request, Response } from "express";
import { rentalService } from "../services/rentalService";
import { InsufficientFundsError, NoStockError } from "../domain/errors";

const router = express.Router();

// Rent a vinyl
router.post("/rent", async (req: Request, res: Response) => {
  try {
    const { email, title } = req.body;
    // Validate request parameters
    if (!email && !title) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }
    const updatedClient = await rentalService.rentVinyl(email, title);

    // Respond with a success message
    res.json({
      message: "Vinyl rented successfully",
      userBalance: updatedClient.balance,
    });
  } catch (error) {
    if (error instanceof InsufficientFundsError) {
      return res.status(400).json({ error: error.message });
    } else if (error instanceof NoStockError) {
      return res.status(400).json({ error: error.message });
    } else {
      console.error("Error renting vinyl:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Return a vinyl
router.post("/return", async (req: Request, res: Response) => {
  try {
    const { email, title } = req.body;
    // Validate request parameters
    if (!email && !title) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }
    await rentalService.returnVinyl(email, title);

    // Respond with a success message
    res.json({ message: "Vinyl returned successfully" });
  } catch (error) {
    console.error("Error returning vinyl:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Return a vinyl
router.post("/balance", async (req: Request, res: Response) => {
  try {
    const { email, balance } = req.body;
    // Validate request parameters
    if (!email && !balance) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }
    const updatedClient = await rentalService.updateClientBalance(
      email,
      balance,
    );

    // Respond with a success message
    res.json({
      message: `Balance updated successfully. Your balance is now ${updatedClient.balance}`,
    });
  } catch (error) {
    console.error("Error updating balance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// All Vinyls
router.get("/all-vinyls", async (req: Request, res: Response) => {
  try {
    const response = await rentalService.fetchAllVinyls();

    if (!response) {
      return res.status(404).json({ error: "No vinyls found" });
    }

    // Respond with the updated vinyl details
    return res.json(response);
  } catch (error) {
    console.error("Error getting vinyls:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Vinyl by Title
router.get("/vinyl", async (req: Request, res: Response) => {
  try {
    const title = req.query.title;

    // Validate request parameters
    if (!title) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    if (typeof title !== "string") {
      return res.status(400).json({ error: "Invalid title parameter" });
    }

    // Call the service layer to update the vinyl balance
    const updatedVinyl = await rentalService.fetchVinylData(title);

    if (!updatedVinyl) {
      return res.status(404).json({ error: "Vinyl not found" });
    }

    // Respond with the updated vinyl details
    return res.json(updatedVinyl);
  } catch (error) {
    console.error("Error getting vinyl:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Vinyl by Artist
router.get("/by-genre", async (req: Request, res: Response) => {
  try {
    const genre = req.query.genre;

    // Validate request parameters
    if (!genre) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    if (typeof genre !== "string") {
      return res.status(400).json({ error: "Invalid parameter" });
    }

    // Call the service layer to update the vinyl balance
    const updatedVinyl = await rentalService.fetchVinylsByGenre(genre);

    if (!updatedVinyl) {
      return res.status(404).json({ error: "Vinyl not found" });
    }

    // Respond with the updated vinyl details
    return res.json(updatedVinyl);
  } catch (error) {
    console.error("Error getting vinyl:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Vinyl by Genre
router.get("/by-artist", async (req: Request, res: Response) => {
  try {
    const artist = req.query.artist;

    // Validate request parameters
    if (!artist) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    if (typeof artist !== "string") {
      return res.status(400).json({ error: "Invalid parameter" });
    }

    // Call the service layer to update the vinyl balance
    const updatedVinyl = await rentalService.fetchVinylsByArtist(artist);

    if (!updatedVinyl) {
      return res.status(404).json({ error: "Vinyl not found" });
    }

    // Respond with the updated vinyl details
    return res.json(updatedVinyl);
  } catch (error) {
    console.error("Error getting vinyl:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as rentalController };
