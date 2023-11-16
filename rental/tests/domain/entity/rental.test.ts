import { Rental } from "../../../src/domain/entity/rental";

describe("Rental Class Tests", () => {
  // Test constructor
  test("Rental constructor should create a rental object with the provided values", () => {
    const rentalDate = new Date();
    const returnDate = new Date();
    const rental = new Rental("client123", "vinyl456", rentalDate, returnDate);

    expect(rental.getClientId()).toBe("client123");
    expect(rental.getVinylId()).toBe("vinyl456");
    expect(rental.getRentalDate()).toBe(rentalDate);
    expect(rental.getReturnDate()).toBe(returnDate);
  });

  // Test getter and setter methods
  test("Getter and setter methods should work correctly", () => {
    const rental = new Rental("client123", "vinyl456", new Date());

    // Test getters
    expect(rental.getClientId()).toBe("client123");
    expect(rental.getVinylId()).toBe("vinyl456");
    expect(rental.getRentalDate()).toBeInstanceOf(Date);
    expect(rental.getReturnDate()).toBeUndefined();

    // Test setters
    rental.setClientId("newClient");
    rental.setVinylId("newVinyl");
    const newDate = new Date();
    rental.setRentalDate(newDate);
    rental.setReturnDate(newDate);

    expect(rental.getClientId()).toBe("newClient");
    expect(rental.getVinylId()).toBe("newVinyl");
    expect(rental.getRentalDate()).toBe(newDate);
    expect(rental.getReturnDate()).toBe(newDate);
  });
});
