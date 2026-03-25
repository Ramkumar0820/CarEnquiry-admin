import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode("chendanvasu");

export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(SECRET);
}

export async function verifyToken(token) {
  return await jwtVerify(token, SECRET);
}
