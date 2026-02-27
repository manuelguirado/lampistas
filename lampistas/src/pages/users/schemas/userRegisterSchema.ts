import { z} from "zod";
import type  { direction } from "../../../types/directionType";
export const userRegisterSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    directions: z.array(
        z.object({
            address: z.string().min(5, "Address must be at least 5 characters long"),
            city: z.string().min(2, "City must be at least 2 characters long"),
            state: z.string().min(2, "State must be at least 2 characters long"),
            zipCode: z.string().min(4, "Zip Code must be at least 4 characters long"),
        })
    ).min(1, "At least one direction is required"),
});
export type UserRegisterData = z.infer<typeof userRegisterSchema>;