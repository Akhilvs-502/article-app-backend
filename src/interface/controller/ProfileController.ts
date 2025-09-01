import { IUpdatePreferencesUseCase } from "@/application/interfaces/IUpdatePreferencesUseCase"
import { AppError } from "@/domain/error/AppError";
import { HttpStatusCode } from "@/shared/constants/HttpStatusCode";
import { NextFunction, Request, Response } from "express"




export class ProfileController {

    constructor(
        private updatePreferencesUseCase: IUpdatePreferencesUseCase
    ) { }

    updatePreference = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.updatePreferencesUseCase.execute()

            res.status(HttpStatusCode.OK).json({ status: true, message: 'user created Successfully' });

        } catch (error) {
            if (error instanceof Error) {


                next(new AppError(error.message, HttpStatusCode.BAD_REQUEST));
            } else {
                next(new AppError('Internal server error', HttpStatusCode.INTERNAL_SERVER_ERROR));
            }

        }
    }



}