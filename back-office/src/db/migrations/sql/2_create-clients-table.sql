CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE clients(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
  email VARCHAR(150) NOT NULL,
  password VARCHAR(150) NOT NULL,
  name VARCHAR(250) NULL,
  age integer,
  gender char(1),
  balance numeric(5,2) NOT NULL DEFAULT 0.00
);
