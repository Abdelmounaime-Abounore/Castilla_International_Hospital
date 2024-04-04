import { Equals, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, isNotEmpty, isString } from "class-validator";

export class CreateSpecialityDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;
}
