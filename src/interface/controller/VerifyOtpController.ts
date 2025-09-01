import { NextFunction, Request, Response } from 'express';
import { OtpDTO } from '@/application/dto/OtpDTO';
import { IVerifyOtpUseCase } from '@/application/interfaces/IOtpUseCases';
import { IRegisterUserFromPendingUseCase } from '@/application/interfaces/IUserUseCase';
import { AppError } from '@/domain/error/AppError';
import { HttpStatusCode } from '@/shared/constants/HttpStatusCode';

export class VerifyOtpController {
  constructor(
    private verifyOtpUseCase: IVerifyOtpUseCase,
    private registerUserFromPendingUseCase: IRegisterUserFromPendingUseCase,
  ) { }

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('verigy otp');
      const data = new OtpDTO(req.body);

      const isValid = await this.verifyOtpUseCase.execute(data.email, data.otp);

      if (!isValid) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'Invalid or expired OTP' });
      }

      const userData = await this.registerUserFromPendingUseCase.execute(data.email);

      res.json({ status: true, message: 'user created Successfully', user: { name: userData?.firstName, email: userData?.email } });
    } catch (error: any) {
      console.log("error message",error.message);
      
      next(new AppError(error.message, HttpStatusCode.INTERNAL_SERVER_ERROR));

   
    }
  };
}
