import { IsEmail, IsNotEmpty, IsString, Matches, isNotEmpty, isString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsNotEmpty({ message: 'Phone number is required' })
    @Matches(/^[0-9]{10}$/, { message: 'Phone number must contain exactly 10 numbers' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;
    
    @IsNotEmpty({ message: 'Image is required'})
    image: string;

    @IsNotEmpty({ message: 'Role is required' })
    roleId: string;
}
