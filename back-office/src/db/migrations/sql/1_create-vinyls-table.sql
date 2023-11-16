CREATE TABLE vinyls(
  vinyl_id VARCHAR(256) PRIMARY KEY NOT NULL,
  title VARCHAR(250) NOT NULL,
  artist VARCHAR(250) NOT NULL,
  genre VARCHAR(250) NOT NULL,
  price numeric(5,2) NOT NULL,
  stock integer NOT NULL,
  entranceDate TIMESTAMPTZ 
);
