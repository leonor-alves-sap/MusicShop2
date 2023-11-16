import { rentalRepository } from "../../src/repository/rentalRepository";
import { Rental } from "../../src//domain/entity/rental";
import { rentalService } from "../../src/services/rentalService";
import axios, { AxiosResponse, AxiosError } from "axios";
import { error } from "console";
import { InsufficientFundsError, NoStockError } from "../../src/domain/errors";

jest.mock("../../src/repository/connection", () => ({
  pool: {
    connect: jest.fn(),
  },
}));

jest.mock("axios");

describe("RentalService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchClientData", () => {
    it("fetches successfully data from an API", async () => {
      // Mock response for successful request
      const client_email = "test@example.com";
      const mockedClient = {
        name: "John Doe",
        email: "test@example.com",
        age: 30,
        gender: "M",
        balance: 0.0,
      };
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockedClient });

      // Act
      const result = await rentalService.fetchClientData(client_email);

      // Assert
      expect(result).toEqual(mockedClient);
      expect(axios.get).toHaveBeenCalledWith(
        "http://back-office:3000/api/clients/client",
        {
          params: { email: client_email },
        },
      );
    });
    it("handles errors when fetching client data from the API", async () => {
      // Arrange

      const client_email = "test@example.com";
      const errorMessage = "Network Error";
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      // Act and Assert
      await expect(
        rentalService.fetchClientData(client_email),
      ).rejects.toThrowError(`Error fetching client data: ${errorMessage}`);
      expect(axios.get).toHaveBeenCalledWith(
        "http://back-office:3000/api/clients/client",
        {
          params: { email: client_email },
        },
      );
    });
  });

  describe("updateClientBalance", () => {
    it("successfully updates client balance through an API", async () => {
      // Arrange
      const clientEmail = "test@example.com";
      const clientNewBalance = 10;
      const mockedResponse = {
        name: "John Doe",
        email: "test@example.com",
        age: 30,
        gender: "M",
        balance: 10,
      };
      (axios.patch as jest.Mock).mockResolvedValueOnce({
        data: mockedResponse,
      });

      // Act
      const result = await rentalService.updateClientBalance(
        clientEmail,
        clientNewBalance,
      );

      // Assert
      expect(result).toEqual(mockedResponse);
      expect(
        axios.patch,
      ).toHaveBeenCalledWith(
        "http://back-office:3000/api/clients/update-balance",
        { email: clientEmail, newBalance: clientNewBalance },
      );
    });

    it("handles errors when updating client balance through the API", async () => {
      // Arrange
      const clientEmail = "test@example.com";
      const clientNewBalance = 10;
      const errorMessage = "Network Error";
      (axios.patch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      // Act and Assert
      await expect(
        rentalService.updateClientBalance(clientEmail, clientNewBalance),
      ).rejects.toThrowError(`Error fetching client data: ${errorMessage}`);

      expect(
        axios.patch,
      ).toHaveBeenCalledWith(
        "http://back-office:3000/api/clients/update-balance",
        { email: clientEmail, newBalance: clientNewBalance },
      );
    });
  });

  describe("fetchAllVinyls", () => {
    it("successfully fetched all vinyls through an API", async () => {
      // Arrange
      const mockedResponse = [
        {
          id: "1",
          artist: "Artist 1",
          genre: "Rock",
          title: "Vinyl 1",
          entranceDate: "2022-01-01",
          price: 1.99,
          stock: 1,
        },
        {
          id: "2",

          artist: "Artist 2",
          genre: "Pop",
          title: "Vinyl 2",
          entranceDate: "2022-01-01",
          price: 1.99,
          stock: 1,
        },
        // Add more vinyl objects as needed
      ];
      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: mockedResponse,
      });

      // Act
      const result = await rentalService.fetchAllVinyls();

      // Assert
      expect(result).toEqual(mockedResponse);
      expect(axios.get).toHaveBeenCalledWith(
        "http://back-office:3000/api/vinyls/all-vinyls",
      );
    });

    it("handles errors when fetching all vinyls through the API", async () => {
      // Arrange
      const errorMessage = "Network Error";
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      // Act and Assert
      await expect(rentalService.fetchAllVinyls()).rejects.toThrowError(
        `Error fetching all vinyl data: ${errorMessage}`,
      );

      expect(axios.get).toHaveBeenCalledWith(
        "http://back-office:3000/api/vinyls/all-vinyls",
      );
    });
  });
});
