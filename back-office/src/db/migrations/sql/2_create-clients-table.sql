CREATE TABLE clients(
  email VARCHAR(150) PRIMARY KEY NOT NULL,
  name VARCHAR(250) NOT NULL,
  age integer,
  gender char(1),
  balance numeric(5,2) NOT NULL DEFAULT 0.00
);

