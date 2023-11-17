import { rentalRepository } from "../repository/rentalRepository";
import { Rental } from "../domain/entity/rental";
import axios, { AxiosResponse, AxiosError } from "axios";
import { error } from "console";
import { InsufficientFundsError, NoStockError } from "../domain/errors";

class RentalService {
  private readonly BACK_OFFICE_API_CLIENTS_URL =
    "http://back-office:3000/api/clients";
  private readonly BACK_OFFICE_API_VINYLS_URL =
    "http://back-office:3000/api/vinyls";

  // Client functions
  async fetchClientData(client_email: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.BACK_OFFICE_API_CLIENTS_URL}/client`,
        { params: { email: client_email } },
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching client data: ${error.message}`);
      }
    }
  }

  async updateClientBalance(clientEmail: string, clientNewBalance: number) {
    try {
      const response = await axios.patch(
        `${this.BACK_OFFICE_API_CLIENTS_URL}/update-balance`,
        { email: clientEmail, newBalance: clientNewBalance },
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching client data: ${error.message}`);
      }
    }
  }

  // Vinyl Functions
  async fetchAllVinyls() {
    try {
      const response = await axios.get(
        `${this.BACK_OFFICE_API_VINYLS_URL}/all-vinyls`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching all vinyl data: ${error.message}`);
      }
    }
  }

  async fetchVinylData(title: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.BACK_OFFICE_API_VINYLS_URL}/vinyl`,
        { params: { title: title } },
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching vinyl data: ${error.message}`);
      }
    }
  }

  async fetchVinylsByArtist(artist: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.BACK_OFFICE_API_VINYLS_URL}/by-artist`,
        { params: { artist: artist } },
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error fetching vinyl data by artist: ${error.message}`,
        );
      }
    }
  }

  async fetchVinylsByGenre(genre: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.BACK_OFFICE_API_VINYLS_URL}/by-genre`,
        { params: { genre: genre } },
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching vinyl data by genre: ${error.message}`);
      }
    }
  }

  async updateVinylPrice(vinylTitle: string, vinylPrice: number) {
    try {
      const response = await axios.patch(
        `${this.BACK_OFFICE_API_VINYLS_URL}/update-price`,
        { title: vinylTitle, newPrice: vinylPrice },
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating vinyl price: ${error.message}`);
      }
    }
  }

  async updateVinylStock(vinylTitle: string, vinylStock: number) {
    try {
      const response = await axios.patch(
        `${this.BACK_OFFICE_API_VINYLS_URL}/update-stock`,
        { title: vinylTitle, newStock: vinylStock },
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating vinyl stock: ${error.message}`);
      }
    }
  }

  checkIfSufficientFunds(client_data: any, vinyl_data: any): boolean {
    return Number(client_data.balance) > Number(vinyl_data.price);
  }

  async rentVinyl(email: string, title: string): Promise<any> {
    const client_data = await this.fetchClientData(email);
    const vinyl_data = await this.fetchVinylData(title);

    if (this.checkIfSufficientFunds(client_data, vinyl_data) === false) {
      throw new InsufficientFundsError(
        "You have insufficient funds to rent this vinyl.",
      );
    }
    if (vinyl_data.stock === 0) {
      throw new NoStockError("There's no copy of this vinyl in stock.");
    }

    try {
      // Update Client Balance
      const updatedClient = await this.updateClientBalance(
        email,
        -vinyl_data.price,
      );

      // Update Stock
      await this.updateVinylStock(title, -1);

      // Create a rental event
      const rental = new Rental(client_data.email, vinyl_data.id, new Date());
      rentalRepository.createRental(rental);
      return updatedClient;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error renting vinyl: ${error.message}`);
      }
    }
  }

  // Function to search for a specific vinyl_id
  findRentalByVinylId(rentals: Rental[], vinylId: string): Rental {
    const foundRental = rentals.find(rental => rental.vinyl_id === vinylId);

    if (!foundRental) {
      throw new Error(`No rental found for vinylId: ${vinylId}`);
    }

    return foundRental;
  }

  async returnVinyl(email: string, title: string): Promise<void> {
    const vinyl_data = await this.fetchVinylData(title);

    try {
      // Update Stock
      await this.updateVinylStock(title, 1);

      // Update rental event
      const rentals = await rentalRepository.getRentalsByClient(email);
      var rental = this.findRentalByVinylId(rentals, vinyl_data.id);

      rental.setReturnDate(new Date());
      rentalRepository.updateRentalByClient(email, rental);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error returning vinyl: ${error.message}`);
      }
    }
  }
}

export const rentalService = new RentalService();
