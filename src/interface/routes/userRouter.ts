
import express from "express"
import { AuthController } from "../controller/AuthController"
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { HashService } from "../services/hashing/HashService";
import { BcryptHashAlgorithm } from "../services/hashing/BcryptHashAlgorithm";
import { PendingUserRepository } from "@/infrastructure/repositories/PendingUserRepository";
import { CreateUserUseCase } from "@/application/useCases/CreateUserUseCase";
import { SendOtpUseCase } from "@/application/useCases/auth/SendOtpUseCase";
import { LoginUserUseCase } from "@/application/useCases/auth/LoginUserUseCase";
import { OtpService } from "../services/otp/OtpService";
import { env } from "@/config/env";
import { JwtService } from "../services/jwt/JwtService";
import { VerifyOtpController } from "../controller/VerifyOtpController";
import { RegisterUserFromPendingUseCase } from "@/application/useCases/auth/RegisterUserFromPendingUseCase";
import { VerifyOtpUseCase } from "@/application/useCases/auth/VerifyUseCase";
import { ResendOtpController } from "../controller/ResendOtpController";
import { ProfileController } from "../controller/ProfileController"; 
import { UpdatePreferencesUseCase } from "@/application/useCases/UpdatePreferenceUseCase";
import { CreateArticleUseCase } from "@/application/useCases/CreatArticleUseCase";
import { ArticleRepository } from "@/infrastructure/repositories/ArticleRepository";
import { DashboardController } from "@/interface/controller/DashboardController";
import { UploadFileService } from "../services/s3bucket/UploadService";
import { UploadImageUseCase } from "@/application/useCases/UploadImageUseCase";
import multer from 'multer'
import { Authenticate } from "@/middleware/Authenticate";
import { GetRepositoryDataUseCase } from "@/application/useCases/GetRepositoryDataUseCase";
import { GetAllArticleDataUsingFieldUseCase } from "@/application/useCases/GetAllRepoDataUsingFieldUseCase";
import { UpdateArticleUseCase } from "@/application/useCases/UpdateArticleUseCase";
import { UserArticleActionRepository } from '@/infrastructure/repositories/UserArticleActionRepository';
import { UpdateArticleActionUseCase } from '@/application/useCases/UpdateArticleActionUseCase';
import { ArticleController } from "../controller/ArticleController";
import { VerifyUserPasswordUseCase } from "@/application/useCases/auth/VerifyUserPasswordUseCase";
import { ResetPasswordUseCase } from "@/application/useCases/auth/ResetPasswordUseCase";
import { UpdateUserUseCase } from "@/application/useCases/UpdateUserUseCase";

const userArticleActionRepository = new UserArticleActionRepository();

const router = express.Router()



const accessToken = env.ACCESS_JWT_TOKEN;
const refreshToken = env.REFRESH_JWT_TOKEN;

const algorithm = new BcryptHashAlgorithm(); // dip for hashServices
const hashService = new HashService(algorithm);
const uploadImageService = new UploadFileService();


const userRepository = new UserRepository();
const pendingUserRepository = new PendingUserRepository();
const articleRepository = new ArticleRepository();



const otpService = new OtpService(env.EMAIL!, env.NODEMAILER_PASS!);
const jwtService = new JwtService(accessToken, refreshToken);

const createUserUseCase = new CreateUserUseCase(userRepository, hashService, pendingUserRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, hashService, jwtService);
const verifyOtpUseCase = new VerifyOtpUseCase(pendingUserRepository, otpService);
const sendOtpUseCase = new SendOtpUseCase(otpService, pendingUserRepository);
const registerUserFromPendingUseCase = new RegisterUserFromPendingUseCase(pendingUserRepository, userRepository);
const resendOtpController = new ResendOtpController(sendOtpUseCase);
const updatePreferencesUseCase = new UpdatePreferencesUseCase(userRepository)
const createArticleUseCase = new CreateArticleUseCase(articleRepository);
const uploadImageUseCase = new UploadImageUseCase(uploadImageService);
const getRepositoryDataUseCase = new GetRepositoryDataUseCase(userRepository);
const getAllArticleDataUsingFieldUseCase = new GetAllArticleDataUsingFieldUseCase(articleRepository)
const updateArticleUseCase = new UpdateArticleUseCase(articleRepository);
const updateArticleActionUseCase = new UpdateArticleActionUseCase(userArticleActionRepository,articleRepository);
const verifyUserPasswordUseCase = new VerifyUserPasswordUseCase(userRepository, hashService);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, hashService);
const updateUserUseCase = new UpdateUserUseCase(userRepository);





const authController = new AuthController(createUserUseCase, sendOtpUseCase, loginUserUseCase);
const verifyOtpController = new VerifyOtpController(verifyOtpUseCase, registerUserFromPendingUseCase);
const profileController = new ProfileController(updateUserUseCase,getRepositoryDataUseCase,verifyUserPasswordUseCase,resetPasswordUseCase,uploadImageUseCase);
const dashboardController = new DashboardController(createArticleUseCase, uploadImageUseCase, getAllArticleDataUsingFieldUseCase, updateArticleActionUseCase, updateArticleUseCase);
const authenticate = new Authenticate(jwtService, getRepositoryDataUseCase);
const articleController=new ArticleController(articleRepository,userRepository)

router.post("/register", authController.register)
router.post('/verifyOtp', verifyOtpController.verify);
router.post('/resendOtp', resendOtpController.resend);

router.post("/login", authController.login)
router.post("/logout", authController.logout)

router.post("/createArticle", authenticate.verify, dashboardController.createArticle)
router.get("/myArticles", authenticate.verify, dashboardController.userArticles)
router.patch("/updateArticle/:id", authenticate.verify, dashboardController.updateArticle)
router.post("/articleAction/:id", authenticate.verify, dashboardController.articleAction)

router.get("/homeFeed", authenticate.verify, articleController.getFeeds)

const upload = multer()
router.post("/uploadImage", upload.single("file"), authenticate.verify, dashboardController.imageUpload)



router.patch('/profile', authenticate.verify, profileController.update);
router.get('/profile', authenticate.verify, profileController.getData);
router.patch('/profile/resetPassword', authenticate.verify, profileController.resetPassword);
router.post('/profile/preferences', authenticate.verify, profileController.updatePreferences);




export default router