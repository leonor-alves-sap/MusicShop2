CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE vinyls(
  vinyl_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
  title VARCHAR(250) NOT NULL,
  artist VARCHAR(250) NOT NULL,
  genre VARCHAR(250) NOT NULL,
  price numeric(5,2) NOT NULL,
  stock integer NOT NULL,
  entranceDate TIMESTAMPTZ 
);
