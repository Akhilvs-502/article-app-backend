import { NextFunction, Request, Response } from 'express';
import { ISendOtpUseCase } from '@/application/interfaces/IOtpUseCases';
import { AppError } from '@/domain/error/AppError';
import { HttpStatusCode } from '@/shared/constants/HttpStatusCode';
import { ControllerMessages } from '@/shared/constants/ControllerMessages';

export class ResendOtpController {
  constructor(

        private sendOtpUseCase: ISendOtpUseCase,

  ) {

  }

  resend = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('resend in backend');

      // const data= new OtpDTO(req.body);
      const data = req.body;

      await this.sendOtpUseCase.execute(data.email);
      res.status(HttpStatusCode.OK).json({ status: true, message: ControllerMessages.OTP_SENT });
    } catch (error: any) {
      next(new AppError(error.message, 500));
    }
  };
}
