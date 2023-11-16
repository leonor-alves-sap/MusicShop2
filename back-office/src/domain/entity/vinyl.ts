import { v4 as uuidv4 } from 'uuid';

class Vinyl {
    id: string;
    artist: string;
    genre: string;
    title: string;
    entranceDate: Date;
    price: number;
    stock: number;
  
    constructor(
      artist: string,
      genre: string,
      title: string,
      entranceDate: Date,
      price: number,
      stock: number,
      id: string,
    ) {
      this.id = id;
      this.artist = artist;
      this.genre = genre;
      this.title = title;
      this.entranceDate = entranceDate;
      this.price = price;
      this.stock = stock;
    }
  
    // Getter methods
    getId(): string {
        return this.id;
    }
    getArtist(): string {
      return this.artist;
    }
    getGenre(): string {
      return this.genre;
    }
    getTitle(): string {
      return this.title;
    }
    getEntranceDate(): Date {
      return this.entranceDate;
    }
    getPrice(): number {
      return this.price;
    }
    getStock(): number {
      return this.stock;
    }

    // Setter methods
    setId(id: string): void{
      this.id = id;
    }
    setArtist(artist: string): void {
        this.artist = artist;
    }
    setGenre(genre: string): void {
        this.genre = genre;
    }
    setTitle(title: string): void {
        this.title = title;
    }
    setEntranceDate(entranceDate: Date): void {
        this.entranceDate = entranceDate;
    }
    setPrice(price: number): void {
        this.price = price;
    }
    setStock(stock: number): void {
        this.stock = stock;
    }
}

export { Vinyl };