import { NextFunction, Request, Response } from 'express';
import { ProfileDTO } from '@/application/dto/ProfileDTO';
import { IUpdateUserUseCase, IUploadImageUseCase } from '@/application/interfaces/IUserUseCase';
import { IGetRepositoryDataUseCase } from '@/application/interfaces/IGetRepositoryDataUseCase';
import { IVerifyUserPasswordUseCase } from '@/application/interfaces/IUserPasswordUseCases';
import { ResetPasswordDTO } from '@/application/dto/ResetPasswordDTO';
import { IResetPasswordUseCase } from '@/application/interfaces/IUserPasswordUseCases';
import { User } from '@/domain/entities/User';
import { AppError } from '@/domain/error/AppError';
import { HttpStatusCode } from '@/shared/constants/HttpStatusCode';
import { MulterDTO } from '@/application/dto/MulterDTO';
import { Multer } from "multer"
import { UserMapper } from '@/application/mapper/UserMapper';

export class ProfileController {
  constructor(
    private updateUseCase: IUpdateUserUseCase,
    private getRepositoryDataUseCase: IGetRepositoryDataUseCase<User>,
    private verifyUserPasswordUseCase: IVerifyUserPasswordUseCase,
    private resetPasswordUseCase: IResetPasswordUseCase,
    private uploadImageUsecase: IUploadImageUseCase
  ) { }

  update = async (req: Request, res: Response) => {
    try {
      const user = req.user as { email: string };

      const profileData = new ProfileDTO(req.body);


      const data = await this.updateUseCase.execute(user.email, profileData);
      if (data) { res.status(HttpStatusCode.OK).json({ status: true, message: 'problems fetched success', user: { name: data.name, email: data.email, image: data.image } }); }
    } catch (error: any) {
      res.status(400).json({ status: false, message: error.message });
    }
  };

  getData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('get profile data');
      const user = req.user as { email: string, id: string };

      let profile = await this.getRepositoryDataUseCase.OneDocumentById(user.id.toString());
      console.log("profile", profile);

      if (profile) {

        const profileDTO = UserMapper.toResponseDTO(profile)

        return res.status(HttpStatusCode.OK).json({ status: true, message: 'Problems fetched success', user: profileDTO });
      }
      next(new AppError('Something went wrong', 500));

      // res.status(400).json({ status: false, message: "Something went wrong" })
    } catch (error) {
      next(new AppError('Something went wrong', 500));

      // return res.status(400).json({ status: false, message: "Something went wrong while fetching data" })
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = new ResetPasswordDTO(req.body, req.user.email);

    

      if (data.currentPassword === data.password) {
        next(new AppError('New password must be  different from old', 400));
      }
      const isValid = await this.verifyUserPasswordUseCase.execute(data.email, data.currentPassword);
      if (isValid) {
        this.resetPasswordUseCase.execute(data.email, data.password);

        res.status(HttpStatusCode.OK).json({ status: true, message: 'password updated' });
      } else {
        next(new AppError('Incorrect current password', 409));

        // res.status(400).json({ status: false, message: "Incorrect current password" })
      }
    } catch (error) {
      console.log(error);

      next(new AppError('Something went wrong', 500));

    }
  };


  // profilePicUpload = async (req: Request, res: Response, next: NextFunction) => {
  //   try {

  //     // console.log("file data",req.file);

  //     const file = req.file as Express.Multer.File

  //     const fileData = new MulterDTO(file)

  //     const url = await this.uploadImageUsecase.execute(fileData.buffer, fileData.originalName, fileData.mimetype)

  //     res.status(HttpStatusCode.OK).json({ status: true, message: 'image uploaded ', data: url });

  //   } catch (error) {

  //     next(new AppError('Something went wrong', 500));

  //   }
  // }

  updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as { email: string };
      const preferencesData =req.body

      const data = await this.updateUseCase.execute(user.email,{preferences:preferencesData});
      if (data) {
        res.status(HttpStatusCode.OK).json({ status: true, message: 'Preferences updated successfully', user: { email: data.email, preferences: data.preferences } });
      }
    } catch (error: any) {
      res.status(400).json({ status: false, message: error.message });
    }
  };

}
