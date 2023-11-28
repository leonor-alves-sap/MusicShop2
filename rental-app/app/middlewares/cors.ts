// middlewares/cors.ts

import { NextResponse } from 'next/server';

const allowedOrigins = ['http://rental-frontend:3000', 'http://localhost:3000']; // Replace with your actual client domain

export function corsMiddleware() {
  const origin = '*'; // You can replace this with your actual origin logic

  // retrieve the current response
  const res = NextResponse.next();

  // if the origin is an allowed one,
  // add it to the 'Access-Control-Allow-Origin' header
  if (allowedOrigins.includes(origin)) {
    res.headers.append('Access-Control-Allow-Origin', origin);
  }

  // add the CORS headers to the response
  res.headers.append('Access-Control-Allow-Credentials', 'true');
  res.headers.append(
    'Access-Control-Allow-Methods',
    'GET,DELETE,PATCH,POST,PUT',
  );
  res.headers.append(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  return res;
}
