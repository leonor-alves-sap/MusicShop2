import { pool } from "../repository/connection";
const bcrypt = require("bcrypt");

const users = [
  {
    id: "fa3cac0f-0bdf-4b9f-914d-52ff7ff7b3f6",
    name: "admin",
    email: "admin@afcrichmond.com",
    password: "admin123",
  },
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "Roy Kent",
    email: "roy_kent@afcrichmond.com",
    password: "Phoebe123",
  },
  {
    id: "55d07b49-7d62-40ab-b660-0c581a045511",
    name: "Ted Lasso",
    email: "ted_lasso@afcrichmond.com",
    password: "Henry123",
  },
  {
    id: "a090d3f6-8ece-4d67-8505-3cc70cad6ae2",
    name: "Keeley Jones",
    email: "keeley_jones@afcrichmond.com",
    password: "KJPR123",
  },
  {
    id: "f7882553-b420-42ac-be1c-a5396c2edfc4",
    name: "Jamie Tartt",
    email: "jamie_tartt@afcrichmond.com",
    password: "ManCity",
  },
];

const vinyls = [
  {
    id: "83828892-5bd0-4677-8aeb-7fc7549640f8",
    title: "Americana",
    artist: "Offspring",
    genre: "Punk Rock",
    price: 1.99,
    stock: 5,
    entranceDate: new Date(),
  },
  {
    id: "4ceec7e5-c429-4d9a-a8cd-6436652fb562",
    title: "Smash",
    artist: "Offspring",
    genre: "Punk Rock",
    price: 1.99,
    stock: 5,
    entranceDate: new Date(),
  },
  {
    id: "ef01488d-50c3-40db-8dd8-d8afd56fdcab",
    title: "Siren Song of the Counter Culture",
    artist: "Rise Against",
    genre: "Punk Rock",
    price: 1.49,
    stock: 6,
    entranceDate: new Date(),
  },
  {
    id: "b301ed76-add6-4ea7-a67f-f72b64dfc6c5",
    title: "Royal Blood",
    artist: "Royal Blood",
    genre: "Rock",
    price: 1.49,
    stock: 6,
    entranceDate: new Date(),
  },
];

async function seedUsers(client: any) {
  try {
    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user: any) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.query(
          "INSERT INTO clients (id, name, email, password) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING;",
          [user.id, user.name, user.email, hashedPassword],
        );
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      users: insertedUsers,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedVinyls(client: any) {
  try {
    // Insert data into the "vinyls" table
    const insertedVinyls = await Promise.all(
      vinyls.map((vinyl: any) =>
        client.query(
          `
        INSERT INTO vinyls (vinyl_id, title, artist, genre, price, stock, entranceDate)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (vinyl_id) DO NOTHING;
      `,
          [
            vinyl.id,
            vinyl.title,
            vinyl.artist,
            vinyl.genre,
            vinyl.price,
            vinyl.stock,
            vinyl.entranceDate,
          ],
        ),
      ),
    );

    console.log(`Seeded ${insertedVinyls.length} vinyls`);

    return {
      vinyls: insertedVinyls,
    };
  } catch (error) {
    console.error("Error seeding vinyls:", error);
    throw error;
  }
}

async function seedDb() {
  const client = await pool.connect();

  // Check if the "clients" table is empty
  const clients = await client.query("SELECT * FROM clients");

  if (clients.rows.length > 0) {
    console.log("Database already seeded");
    return;
  }
  await seedUsers(client);
  await seedVinyls(client);
  console.log("Database seeded successfully");

  await client.release();
}

export { seedDb };
