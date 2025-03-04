import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { Request } from 'express';

dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

// Helper function to extract the token from Authorization header
const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;

  // Ensure the header follows "Bearer <token>" format
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return null;
  }

  return tokenParts[1];
};

export const authenticateToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  if (!authHeader) {
    throw new GraphQLError('Unauthorized', {
      extensions: {code: 'UNAUTHORIZED'},
    });
  }

    const secretKey = process.env.JWT_SECRET_KEY || '';

    try {
      if (!token) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }
      const decoded = jwt.verify(token, secretKey) as unknown as JwtPayload;
      return decoded;
    } catch (err) {
      throw new GraphQLError('Forbidden', {
        extensions: { code: 'FORBIDDEN' },
      });
    }
  };

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
