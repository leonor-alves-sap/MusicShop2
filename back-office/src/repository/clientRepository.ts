import { pool } from "./connection";
import { Client } from "../domain/entity/client";

class ClientRepository {
  public async createClient(client: Client): Promise<void> {
    const dbClient = await pool.connect();

    const name = client.getName();
    const email = client.getEmail();
    const password = client.getPassword();
    const age = client.getAge();
    const gender = client.getGender();
    const balance = client.getBalance();

    try {
      await dbClient.query(
        "INSERT INTO clients (name, email, password, age, gender, balance) VALUES ($1, $2, $3, $4, $5, $6)",
        [name, email, password, age, gender, balance],
      );
    } catch (error) {
      console.error("Error creating a new client:", error);
      throw error;
    } finally {
      dbClient.release();
    }
  }

  public async getAllClients(): Promise<Client[]> {
    const dbClient = await pool.connect();

    try {
      const result = await dbClient.query("SELECT * FROM clients");
      return result.rows.map(
        clientData =>
          new Client(
            clientData.name,
            clientData.email,
            clientData.password,
            clientData.age,
            clientData.gender,
            clientData.balance,
          ),
      );
    } catch (error) {
      console.error("Error fetching all clients:", error);
      throw error;
    } finally {
      dbClient.release();
    }
  }

  public async getClientByEmail(email: string): Promise<Client | null> {
    const dbClient = await pool.connect();

    try {
      const result = await dbClient.query(
        "SELECT * FROM clients WHERE email = $1",
        [email],
      );

      if (result.rows.length === 0) {
        return null; // No client found with the given email
      }

      const clientData = result.rows[0];

      return new Client(
        clientData.name,
        email,
        clientData.password,
        clientData.age,
        clientData.gender,
        clientData.balance,
      );
    } catch (error) {
      console.error("Error fetching client email:", error);
      throw error;
    } finally {
      dbClient.release();
    }
  }

  public async updateClientByEmail(
    email: string,
    updatedClient: Client,
  ): Promise<Client> {
    const dbClient = await pool.connect();

    const name = updatedClient.getName();
    const age = updatedClient.getAge();
    const gender = updatedClient.getGender();
    const balance = updatedClient.getBalance();

    try {
      await dbClient.query(
        "UPDATE clients SET name = $1, age = $2, gender = $3, balance = $4 WHERE email = $5",
        [name, age, gender, balance, email],
      );
      return updatedClient;
    } catch (error) {
      console.error("Error updating client information:", error);
      throw error;
    } finally {
      dbClient.release();
    }
  }

  public async updateClientBalanceByEmail(
    email: string,
    balance: number,
  ): Promise<void> {
    const dbClient = await pool.connect();

    try {
      await dbClient.query("UPDATE clients SET balance = $1 WHERE email = $2", [
        balance,
        email,
      ]);
    } catch (error) {
      console.error("Error updating client balance:", error);
      throw error;
    } finally {
      dbClient.release();
    }
  }

  public async deleteClientByEmail(email: string): Promise<void> {
    const dbClient = await pool.connect();

    try {
      await dbClient.query("DELETE FROM clients WHERE email = $1", [email]);
    } catch (error) {
      console.error("Error deleting client by email:", error);
      throw error;
    } finally {
      dbClient.release();
    }
  }
}

export const clientRepository = new ClientRepository();
