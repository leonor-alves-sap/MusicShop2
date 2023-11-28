import express, { Request, Response } from "express";
import { Vinyl } from "../domain/entity/vinyl";
import { vinylRepository } from "../repository/vinylRepository";
import { vinylService } from "../services/vinylService";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Post

// Create a vinyl
router.post("/vinyl", async (req: Request, res: Response) => {
  try {
    const { artist, genre, title, entranceDate, price, stock } = req.body;
    const id = uuidv4();
    const vinyl = new Vinyl(
      artist,
      genre,
      title,
      entranceDate,
      price,
      stock,
      id,
    );

    // Validate request parameters
    if (!vinyl) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Delete the vinyl
    await vinylRepository.createVinyl(vinyl);

    // Respond with a success message
    res.json({ message: "Vinyl created successfully" });
  } catch (error) {
    console.error("Error creating vinyl:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Vinyl
router.post("/update-vinyl", async (req, res) => {
  try {
    const { artist, genre, title, entranceDate, price, stock } = req.body;

    // Validate request parameters
    if (
      !title ||
      (!artist &&
        typeof price !== "number" &&
        !genre &&
        !entranceDate &&
        typeof stock !== "number")
    ) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Check if the vinyl exists
    const existingVinyl = await vinylRepository.getVinylByTitle(title);
    if (!existingVinyl) {
      return res.status(404).json({ error: "Vinyl not found" });
    }

    const vinyl = new Vinyl(
      artist || existingVinyl.artist,
      genre || existingVinyl.genre,
      title,
      entranceDate || existingVinyl.entranceDate,
      price || existingVinyl.price,
      stock || existingVinyl.stock,
      existingVinyl.id,
    );

    // Update the vinyl
    const updatedVinyl = await vinylRepository.updateVinylByTitle(title, vinyl);

    // Respond with the updated vinyl
    res.json(updatedVinyl);
  } catch (error) {
    console.error("Error updating vinyl:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/update-price", async (req: Request, res: Response) => {
  try {
    const { title, newPrice } = req.body;
    // Assuming title and newPrice are provided in the request body
    if (!title || typeof newPrice !== "number") {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Call the service layer to update the vinyl price
    const updatedVinyl: Vinyl | null = await vinylService.updateVinylPrice(
      title,
      newPrice,
    );

    if (!updatedVinyl) {
      return res.status(404).json({ error: "Vinyl not found" });
    }

    // Respond with the updated vinyl details
    return res.json(updatedVinyl);
  } catch (error) {
    console.error("Error updating vinyl price:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/update-stock", async (req: Request, res: Response) => {
  try {
    const { title, newStock } = req.body;
    // Assuming title and newStock are provided in the request body
    if (!title || typeof newStock !== "number") {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Call the service layer to update the vinyl stock
    const updatedVinyl: Vinyl | null = await vinylService.updateVinylStock(
      title,
      newStock,
    );

    if (!updatedVinyl) {
      return res.status(404).json({ error: "Vinyl not found" });
    }

    // Respond with the updated vinyl details
    return res.json(updatedVinyl);
  } catch (error) {
    console.error("Error updating vinyl stock:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get

// All Vinyls
router.get("/all-vinyls", async (req: Request, res: Response) => {
  try {
    // Call the service layer to update the vinyl balance
    const updatedVinyl: Vinyl[] | null = await vinylRepository.getAllVinyls();

    if (!updatedVinyl) {
      return res.status(404).json({ error: "No vinyls found" });
    }

    // Respond with the updated vinyl details
    return res.json(updatedVinyl);
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
    const updatedVinyl: Vinyl | null = await vinylRepository.getVinylByTitle(
      title,
    );

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

router.get("/by-artist", async (req: Request, res: Response) => {
  try {
    const artist = req.query.artist;

    // Validate request parameters
    if (!artist) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    if (typeof artist !== "string") {
      return res.status(400).json({ error: "Invalid artist parameter" });
    }

    // Call the service layer to update the vinyl balance
    const updatedVinyl:
      | Vinyl[]
      | null = await vinylRepository.getVinylsByArtist(artist);

    if (!updatedVinyl) {
      return res.status(404).json({ error: "Vinyl not found" });
    }

    // Respond with the updated vinyl details
    return res.json(updatedVinyl);
  } catch (error) {
    console.error("Error getting vinyls by Artist:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/by-genre", async (req: Request, res: Response) => {
  try {
    const genre = req.query.genre;

    // Validate request parameters
    if (!genre) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    if (typeof genre !== "string") {
      return res.status(400).json({ error: "Invalid genre parameter" });
    }

    // Call the service layer to update the vinyl balance
    const updatedVinyl: Vinyl[] | null = await vinylRepository.getVinylsByGenre(
      genre,
    );

    if (!updatedVinyl) {
      return res.status(404).json({ error: "Vinyl not found" });
    }

    // Respond with the updated vinyl details
    return res.json(updatedVinyl);
  } catch (error) {
    console.error("Error getting vinyls by Genre:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Vinyl
router.delete("/vinyl", async (req: Request, res: Response) => {
  try {
    const title = req.query.title;

    // Validate request parameters
    if (!title) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    if (typeof title !== "string") {
      return res.status(400).json({ error: "Invalid title parameter" });
    }

    // Delete the vinyl
    await vinylRepository.deleteVinylByTitle(title);

    // Respond with a success message
    res.json({ message: "Vinyl deleted successfully" });
  } catch (error) {
    console.error("Error deleting vinyl:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as vinylController };
