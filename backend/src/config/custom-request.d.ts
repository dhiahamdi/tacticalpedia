import { Training } from "../interfaces/training/training";
import { User } from "../interfaces/user";

declare module 'express-serve-static-core' {
    interface Request {
      loggedUser?: User;
      training?: Training;

    }
}