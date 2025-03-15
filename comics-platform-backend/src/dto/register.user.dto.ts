import { IsNotEmpty, IsEmail, Validate } from "class-validator";
import { IsUnique } from "../validators/is-unique";

export class RegisterUserDto{

    @IsNotEmpty()
    @IsUnique({tableName: 'users', column: 'username'})
    username: string;

    @IsNotEmpty()
    @IsEmail()
    @IsUnique({tableName: 'users', column: 'email'})
    email: string;

    @IsNotEmpty()
    password: string;
}