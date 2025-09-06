import { NextFunction, Request, Response } from 'express';
import { IJwtService } from '../domain/services/IJwtService';
import { env } from '@/config/env';
import { IGetRepositoryDataUseCase } from '@/application/interfaces/IGetRepositoryDataUseCase';
import { AppError } from '@/domain/error/AppError';
import { cookieData } from '@/shared/constants/cookieData';
import { HttpStatusCode } from '@/shared/constants/HttpStatusCode';
import { ControllerMessages } from '@/shared/constants/ControllerMessages';

interface IRepoData {
  status: string, email: string, name: string, _id: string
}


export class Authenticate<Entity> {
  constructor(
    private jwtService: IJwtService,
    private getRepositoryDataUseCase: IGetRepositoryDataUseCase<Entity>,
  ) { }

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
  

      const { accessToken } = req.cookies;
      const { refreshToken } = req.cookies;

      if (!accessToken && !refreshToken) {


  return next(new AppError(ControllerMessages.LOGIN_EXPIRED, HttpStatusCode.UNAUTHORIZED));
      }

      if (accessToken) {

        const tokenData = await this.jwtService.verifyAccessToken(accessToken);

        if (tokenData) {
          const foundUser = await this.getRepositoryDataUseCase.OneDocumentById(tokenData.userId) as IRepoData;


          const isProduction = env.NODE_ENV === "production"

          if (foundUser?.status && foundUser?.status === 'banned') {


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

            return next(new AppError(ControllerMessages.ACCOUNT_BANNED, HttpStatusCode.UNAUTHORIZED));
          }
          if (foundUser) {
            req.user = {
              role: tokenData.role, email: foundUser.email, name: foundUser.name, id: foundUser._id,
            };

            return next();
          }


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
          return next(new AppError(ControllerMessages.USER_NOT_FOUND_UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED));
        }
      }
      if (refreshToken) {
        console.log('refreshToken found');
        const userPayload = this.jwtService.verifyRefreshToken(refreshToken);
        const { exp, iat, ...payload } = userPayload;
        if (userPayload) {
          const createAccesstoken = this.jwtService.signAccessToken(payload);

          const isProduction = env.NODE_ENV === "production"

          res.cookie('accessToken', createAccesstoken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict",
            maxAge: cookieData.MAX_AGE_ACCESS_TOKEN,
            domain: isProduction ? env.COOKIE_DOMAIN : undefined,
          });
          const foundUser = await this.getRepositoryDataUseCase.OneDocumentById(userPayload.userId) as IRepoData;

          if (foundUser) {
            req.user = {
              role: payload.role, email: foundUser.email, name: foundUser.name, id: foundUser._id,
            };

            return next();
          }

          return next(new AppError(ControllerMessages.USER_NOT_FOUND, 404));
        }
      }
    } catch (error) {



  return next(new AppError(ControllerMessages.NO_TOKEN, HttpStatusCode.UNAUTHORIZED));
    }
  };
}
