import { OTP } from '../../../DB/model/otp.model';
import { UserGender, UserRole } from 'src/common/Types/types';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength, ValidateIf } from "class-validator";
import { customPasswordDecorator } from 'src/common/decorator/customPassword';
import { Transform } from 'class-transformer';



export class SignUpDto {
    @IsString()
    @MinLength(2)
    @MaxLength(10)
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsDate()
    @Transform(({value})=> new Date(value))
    @IsNotEmpty()
    DOB: Date;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

    @IsStrongPassword()
    @IsNotEmpty()
    @customPasswordDecorator({message:"confirm password not match password"})
    confirmPassword: string;

    @IsEnum(UserRole)
    role: string;

    @IsEnum(UserGender)
    gender: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @MinLength(11)
    @MaxLength(11)
    phone: string
}
export class confirmEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    OTP: string;

}