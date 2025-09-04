import { Request } from 'express';

export interface UserPayload {
  userId: number;
  username: string;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
