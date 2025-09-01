import { User } from "@/domain/entities/User";



export class UserMapper {


    static toResponseDTO(user: User) {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            image: user.image,
            id: user._id,
            preferences: user.preferences,
            createdAt: user.createdAt,
            status: user.status,
            googleId: user.googleId,
            updatedAt: user.updatedAt,
            bio: user.bio

        }
    }
}        