import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken"
import { AppError } from "../utils/appError.js";
export class AuthService {
    static async register(name: string, email: string, password: string) {
        const exitstingUser = await prisma.user.findUnique({
            where: { email }
        })

        if(exitstingUser)  throw new AppError("Email already exists", 400)

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })

        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET as string,
            {expiresIn: "7d"}
        )

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        }
    }
}