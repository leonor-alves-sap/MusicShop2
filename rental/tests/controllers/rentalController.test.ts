import { rentalRepository } from "../../src/repository/rentalRepository";
import { Rental } from "../../src//domain/entity/rental";
import { rentalService } from "../../src/services/rentalService";
import { error } from "console";
import { InsufficientFundsError, NoStockError } from "../../src/domain/errors";
import { rentalController } from "../../src/controllers/rentalController";
import express, { Request, Response } from "express";

const app = express();
const request = require("supertest");
app.use(express.json());

// Define here all routes
app.post("/rent", rentalController);
app.patch("/return", rentalController);
app.patch("/balance", rentalController);
app.get("/all-vinyls", rentalController);
app.get("/vinyl", rentalController);
app.get("/by-artist", rentalController);
app.get("/by-genre", rentalController);

describe("RentalController", () => {
  // Define here the tests
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /rent", () => {
    it("should return 200 and success message with user balance if rental is successful", async () => {
      // Arrange
      const mockUpdatedClient = { balance: 50 };
      // Mock dependencies
      jest
        .spyOn(rentalService, "rentVinyl")
        .mockResolvedValueOnce(mockUpdatedClient);
      // Act
      const response = await request(app)
        .post("/rent")
        .send({ email: "test@example.com", title: "Vinyl Title" });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Vinyl rented successfully",
        userBalance: mockUpdatedClient.balance,
      });
    });
    it("should return 500 if request parameters are invalid", async () => {
      // Arrange
      const invalidRequest = { email: "test@example.com" };

      // Act
      const response = await request(app)
        .post("/rent")
        .send(invalidRequest);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });
    it("should return 400 if rentalService throws InsufficientFundsError", async () => {
      // Arrange
      jest
        .spyOn(rentalService, "rentVinyl")
        .mockRejectedValueOnce(
          new InsufficientFundsError("Insufficient funds"),
        );

      // Act
      const response = await request(app)
        .post("/rent")
        .send({ email: "test@example.com", title: "Vinyl Title" });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Insufficient funds" });
    });
  });
  it("should return 400 if rentalService throws No Stock", async () => {
    // Arrange
    jest
      .spyOn(rentalService, "rentVinyl")
      .mockRejectedValueOnce(new NoStockError("No Stock"));

    // Act
    const response = await request(app)
      .post("/rent")
      .send({ email: "test@example.com", title: "Vinyl Title" });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "No Stock" });
  });

  describe("PATCH /balance", () => {
    it("should return 200 and success message with user balance if rental is successful", async () => {
      // Mock dependencies
      const mockedClient = { balance: 10 };
      jest
        .spyOn(rentalService, "updateClientBalance")
        .mockResolvedValueOnce(mockedClient);
      // Act
      const response = await request(app)
        .patch("/balance")
        .send({ email: "test@example.com", balance: 10 });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: `Balance updated successfully. Your balance is now 10`,
      });
    });
    it("should return 500 if request parameters are invalid", async () => {
      // Arrange
      const invalidRequest = { email: "test@example.com" };

      // Act
      const response = await request(app)
        .patch("/balance")
        .send(invalidRequest);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });
  });

  describe("PATCH /return", () => {
    it("should return 200 and success message with user balance if rental is successful", async () => {
      // Mock dependencies
      jest.spyOn(rentalService, "returnVinyl").mockResolvedValueOnce();
      // Act
      const response = await request(app)
        .patch("/return")
        .send({ email: "test@example.com", title: "Vinyl Title" });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Vinyl returned successfully",
      });
    });
    it("should return 500 if request parameters are invalid", async () => {
      // Arrange
      const invalidRequest = { email: "test@example.com" };

      // Act
      const response = await request(app)
        .patch("/return")
        .send(invalidRequest);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });
  });

  describe("GET /all-vinyls", () => {
    it("should return all vinyls", async () => {
      // Arrange
      const mockVinyls = [
        { id: "1", title: "Vinyl 1" },
        { id: "2", title: "Vinyl 2" },
      ];
      jest
        .spyOn(rentalService, "fetchAllVinyls")
        .mockResolvedValueOnce(mockVinyls);
      // Act
      const response = await request(app).get("/all-vinyls");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockVinyls);
    });

    it("should return a 404 error if no vinyls are found", async () => {
      // Arrange
      jest.spyOn(rentalService, "fetchAllVinyls").mockResolvedValueOnce(null);

      // Act
      const response = await request(app).get("/all-vinyls");

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "No vinyls found" });
    });

    it("should return a 500 error for internal server error", async () => {
      // Arrange
      jest
        .spyOn(rentalService, "fetchAllVinyls")
        .mockRejectedValueOnce(new Error("Some error"));

      // Act
      const response = await request(app).get("/all-vinyls");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });
  });

  describe("GET /vinyl", () => {
    it("should return vinyl details", async () => {
      // Arrange
      const mockVinylData = { id: "1", title: "Vinyl Title", price: 10 };
      jest
        .spyOn(rentalService, "fetchVinylData")
        .mockResolvedValueOnce(mockVinylData);

      // Act
      const response = await request(app)
        .get("/vinyl")
        .query({ title: "Vinyl Title" });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockVinylData);
    });

    it("should return a 400 error for invalid request parameters", async () => {
      // Act
      const response = await request(app).get("/vinyl");

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid request parameters" });
    });

    it("should return a 404 error if vinyl is not found", async () => {
      // Arrange
      jest.spyOn(rentalService, "fetchVinylData").mockResolvedValueOnce(null);

      // Act
      const response = await request(app)
        .get("/vinyl")
        .query({ title: "Nonexistent Vinyl" });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Vinyl not found" });
    });

    it("should return a 500 error for internal server error", async () => {
      // Arrange
      jest
        .spyOn(rentalService, "fetchVinylData")
        .mockRejectedValueOnce(new Error("Some error"));

      // Act
      const response = await request(app)
        .get("/vinyl")
        .query({ title: "Vinyl Title" });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });
  });

  describe("GET /by-artist", () => {
    it("should return vinyls by artist", async () => {
      // Arrange
      const mockVinylData = {
        id: "1",
        title: "Vinyl Title",
        artist: "Artist 1",
        price: 10,
      };
      jest
        .spyOn(rentalService, "fetchVinylsByArtist")
        .mockResolvedValueOnce(mockVinylData);

      // Act
      const response = await request(app)
        .get("/by-artist")
        .query({ artist: "Artist 1" });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockVinylData);
    });

    it("should return a 400 error for invalid request parameters", async () => {
      // Act
      const response = await request(app).get("/by-artist");

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid request parameters" });
    });

    it("should return a 404 error if vinyl is not found", async () => {
      // Arrange
      jest
        .spyOn(rentalService, "fetchVinylsByArtist")
        .mockResolvedValueOnce(null);

      // Act
      const response = await request(app)
        .get("/vinyl")
        .query({ title: "Nonexistent Vinyl" });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });

    it("should return a 500 error for internal server error", async () => {
      // Arrange
      jest
        .spyOn(rentalService, "fetchVinylsByArtist")
        .mockRejectedValueOnce(new Error("Some error"));

      // Act
      const response = await request(app)
        .get("/vinyl")
        .query({ artist: "Artist 1" });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid request parameters" });
    });
  });

  describe("GET /by-genre", () => {
    it("should return vinyls by genre", async () => {
      // Arrange
      const mockVinylData = {
        id: "1",
        title: "Vinyl Title",
        genre: "Genre 1",
        price: 10,
      };
      jest
        .spyOn(rentalService, "fetchVinylsByGenre")
        .mockResolvedValueOnce(mockVinylData);

      // Act
      const response = await request(app)
        .get("/by-genre")
        .query({ genre: "Genre 1" });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockVinylData);
    });

    it("should return a 400 error for invalid request parameters", async () => {
      // Act
      const response = await request(app).get("/by-genre");

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid request parameters" });
    });

    it("should return a 404 error if vinyl is not found", async () => {
      // Arrange
      jest
        .spyOn(rentalService, "fetchVinylsByGenre")
        .mockResolvedValueOnce(null);

      // Act
      const response = await request(app)
        .get("/vinyl")
        .query({ title: "Nonexistent Vinyl" });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });

    it("should return a 500 error for internal server error", async () => {
      // Arrange
      jest
        .spyOn(rentalService, "fetchVinylsByGenre")
        .mockRejectedValueOnce(new Error("Some error"));

      // Act
      const response = await request(app)
        .get("/vinyl")
        .query({ genre: "Genre 1" });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid request parameters" });
    });
  });
});
