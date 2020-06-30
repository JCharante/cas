import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, SessionKeyDto } from '../dtos/users.dto';
import { RequestWithUser } from '../interfaces/auth.interface';
import { RedesignedUser, User } from '../interfaces/users.interface';
import AuthService from '../services/auth.service';
import { UserWithSessionKey, AuthLoginResponse, AuthSignupResponse, isCasError, AuthAccountInfoResponse } from 'types-cas';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const signUpUserData: RedesignedUser = await this.authService.signup(userData);
      const userWithSession: UserWithSessionKey = await this.authService.createSession(signUpUserData, true);
      const response: AuthSignupResponse = {
        message: 'signup',
        data: userWithSession,
      };
      res.status(201).json(response);
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

  public getAccountInfo = async (req: Request, res: Response, next: NextFunction) => {
    const userData: SessionKeyDto = req.body;

    try {
      const user: RedesignedUser = await this.authService.getUserFromSessionKey(userData.sessionKey);
      const response: AuthAccountInfoResponse = {
        hasError: false,
        data: user,
      };
      res.status(200).json(response);
    } catch (error) {
      if (isCasError(error)) {
        const response: AuthAccountInfoResponse = {
          error,
          hasError: true,
        };
        res.status(200).json(response);
      } else {
        next(error);
      }
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
