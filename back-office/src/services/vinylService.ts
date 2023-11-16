import { vinylRepository } from '../repository/vinylRepository';
import { Vinyl } from '../domain/entity/vinyl'


class VinylService{

public async insertVinyl(vinyl: Vinyl): Promise<Vinyl | null> {

    const vinylPromise: Promise<Vinyl | null> = vinylRepository.getVinylByTitle(vinyl.getTitle());
    const existingVinyl = await vinylPromise;

    if (existingVinyl) {
      // Handle the case where the vinyl with the given title is not found
      throw new Error('Vinyl Already Exists');
    } else {
        await vinylRepository.createVinyl(vinyl);
        return vinyl;
    }
}

public async updateVinylPrice(title: string, newPrice: number): Promise<Vinyl | null>{

    const vinylPromise: Promise<Vinyl | null> = vinylRepository.getVinylByTitle(title);
    const existingVinyl = await vinylPromise;

    if (!existingVinyl) {
      // Handle the case where the vinyl with the given title is not found
      throw new Error('Vinyl not found');
      return null;
    }
  
    const updatedVinyl = new Vinyl(
      existingVinyl.getArtist(),
      existingVinyl.getGenre(),
      title,
      existingVinyl.getEntranceDate(),
      newPrice, // Update the price with the new value
      existingVinyl.getStock(),
      existingVinyl.getId()
    );
  
    await vinylRepository.updateVinylByTitle(title, updatedVinyl);
    return updatedVinyl;
}

public async updateVinylStock(title: string, newStock: number): Promise<Vinyl | null> {

    const vinylPromise: Promise<Vinyl | null> = vinylRepository.getVinylByTitle(title);
    const existingVinyl = await vinylPromise;
    if (!existingVinyl) {
      // Handle the case where the vinyl with the given title is not found
      throw new Error('Vinyl not found');
      return null;
    }

    const updatedVinyl = new Vinyl(
        existingVinyl.getArtist(),
        existingVinyl.getGenre(),
        title,
        existingVinyl.getEntranceDate(),
        existingVinyl.getPrice(), 
        Number(existingVinyl.getStock()) + Number(newStock),// Update the stock with the new value
        existingVinyl.getId());
  
    await vinylRepository.updateVinylByTitle(title, updatedVinyl);
    return updatedVinyl;
}

}

export const vinylService = new VinylService();