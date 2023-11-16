CREATE TABLE rentals (
  rental_id SERIAL PRIMARY KEY,
  client_id VARCHAR(150),
  vinyl_id VARCHAR(256),
  rental_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  return_date TIMESTAMP,
  
  -- Define foreign key constraints
  FOREIGN KEY (client_id) REFERENCES clients(email),
  FOREIGN KEY (vinyl_id) REFERENCES vinyls(vinyl_id)
);
