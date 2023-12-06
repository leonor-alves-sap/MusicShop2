import { clientRepository } from "../repository/clientRepository";
import { Client } from "../domain/entity/client";

class ClientService {
  public async updateClientBalance(
    email: string,
    newBalance: number,
  ): Promise<Client | null> {
    const clientPromise: Promise<Client | null> = clientRepository.getClientByEmail(
      email,
    );
    const existingClient = await clientPromise;

    if (!existingClient) {
      // Handle the case where the client with the given email is not found
      throw new Error("Client not found");
      return null;
    }

    const updatedClient = new Client(
      existingClient.id,
      existingClient.name,
      email,
      existingClient.password,
      existingClient.age,
      existingClient.gender,
      Number(existingClient.balance) + Number(newBalance), // Update the balance with the new value
    );

    await clientRepository.updateClientByEmail(email, updatedClient);
    return updatedClient;
  }

  public async insertClient(client: Client): Promise<Client | null> {
    const clientPromise: Promise<Client | null> = clientRepository.getClientByEmail(
      client.getEmail(),
    );
    const existingClient = await clientPromise;

    if (existingClient) {
      // Handle the case where the client with the given email is not found
      throw new Error("Client Already Exists");
    } else {
      await clientRepository.createClient(client);
      return client;
    }
  }
}

export const clientService = new ClientService();
