import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users.dto';
import { RequestWithUser } from '../interfaces/auth.interface';
import { RedesignedUser, User } from '../interfaces/users.interface';
import AuthService from '../services/auth.service';
import { UserWithSessionKey, AuthLoginResponse } from 'types-cas';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const signUpUserData: RedesignedUser = await this.authService.signup(userData);
      const userWithSession: UserWithSessionKey = await this.authService.createSession(signUpUserData, true);
      res.status(201).json({ data: userWithSession, message: 'signup' });
    } catch (error) {
      next(error);
    }
  }

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const findUser: RedesignedUser = await this.authService.login(userData);
      const userWithSession: UserWithSessionKey = await this.authService.createSession(findUser, true);
      const response: AuthLoginResponse = {
        message: 'login',
        data: userWithSession,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: User = req.user;

    try {
      const logOutUserData: User = await this.authService.logout(userData);
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
