class Rental {
    client_id: string;
    vinyl_id: string;
    rental_date: Date;
    return_date?: Date;
  
    constructor(
        client_id: string,
        vinyl_id: string,
        rental_date: Date,
        return_date?: Date,
    ) {
      this.client_id = client_id;
      this.vinyl_id = vinyl_id;
      this.rental_date = rental_date;
      if (return_date !== undefined){
        this.return_date = return_date;
      }
      
    }

    getClientId(): string {
        return this.client_id;
    }

    getVinylId(): string {
        return this.vinyl_id;
    }

    getReturnDate(): Date | undefined {
        return this.return_date;
    }

    getRentalDate(): Date {
        return this.rental_date;
    }

    setClientId(client_id: string): void {
        this.client_id = client_id;
    }

    setVinylId(vinyl_id: string): void {
        this.vinyl_id = vinyl_id;
    }

    setReturnDate(return_date: Date): void {
        this.return_date = return_date;
    }

    setRentalDate(rental_date: Date): void {
        this.rental_date = rental_date;
    }

}

export { Rental };