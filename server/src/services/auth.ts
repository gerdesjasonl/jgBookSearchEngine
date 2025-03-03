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

export const authenticateToken = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new GraphQLError('Unauthorized', {
      extensions: {code: 'UNAUTHORIZED'},
    });
  }
  const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET_KEY || '';

    try {
      const decoded = jwt.verify(token, secretKey) as JwtPayload;
      return decoded;
    } catch (err) {
      throw new GraphQLError('Forbidden', {
        extensions: { code: 'FORBIDDEN' },
      })
    }
  };

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
