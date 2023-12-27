export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  balance: number;
  gender: string;
};

export type Vinyl = {
  id: string;
  artist: string;
  genre: string;
  title: string;
  entranceDate: Date;
  price: number;
  stock: number;
};

export type Rental = {
  id: string;
  user: User;
  vinyl: Vinyl;
  rentalDate: Date;
  returnDate: Date;
};
