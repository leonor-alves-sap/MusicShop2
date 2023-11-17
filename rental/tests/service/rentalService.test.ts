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

  describe("fetchVinylData", () => {
    it("fetches vinyl data successfully from an API", async () => {
      // Mock response for successful request
      const title = "Americana";
      const mockedVinyl = {
        id: "d4fe213b-9ac5-44f9-8d92-826a8744ae6e",
        artist: "Offspring",
        genre: "Punk Rock",
        title: "Americana",
        entranceDate: "2023-11-14T15:30:00.000Z",
        price: "9.99",
        stock: 2,
      };
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockedVinyl });

      // Act
      const result = await rentalService.fetchVinylData(title);

      // Assert
      expect(result).toEqual(mockedVinyl);
      expect(axios.get).toHaveBeenCalledWith(
        "http://back-office:3000/api/vinyls/vinyl",
        {
          params: { title: title },
        },
      );
    });
    it("handles errors when fetching vinyl data from the API", async () => {
      // Arrange

      const title = "Americana";
      const errorMessage = "Network Error";
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      // Act and Assert
      await expect(rentalService.fetchVinylData(title)).rejects.toThrowError(
        `Error fetching vinyl data: ${errorMessage}`,
      );
      expect(axios.get).toHaveBeenCalledWith(
        "http://back-office:3000/api/vinyls/vinyl",
        {
          params: { title: title },
        },
      );
    });
  });
});

describe("fetchVinylsByArtist", () => {
  it("fetches vinyls by artist successfully from an API", async () => {
    // Mock response for successful request
    const artist = "Offspring";
    const mockedVinyl = [
      {
        id: "d4fe213b-9ac5-44f9-8d92-826a8744ae6e",
        artist: "Offspring",
        genre: "Punk Rock",
        title: "Americana",
        entranceDate: "2023-11-14T15:30:00.000Z",
        price: "9.99",
        stock: 2,
      },
      {
        id: "de776762-cd2c-473c-a5ff-0a198a348ddd",
        artist: "Offspring",
        genre: "Punk Rock",
        title: "Smash",
        entranceDate: "2023-11-13T15:30:00.000Z",
        price: "3.99",
        stock: 1,
      },
    ];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockedVinyl });

    // Act
    const result = await rentalService.fetchVinylsByArtist(artist);

    // Assert
    expect(result).toEqual(mockedVinyl);
    expect(axios.get).toHaveBeenCalledWith(
      "http://back-office:3000/api/vinyls/by-artist",
      {
        params: { artist: artist },
      },
    );
  });
  it("handles errors when fetching vinyl data from the API", async () => {
    // Arrange

    const artist = "Offspring";
    const errorMessage = "Network Error";
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    // Act and Assert
    await expect(
      rentalService.fetchVinylsByArtist(artist),
    ).rejects.toThrowError(
      `Error fetching vinyl data by artist: ${errorMessage}`,
    );
    expect(axios.get).toHaveBeenCalledWith(
      "http://back-office:3000/api/vinyls/by-artist",
      {
        params: { artist: artist },
      },
    );
  });

  describe("fetchVinylsByGenre", () => {
    it("fetches vinyls by genre successfully from an API", async () => {
      // Mock response for successful request
      const genre = "Punk Rock";
      const mockedVinyl = [
        {
          id: "d4fe213b-9ac5-44f9-8d92-826a8744ae6e",
          artist: "Offspring",
          genre: "Punk Rock",
          title: "Americana",
          entranceDate: "2023-11-14T15:30:00.000Z",
          price: "9.99",
          stock: 2,
        },
        {
          id: "de776762-cd2c-473c-a5ff-0a198a348ddd",
          artist: "Offspring",
          genre: "Punk Rock",
          title: "Smash",
          entranceDate: "2023-11-13T15:30:00.000Z",
          price: "3.99",
          stock: 1,
        },
      ];
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockedVinyl });

      // Act
      const result = await rentalService.fetchVinylsByGenre(genre);

      // Assert
      expect(result).toEqual(mockedVinyl);
      expect(axios.get).toHaveBeenCalledWith(
        "http://back-office:3000/api/vinyls/by-genre",
        {
          params: { genre: genre },
        },
      );
    });
    it("handles errors when fetching vinyl data from the API", async () => {
      // Arrange

      const genre = "Offspring";
      const errorMessage = "Network Error";
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      // Act and Assert
      await expect(
        rentalService.fetchVinylsByGenre(genre),
      ).rejects.toThrowError(
        `Error fetching vinyl data by genre: ${errorMessage}`,
      );
      expect(axios.get).toHaveBeenCalledWith(
        "http://back-office:3000/api/vinyls/by-genre",
        {
          params: { genre: genre },
        },
      );
    });
  });

  describe("updateVinylPrice", () => {
    it("successfully updates vinyl price through an API", async () => {
      // Arrange
      const title = "Americana";
      const newPrice = 10;
      const mockedResponse = {
        id: "d4fe213b-9ac5-44f9-8d92-826a8744ae6e",
        artist: "Offspring",
        genre: "Punk Rock",
        title: "Americana",
        entranceDate: "2023-11-14T15:30:00.000Z",
        price: "9.99",
        stock: 2,
      };
      (axios.patch as jest.Mock).mockResolvedValueOnce({
        data: mockedResponse,
      });

      // Act
      const result = await rentalService.updateVinylPrice(title, newPrice);

      // Assert
      expect(result).toEqual(mockedResponse);
      expect(
        axios.patch,
      ).toHaveBeenCalledWith(
        "http://back-office:3000/api/vinyls/update-price",
        { title: title, newPrice: newPrice },
      );
    });

    it("handles errors when updating vinyl price through the API", async () => {
      // Arrange
      const title = "Americana";
      const newPrice = 10;
      const errorMessage = "Network Error";
      (axios.patch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      // Act and Assert
      await expect(
        rentalService.updateVinylPrice(title, newPrice),
      ).rejects.toThrowError(`Error updating vinyl price: ${errorMessage}`);

      expect(
        axios.patch,
      ).toHaveBeenCalledWith(
        "http://back-office:3000/api/vinyls/update-price",
        { title: title, newPrice: newPrice },
      );
    });
  });

  describe("updateVinylStock", () => {
    it("successfully updates vinyl stock through an API", async () => {
      // Arrange
      const title = "Americana";
      const newStock = 10;
      const mockedResponse = {
        id: "d4fe213b-9ac5-44f9-8d92-826a8744ae6e",
        artist: "Offspring",
        genre: "Punk Rock",
        title: "Americana",
        entranceDate: "2023-11-14T15:30:00.000Z",
        price: "9.99",
        stock: 2,
      };
      (axios.patch as jest.Mock).mockResolvedValueOnce({
        data: mockedResponse,
      });

      // Act
      const result = await rentalService.updateVinylStock(title, newStock);

      // Assert
      expect(result).toEqual(mockedResponse);
      expect(
        axios.patch,
      ).toHaveBeenCalledWith(
        "http://back-office:3000/api/vinyls/update-stock",
        { title: title, newStock: newStock },
      );
    });

    it("handles errors when updating vinyl stock through the API", async () => {
      // Arrange
      const title = "Americana";
      const newStock = 10;
      const errorMessage = "Network Error";
      (axios.patch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      // Act and Assert
      await expect(
        rentalService.updateVinylStock(title, newStock),
      ).rejects.toThrowError(`Error updating vinyl stock: ${errorMessage}`);

      expect(
        axios.patch,
      ).toHaveBeenCalledWith(
        "http://back-office:3000/api/vinyls/update-stock",
        { title: title, newStock: newStock },
      );
    });
  });
  describe("findRentalByVinylId", () => {
    it("returns the rental when the vinyl_id is found", () => {
      // Arrange
      const rentals: Rental[] = [
        new Rental(
          "client1",
          "1",
          new Date("2022-01-01"),
          new Date("2022-02-01"),
        ),
        new Rental("client1", "2", new Date("2022-02-01")),
      ];

      // Act
      const result = rentalService.findRentalByVinylId(rentals, "2");

      // Assert
      expect(result).toEqual(rentals[1]);
    });

    it("throws an error when vinylId is not found", () => {
      // Arrange
      const rentals = [
        new Rental(
          "test@example.com",
          "1",
          new Date("2022-01-01"),
          new Date("2022-02-01"),
        ),
        new Rental("test@example.com", "2", new Date("2022-02-01"), new Date()),
      ];
      const nonExistentVinylId = "3";

      // Act and Assert
      expect(() =>
        rentalService.findRentalByVinylId(rentals, nonExistentVinylId),
      ).toThrowError(`No rental found for vinylId: ${nonExistentVinylId}`);
    });
  });
  describe("checkIfSufficientFunds", () => {
    it("returns true if client has sufficient funds", () => {
      // Arrange
      const clientData = { balance: 10 };
      const vinylData = { price: 5 };

      // Act
      const result = rentalService.checkIfSufficientFunds(
        clientData,
        vinylData,
      );

      // Assert
      expect(result).toBe(true);
    });

    it("returns false if client does not have sufficient funds", () => {
      // Arrange
      const clientData = { balance: 5 };
      const vinylData = { price: 10 };

      // Act
      const result = rentalService.checkIfSufficientFunds(
        clientData,
        vinylData,
      );

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("rentVinyl", () => {
    it("rents a vinyl successfully", async () => {
      // Arrange
      const email = "test@example.com";
      const title = "Vinyl Title";
      const clientData = { email: email, balance: 20 };
      const vinylData = { id: "1", title: "Vinyl Title", price: 10, stock: 1 };

      // Mock dependencies
      // Mock fetchClientData
      jest
        .spyOn(rentalService, "fetchClientData")
        .mockResolvedValueOnce(clientData);

      // Mock fetchVinylData
      jest
        .spyOn(rentalService, "fetchVinylData")
        .mockResolvedValueOnce(vinylData);

      // Mock checkIfSufficientFunds
      jest
        .spyOn(rentalService, "checkIfSufficientFunds")
        .mockReturnValueOnce(true);

      // Mock updateClientBalance
      jest
        .spyOn(rentalService, "updateClientBalance")
        .mockResolvedValueOnce({});

      // Mock updateVinylStock
      jest.spyOn(rentalService, "updateVinylStock").mockResolvedValueOnce({});

      // Mock createRental
      jest.spyOn(rentalRepository, "createRental").mockResolvedValueOnce();

      // Act
      const result = await rentalService.rentVinyl(email, title);

      // Assert
      expect(result).toEqual({});
      expect(rentalService.fetchVinylData).toHaveBeenCalledWith(title);
      expect(rentalService.fetchClientData).toHaveBeenCalledWith(email);
      expect(rentalService.updateVinylStock).toHaveBeenCalledWith(title, -1);
      expect(rentalService.updateClientBalance).toHaveBeenCalledWith(
        email,
        -vinylData.price,
      );
    });

    it("throws an InsufficientFundsError when the client has insufficient funds", async () => {
      // Arrange
      const email = "test@example.com";
      const title = "Vinyl Title";
      const clientData = { email, balance: 5 };
      const vinylData = { id: "1", title: "Vinyl Title", price: 10, stock: 1 };

      // Mock dependencies
      (rentalService.fetchClientData as jest.Mock).mockResolvedValueOnce(
        clientData,
      );
      (rentalService.fetchVinylData as jest.Mock).mockResolvedValueOnce(
        vinylData,
      );
      (rentalService.checkIfSufficientFunds as jest.Mock).mockReturnValueOnce(
        false,
      );

      // Act and Assert
      await expect(rentalService.rentVinyl(email, title)).rejects.toThrowError(
        InsufficientFundsError,
      );
    });

    it("throws a NoStockError when there is no stock available", async () => {
      // Arrange
      const email = "test@example.com";
      const title = "Vinyl Title";
      const clientData = { email, balance: 20 };
      const vinylData = { id: "1", title: "Vinyl Title", price: 10, stock: 0 };

      // Mock dependencies
      (rentalService.fetchClientData as jest.Mock).mockResolvedValueOnce(
        clientData,
      );
      (rentalService.fetchVinylData as jest.Mock).mockResolvedValueOnce(
        vinylData,
      );
      (rentalService.checkIfSufficientFunds as jest.Mock).mockReturnValueOnce(
        true,
      );

      // Act and Assert
      await expect(rentalService.rentVinyl(email, title)).rejects.toThrowError(
        NoStockError,
      );
    });

    it("throws an error when an unexpected error occurs", async () => {
      // Arrange
      const email = "test@example.com";
      const title = "Vinyl Title";
      const clientData = { email, balance: 20 };
      const vinylData = { id: "1", title: "Vinyl Title", price: 10, stock: 1 };

      // Mock dependencies
      (rentalService.fetchClientData as jest.Mock).mockResolvedValueOnce(
        clientData,
      );
      (rentalService.fetchVinylData as jest.Mock).mockResolvedValueOnce(
        vinylData,
      );
      (rentalService.checkIfSufficientFunds as jest.Mock).mockReturnValueOnce(
        true,
      );
      (rentalService.updateClientBalance as jest.Mock).mockRejectedValueOnce(
        new Error("Some unexpected error"),
      );

      // Act and Assert
      await expect(rentalService.rentVinyl(email, title)).rejects.toThrowError(
        "Error renting vinyl: Some unexpected error",
      );
    });
  });

  describe("returnVinyl", () => {
    it("returns a vinyl successfully", async () => {
      // Arrange
      const email = "test@example.com";
      const title = "Vinyl Title";
      const vinylData = { id: "1", title: "Vinyl Title", price: 10, stock: 1 };
      const rentals = [
        new Rental(
          "test@example.com",
          "1",
          new Date("2022-01-01"),
          new Date("2022-02-01"),
        ),
        new Rental("test@example.com", "3", new Date("2022-02-01"), new Date()),
      ];

      // Mock dependencies
      jest
        .spyOn(rentalService, "fetchVinylData")
        .mockResolvedValueOnce(vinylData);
      jest.spyOn(rentalService, "updateVinylStock").mockResolvedValueOnce({});
      jest
        .spyOn(rentalRepository, "getRentalsByClient")
        .mockResolvedValueOnce(rentals);
      jest
        .spyOn(rentalService, "findRentalByVinylId")
        .mockReturnValueOnce(rentals[0]);

      jest
        .spyOn(rentalRepository, "updateRentalByClient")
        .mockResolvedValueOnce(rentals[0]);
      // Act
      await rentalService.returnVinyl(email, title);

      // Assert
      // Add assertions based on the expected behavior of your function
      // For example, you might want to check that fetchVinylData, updateVinylStock, etc., were called with the correct arguments
      expect(rentalService.fetchVinylData).toHaveBeenCalledWith(title);
      expect(rentalService.updateVinylStock).toHaveBeenCalledWith(title, 1);
      expect(rentalRepository.getRentalsByClient).toHaveBeenCalledWith(email);
      expect(rentalService.findRentalByVinylId).toHaveBeenCalledWith(
        rentals,
        vinylData.id,
      );
      // Add more assertions as needed
    });

    it("handles errors appropriately", async () => {
      // Arrange
      // Mock dependencies to simulate an error scenario
      jest
        .spyOn(rentalService, "fetchVinylData")
        .mockRejectedValueOnce(new Error("Error returning vinyl: Fetch error"));

      // Act and Assert
      await expect(
        rentalService.returnVinyl("test@example.com", "Vinyl Title"),
      ).rejects.toThrowError("Error returning vinyl: Fetch error");
    });
  });
});
