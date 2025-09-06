import { NextFunction, Request, Response } from 'express';
import { CreateUserDTO } from '@/application/dto/CreateUserDTO';
import { LoginDTO } from '@/application/dto/LoginDTO';
import { env } from '@/config/env';
import { ICreateUserUseCase, ILoginUserUseCase } from '@/application/interfaces/IUserUseCase'
import { AppError } from '@/domain/error/AppError';
import { ISendOtpUseCase } from '@/application/interfaces/IOtpUseCases';
import { HttpStatusCode } from '@/shared/constants/HttpStatusCode';
import { ControllerMessages } from '@/shared/constants/ControllerMessages';
import { cookieData } from '@/shared/constants/cookieData';



export class AuthController {
  constructor(
    private createUserUseCase: ICreateUserUseCase,
    private sentOtpUseCase: ISendOtpUseCase,
    private loginUserUseCase: ILoginUserUseCase,

  ) { }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const userData = new CreateUserDTO(req.body);

      const createdUserEmail = await this.createUserUseCase.execute(userData.firstName, userData.lastName, userData.email, userData.password);

      if (createdUserEmail) {
        await this.sentOtpUseCase.execute(createdUserEmail);

        res.status(HttpStatusCode.CREATED).json({ status: true, message: ControllerMessages.OTP_SENT });
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

      const loginUserData = await this.loginUserUseCase.execute(loginData.identifier, loginData.password);

      const isProduction = env.NODE_ENV === "production"


      res.cookie('accessToken', loginUserData.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: cookieData.MAX_AGE_ACCESS_TOKEN,
        domain: isProduction ? env.COOKIE_DOMAIN : undefined,
        path: '/',
      });
      res.cookie('refreshToken', loginUserData.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: cookieData.MAX_AGE_REFRESH_TOKEN,
        domain: isProduction ? env.COOKIE_DOMAIN : undefined,
        path: '/',
      });

      res.status(HttpStatusCode.OK).json({ status: true, message: ControllerMessages.USER_LOGGED_SUCCESS, user: loginUserData.user });
    } catch (error: unknown) {
      if (error instanceof Error) {

        next(new AppError(error.message, HttpStatusCode.BAD_REQUEST));
      } else {

        next(new AppError(ControllerMessages.INTERNAL_SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR));
      }

    }
  };


  logout = (req: Request, res: Response): Response => {

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
    return res.status(HttpStatusCode.OK).json({ message: ControllerMessages.LOGGED_OUT_SUCCESS });
  };




}
