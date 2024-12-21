import jwt from 'jsonwebtoken'
import { envs } from './envs';

const JWT_SECRET = envs.JWT_SECRET_KEY

export const Jwt = {
  generateToken: (payload: any, duration: string = "2h") => {
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SECRET, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);

        resolve(token);
      });
    });
  },
  validateToken:<T>(token: string): Promise<T | null> => {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return resolve(null);

        resolve(payload as T);
      });
    });
  }
}