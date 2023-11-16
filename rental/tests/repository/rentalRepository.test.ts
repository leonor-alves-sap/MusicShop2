// rentalRepository.test.ts

import { rentalRepository } from "../../src/repository/rentalRepository";
import { Rental } from "../../src/domain/entity/rental";
import { pool } from "../../src/repository/connection";

jest.mock("../../src/repository/connection", () => ({
  pool: {
    connect: jest.fn(),
  },
}));

describe("RentalRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createRental", () => {
    it("should create a rental in the database", async () => {
      // Arrange
      const mockQuery = jest.fn();
      const mockRelease = jest.fn();
      const mockClient = {
        query: mockQuery,
        release: mockRelease,
      };
      (pool.connect as jest.Mock).mockResolvedValue(mockClient);

      const rental = new Rental(
        "client123",
        "vinyl456",
        new Date(),
        new Date(),
      );

      // Act
      await rentalRepository.createRental(rental);

      // Assert
      expect(pool.connect).toHaveBeenCalled();
      expect(
        mockQuery,
      ).toHaveBeenCalledWith(
        "INSERT INTO rentals (client_id, vinyl_id, rental_date, return_date) VALUES ($1, $2, $3, $4)",
        ["client123", "vinyl456", expect.any(Date), expect.any(Date)],
      );
      expect(mockRelease).toHaveBeenCalled();
    });
  });

  it("should handle errors when creating a rental", async () => {
    // Arrange
    const mockConnect = jest.fn();
    (pool.connect as jest.Mock).mockRejectedValue(
      new Error("Database connection error"),
    );

    const rental = new Rental("client123", "vinyl456", new Date(), new Date());

    // Act and Assert
    await expect(rentalRepository.createRental(rental)).rejects.toThrowError(
      "Database connection error",
    );

    // Ensure that pool.connect is called even if an error occurs
    expect(pool.connect).toHaveBeenCalled();
  });

  describe("getAllRentals", () => {
    it("should retrieve all rentals from the database", async () => {
      // Arrange
      const mockQuery = jest.fn();
      const mockRelease = jest.fn();
      const mockClient = {
        query: mockQuery,
        release: mockRelease,
      };
      (pool.connect as jest.Mock).mockResolvedValue(mockClient);

      const expectedRentals = [
        new Rental("client123", "vinyl456", new Date(), new Date()),
        new Rental("client0", "vinyl1", new Date(), new Date()),
      ];

      // Mock the query result with the expected rentals
      mockQuery.mockResolvedValue({
        rows: expectedRentals.map(rental => ({
          client_id: rental.getClientId(),
          vinyl_id: rental.getVinylId(),
          rental_date: rental.getRentalDate(),
          return_date: rental.getReturnDate(),
        })),
      });

      // Act
      const result = await rentalRepository.getAllRentals();

      // Assert
      expect(pool.connect).toHaveBeenCalled();
      expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM rentals");
      expect(result).toEqual(expectedRentals);
      expect(mockRelease).toHaveBeenCalled();
    });

    it("should handle errors when fetching all rentals", async () => {
      // Arrange
      const mockConnect = jest.fn();
      (pool.connect as jest.Mock).mockRejectedValue(
        new Error("Database connection error"),
      );

      // Act and Assert
      await expect(rentalRepository.getAllRentals()).rejects.toThrowError(
        "Database connection error",
      );

      // Ensure that pool.connect is called even if an error occurs
      expect(pool.connect).toHaveBeenCalled();
    });
  });

  describe("getRentalsByClient", () => {
    it("should retrieve rentals by client ID from the database", async () => {
      // Arrange
      const mockQuery = jest.fn();
      const mockRelease = jest.fn();
      const mockClient = {
        query: mockQuery,
        release: mockRelease,
      };
      (pool.connect as jest.Mock).mockResolvedValue(mockClient);

      const client_id = "client123";

      const expectedRentals = [
        new Rental("client123", "vinyl456", new Date(), new Date()),
        // Add more Rental instances as needed...
      ];

      // Mock the query result with the expected rentals
      mockQuery.mockResolvedValue({
        rows: expectedRentals.map(rental => ({
          client_id: rental.getClientId(),
          vinyl_id: rental.getVinylId(),
          rental_date: rental.getRentalDate(),
          return_date: rental.getReturnDate(),
        })),
      });

      // Act
      const result = await rentalRepository.getRentalsByClient(client_id);

      // Assert
      expect(pool.connect).toHaveBeenCalled();
      expect(
        mockQuery,
      ).toHaveBeenCalledWith("SELECT * FROM rentals WHERE client_id=$1", [
        client_id,
      ]);
      expect(result).toEqual(expectedRentals);
      expect(mockRelease).toHaveBeenCalled();
    });

    it("should handle errors when fetching rentals by client", async () => {
      // Arrange
      const mockConnect = jest.fn();
      (pool.connect as jest.Mock).mockRejectedValue(
        new Error("Database connection error"),
      );

      const client_id = "client123";

      // Act and Assert
      await expect(
        rentalRepository.getRentalsByClient(client_id),
      ).rejects.toThrowError("Database connection error");

      // Ensure that pool.connect is called even if an error occurs
      expect(pool.connect).toHaveBeenCalled();
    });
  });

  describe("updateRentalsByClient", () => {
    it("should update the rental by client ID in the database", async () => {
      // Arrange
      const mockQuery = jest.fn();
      const mockRelease = jest.fn();
      const mockClient = {
        query: mockQuery,
        release: mockRelease,
      };
      (pool.connect as jest.Mock).mockResolvedValue(mockClient);

      const client_id = "client123";
      const rental = new Rental(
        "client123",
        "vinyl456",
        new Date(),
        new Date(),
      );

      // Mock the query result for successful update
      mockQuery.mockResolvedValue({
        rowCount: 1, // Indicates that one row was updated
      });

      // Act
      const result = await rentalRepository.updateRentalByClient(
        client_id,
        rental,
      );

      // Assert
      expect(pool.connect).toHaveBeenCalled();
      expect(
        mockQuery,
      ).toHaveBeenCalledWith(
        "UPDATE rentals SET rental_date=$1, return_date=$2 WHERE vinyl_id=$3 AND client_id=$4",
        [
          rental.getRentalDate(),
          rental.getReturnDate(),
          rental.getVinylId(),
          client_id,
        ],
      );
      expect(result).toEqual(rental);
      expect(mockRelease).toHaveBeenCalled();
    });

    it("should handle errors when fetching rentals by client", async () => {
      // Arrange
      const mockConnect = jest.fn();
      (pool.connect as jest.Mock).mockRejectedValue(
        new Error("Database connection error"),
      );

      const client_id = "client123";
      const rental = new Rental(
        "client123",
        "vinyl456",
        new Date(),
        new Date(),
      );

      // Act and Assert
      await expect(
        rentalRepository.updateRentalByClient(client_id, rental),
      ).rejects.toThrowError("Database connection error");

      // Ensure that pool.connect is called even if an error occurs
      expect(pool.connect).toHaveBeenCalled();
    });
  });
});
