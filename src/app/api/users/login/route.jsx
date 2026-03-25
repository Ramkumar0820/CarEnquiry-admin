// Import necessary modules
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose'; // Import the SignJWT class from jose

const SECRET_KEY = new TextEncoder().encode('chendanvasu'); // Use TextEncoder to encode the secret key

export async function POST(request) {
  const { email, password } = await request.json();

  const correctEmail = process.env.ADMIN_ID;
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (email === correctEmail && password === correctPassword) {
    try {
      // Create a JWT token
      const token = await new SignJWT({ email })
        .setProtectedHeader({ alg: 'HS256' }) // Set algorithm header
        .setExpirationTime('1d') // Token valid for 1 day
          .setIssuedAt() // Set the issued time
        .sign(SECRET_KEY);
      // Create a response object
      const response = NextResponse.json({ success: true, message: 'Login successful!' }, { status: 200 });
      // Set a cookie with the JWT token
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        maxAge: 60 * 60 * 24, // 1 day in seconds
        path: '/',
      });

      return response;
    } catch (error) {
      console.error('Error signing JWT:', error.message);
      console.error('Stack trace:', error.stack);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }
}
