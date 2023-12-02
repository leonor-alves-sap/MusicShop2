CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE rentals (
  rental_id SERIAL PRIMARY KEY,
  client_id UUID DEFAULT uuid_generate_v4(),
  vinyl_id UUID DEFAULT uuid_generate_v4(),
  rental_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  return_date TIMESTAMP,
  
  -- Define foreign key constraints
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (vinyl_id) REFERENCES vinyls(vinyl_id)
);
