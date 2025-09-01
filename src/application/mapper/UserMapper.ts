import { User } from "@/domain/entities/User";



export class UserMapper {


    static toResponseDTO(user: User) {
        return {
            name: user.firstName,
            email: user.email,
            image: user.image,
            id: user._id,
            createdAt: user.createdAt,
            status: user.status,
            googleId: user.googleId,
            updatedAt: user.updatedAt,

        }
    }
}        