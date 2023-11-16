import { pool } from "./connection";
import { Rental } from "../domain/entity/rental";

class RentalRepository {
  public async createRental(rental: Rental): Promise<void> {
    const client = await pool.connect();

    const client_id = rental.getClientId();
    const vinyl_id = rental.getVinylId();
    const rental_date = rental.getRentalDate();
    const return_date = rental.getReturnDate();

    try {
      await client.query(
        "INSERT INTO rentals (client_id, vinyl_id, rental_date, return_date) VALUES ($1, $2, $3, $4)",
        [client_id, vinyl_id, rental_date, return_date],
      );
    } catch (error) {
      console.error("Error creating a new rental:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Retrieve all rentals
  public async getAllRentals(): Promise<Rental[]> {
    const client = await pool.connect();

    try {
      const result = await client.query("SELECT * FROM rentals");
      return result.rows.map(
        rentalData =>
          new Rental(
            rentalData.client_id,
            rentalData.vinyl_id,
            rentalData.rental_date,
            rentalData.return_date,
          ),
      );
    } catch (error) {
      console.error("Error fetching all rentals:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Retrieve all rentals by Client
  public async getRentalsByClient(client_id: string): Promise<Rental[]> {
    const client = await pool.connect();

    try {
      const result = await client.query(
        "SELECT * FROM rentals WHERE client_id=$1",
        [client_id],
      );
      return result.rows.map(
        rentalData =>
          new Rental(
            rentalData.client_id,
            rentalData.vinyl_id,
            rentalData.rental_date,
            rentalData.return_date,
          ),
      );
    } catch (error) {
      console.error("Error fetching rentals by client:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async updateRentalByClient(
    email: string,
    rental: Rental,
  ): Promise<Rental | null> {
    const vinyl_id = rental.getVinylId();
    const rental_date = rental.getRentalDate();
    const return_date = rental.getReturnDate();
    const client = await pool.connect();

    try {
      await client.query(
        "UPDATE rentals SET rental_date=$1, return_date=$2 WHERE vinyl_id=$3 AND client_id=$4",
        [rental_date, return_date, vinyl_id, email],
      );
      return rental;
    } catch (error) {
      console.error("Error updating rental information:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export const rentalRepository = new RentalRepository();
