import { pool } from './connection';
import { Vinyl } from '../domain/entity/vinyl';

class VinylRepository {
  // Create a new vinyl
  public async createVinyl(vinyl: Vinyl): Promise<void> {
    const client = await pool.connect();

    const id = vinyl.getId();
    const artist = vinyl.getArtist();
    const genre = vinyl.getGenre();
    const title = vinyl.getTitle();
    const entranceDate = vinyl.getEntranceDate();
    const price = vinyl.getPrice();
    const stock = vinyl.getStock();

    try {
      await client.query(
        'INSERT INTO vinyls (vinyl_id, title, genre, artist, price, stock, entranceDate) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, title, genre, artist, price, stock, entranceDate]
      );
    } catch (error) {
      console.error('Error creating a new vinyl:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Retrieve all vinyls
  public async getAllVinyls(): Promise<Vinyl[]> {
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT * FROM vinyls');
      return result.rows.map((vinylData) => new Vinyl(
        vinylData.artist,
        vinylData.genre,
        vinylData.title,
        vinylData.entrancedate,
        vinylData.price,
        vinylData.stock,
        vinylData.vinyl_id
      ));
    } catch (error) {
      console.error('Error fetching all vinyls:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Retrieve all vinyls by Artist
  public async getVinylsByArtist(artist: string): Promise<Vinyl[]> {
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT * FROM vinyls WHERE artist=$1', [artist]);
      return result.rows.map((vinylData) => new Vinyl(
        vinylData.artist,
        vinylData.genre,
        vinylData.title,
        vinylData.entrancedate,
        vinylData.price,
        vinylData.stock,
        vinylData.vinyl_id
      ));
    } catch (error) {
      console.error('Error fetching vinyls by artist:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Retrieve all vinyls by Genre
  public async getVinylsByGenre(genre: string): Promise<Vinyl[]> {
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT * FROM vinyls WHERE genre=$1', [genre]);
      return result.rows.map((vinylData) => new Vinyl(
        vinylData.artist,
        vinylData.genre,
        vinylData.title,
        vinylData.entrancedate,
        vinylData.price,
        vinylData.stock,
        vinylData.vinyl_id
      ));
    } catch (error) {
      console.error('Error fetching vinyls by genre:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Retrieve vinyl by title
  public async getVinylByTitle(title: string): Promise<Vinyl | null> {
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT * FROM vinyls WHERE title = $1', [title]);

      if (result.rows.length === 0) {
        return null; // No vinyl found with the given title
      }

      const vinylData = result.rows[0];
      
      // Map the raw data to a Vinyl object
      const vinyl = new Vinyl(
        vinylData.artist,
        vinylData.genre,
        vinylData.title,
        vinylData.entrancedate,
        vinylData.price,
        vinylData.stock,
        vinylData.vinyl_id
      );
      return vinyl;
      
    } catch (error) {
      console.error('Error fetching vinyl by title:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Update vinyl information by title
  public async updateVinylByTitle(title: string, vinyl: Vinyl): Promise<Vinyl | null> {

    const id = vinyl.getId();
    const artist = vinyl.getArtist();
    const genre = vinyl.getGenre();
    const entranceDate = vinyl.getEntranceDate();
    const price = vinyl.getPrice();
    const stock = vinyl.getStock();

    const client = await pool.connect();

    try {
      await client.query(
        'UPDATE vinyls SET genre = $1, artist = $2, price = $3, stock = $4 WHERE title = $5',
        [genre, artist, price, stock, title]
      );
      return vinyl;
    } catch (error) {
      console.error('Error updating vinyl information:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Delete a vinyl by title
  public async deleteVinylByTitle(title: string): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query('DELETE FROM vinyls WHERE title = $1', [title]);
    } catch (error) {
      console.error('Error deleting vinyl by title:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export const vinylRepository = new VinylRepository();