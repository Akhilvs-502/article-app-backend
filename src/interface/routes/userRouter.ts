
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


const router=express.Router()



const accessToken = env.ACCESS_JWT_TOKEN;
const refreshToken = env.REFRESH_JWT_TOKEN;

const algorithm = new BcryptHashAlgorithm(); // dip for hashServices
const hashService = new HashService(algorithm);
const userRepository = new UserRepository();
const pendingUserRepository = new PendingUserRepository();



const otpService = new OtpService(env.EMAIL!, env.NODEMAILER_PASS!);
const jwtService = new JwtService(accessToken, refreshToken);

const createUserUseCase = new CreateUserUseCase(userRepository, hashService, pendingUserRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, hashService, jwtService);
const verifyOtpUseCase = new VerifyOtpUseCase(pendingUserRepository, otpService);
const sendOtpUseCase = new SendOtpUseCase(otpService, pendingUserRepository);
const registerUserFromPendingUseCase = new RegisterUserFromPendingUseCase(pendingUserRepository, userRepository);
const resendOtpController = new ResendOtpController(sendOtpUseCase);
const updatePreferencesUseCase=new UpdatePreferencesUseCase(userRepository)

const authController = new AuthController(createUserUseCase, sendOtpUseCase, loginUserUseCase);
const verifyOtpController = new VerifyOtpController(verifyOtpUseCase, registerUserFromPendingUseCase);
const profileController=new ProfileController(updatePreferencesUseCase)



router.post("/register",authController.register)
router.post('/verifyOtp', verifyOtpController.verify);
router.post('/preferences', profileController.updatePreference);
router.post('/resendOtp', resendOtpController.resend);

router.post("/login",authController.login)
router.post("/logout",authController.logout)

// router.




export default router