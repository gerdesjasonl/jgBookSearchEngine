import { Request, Response } from 'express';

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
}

export interface GraphQLContext {
  req: Request;
  res: Response;
  user: {_id: string; username: string; email: string} | null;
}