import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entity/user.entity'
import { Role } from '../role/entity/role.entity';
import { UserUtilService } from './user.util'; // Adjust the path
import { CreateUserDto } from './dto/create.user.dto';
import * as bcryptjs from 'bcryptjs';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken'; // Import JwtPayload type

import * as nodemailer from 'nodemailer';


import * as jwt from 'jsonwebtoken';
import { error } from 'console';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    private readonly userUtilService: UserUtilService,
    private readonly jwtService: JwtService,
  ) { }

  async registerUser(userData: any): Promise<any> {

    const createUserDto = new CreateUserDto();

    createUserDto.name = userData.name;
    createUserDto.phoneNumber = userData.phoneNumber;
    createUserDto.email = userData.email;
    createUserDto.password = userData.password;
    createUserDto.confirmPassword = userData.confirmPassword;
    createUserDto.image = userData.image;
    createUserDto.roleId = userData.roleId;
    createUserDto.cv = userData.cv;
    createUserDto.specialityId = userData.specialityId;

    // console.log(createUserDto);
    // Validate the DTO using class-validator
    const validationErrors = await validate(createUserDto);

    if (validationErrors.length > 0) {
      // Validation errors occurred, throw an exception with the details
      console.error(validationErrors);
      throw new ConflictException(validationErrors.map(error => Object.values(error.constraints).join(', ')).join(', '));
    }

    // Check if email already exists
    const emailExists = await this.userModel.findOne({ email: userData.email });
    if (emailExists) {
      throw new NotFoundException('This Email is already exists. Try to sign in.');
    }

    if (userData.password !== userData.confirmPassword) {
      throw new ConflictException('Password and Confirm Password do not match.');
    }

    // Hash the password
    const genSalt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(userData.password, genSalt);

    // Check if roleId exists in the roles collection

    const roleExists = await this.roleModel.findById(userData.roleId);

    if (!roleExists) {
      throw new NotFoundException('Invalid roleId. Role not found.');
    }

    // Create a new user instance
    const newUser = new this.userModel({
      name: userData.name,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      password: hashedPassword,
      image: userData.image,
      roleId: userData.roleId,
      specialityId: userData.specialityId,
      isActive: false,
    });

    // Save the new user
    let savedUser;
    try {
      savedUser = await newUser.save();
      console.log("Result of newUser.save():", savedUser);
    } catch (error) {
      console.error("Error saving user:", error);
      throw error; // Rethrow the error to propagate it to the caller
    } console.log("savedUser");
    let userObject = savedUser.toObject();
    // Remove the password from the response
    delete userObject.password;
    // Generate and send activation email
    const token = jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: '5m' });
    console.log(token);


    let mailType = {
      from: 'castilla@hospital.com',
      to: userData.email,
      subject: 'Account activation link',
      html: `<div class="con">
      <h2>Hello ${userData.name}</h2>
      <h3> Click the link to activate your account </h3>
          <a class="btn" href="http://localhost:3000/auth/${token}">Active Your Account</a>
        </div>
        <style>
          .con{
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            height: 100vh;
          }
          .btn{
            background-color: #4CAF50;
            font-size: 16px;
            font-weight: bold;
            border-radius: 30px;
            border-width: 0;
            margin-top: 15px;
            padding: 10px 32px;
            color: white;
            text-decoration: none; 
          }
          </style>`,
    };
    await this.userUtilService.sendMailToUser(mailType);

    return { success: 'Registration Successfully, Please Verify Your Email', newUser: userObject };
  }

  async verifyUserToken(token: string): Promise<any> {
    try {
      const decodedToken: JwtPayload = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;
      return decodedToken.email;
    } catch (error) {
      console.error('Error:', error.message);
      return null;
    }
  }

  async verifyTokenAndActivateAccount(token: string): Promise<boolean> {
    const userMail = await this.verifyUserToken(token);
    if (userMail) {
      await this.userModel.updateOne({ email: userMail }, { isActive: true });
      return true;
    } else {
      throw new NotFoundException('Invalid or expired token.');
    }
  }

  async login(loginData: any): Promise<{ token: string }> {
    const { email, password } = loginData;
    console.log(email);

    // Find user by email
    const user = await this.userModel.findOne({ email });
    console.log(user);
    if (!user) {

      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ userId: user.id });
    console.log(token);

    return { token };
  }
}