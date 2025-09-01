import { NextFunction, Request, Response } from 'express';
import { CreateUserDTO } from '@/application/dto/CreateUserDTO';
import { LoginDTO } from '@/application/dto/LoginDTO';
import { env } from '@/config/env';
import { ICreateUserUseCase, ILoginUserUseCase } from '@/application/interfaces/IUserUseCase'
import { AppError } from '@/domain/error/AppError';
import { ISendOtpUseCase } from '@/application/interfaces/IOtpUseCases';
import { HttpStatusCode } from '@/shared/constants/HttpStatusCode';



export class AuthController {
  constructor(
    private createUserUseCase: ICreateUserUseCase,
    private sentOtpUsecase: ISendOtpUseCase,
    private loginUserUseCase: ILoginUserUseCase,

  ) { }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {

      console.log("data get in register", req.body)

      const userData = new CreateUserDTO(req.body);


      const createdUserEmail = await this.createUserUseCase.execute(userData.firstName, userData.lastName, userData.email, userData.password);

      if (createdUserEmail) {
        await this.sentOtpUsecase.execute(createdUserEmail);

        res.status(HttpStatusCode.CREATED).json({ status: true, message: 'OTP sended' });
      } else {
        next(new AppError('Something wentWrong', HttpStatusCode.BAD_REQUEST));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {


        next(new AppError(error.message, HttpStatusCode.BAD_REQUEST));
      } else {
        next(new AppError('Internal server error', HttpStatusCode.INTERNAL_SERVER_ERROR));
      }
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginData = new LoginDTO(req.body);
      console.log("login data", loginData);
      const loginUserData = await this.loginUserUseCase.execute(loginData.identifier, loginData.password);



      const isProduction = env.NODE_ENV === "production"


      res.cookie('accessToken', loginUserData.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: 1000 * 60 * 15,
        domain: isProduction ? env.COOKIE_DOMAIN : undefined,
        path: '/',
      });
      res.cookie('refreshToken', loginUserData.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        domain: isProduction ? env.COOKIE_DOMAIN : undefined,
        path: '/',
      });

      res.status(HttpStatusCode.OK).json({ status: true, message: 'user logged success', user: loginUserData.user });
    } catch (error: any) {
      console.log(error);

      next(new AppError(error.message, HttpStatusCode.BAD_REQUEST));
    }
  };


  logout = (req: Request, res: Response): Response => {
    console.log('logout controller is working');

    const isProduction = env.NODE_ENV === "production"

    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: isProduction ? "none" : "strict",
      secure: isProduction,
      domain: isProduction ? env.COOKIE_DOMAIN : undefined,

    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: isProduction ? "none" : "strict",
      secure: isProduction,
      domain: isProduction ? env.COOKIE_DOMAIN : undefined,
    });
    return res.status(HttpStatusCode.OK).json({ message: 'Logged out successfully' });
  };




}
