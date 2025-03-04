import { Request, Response } from 'express';
import mongoose from 'mongoose';

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
}

export interface GraphQLContext {
    req: Request;
    res: Response;
    user: {
      _id: string;
      username: string;
      email: string;
    } | null;
    primaryConnection: mongoose.Connection;
    secondaryConnection: mongoose.Connection;
  }
