import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity/user.entity'
import { Role } from './entities/role.entity/role.entity';
import { UserUtilService } from './user.util'; // Adjust the path
import { CreateUserDto } from './dto/create.user.dto';
import * as bcryptjs from 'bcryptjs';
import { validate } from 'class-validator';
import * as nodemailer from 'nodemailer';


import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    private readonly userUtilService: UserUtilService
  ) { }

  async registerUser(userData: any): Promise<any> {

    // Validate the user data using the CreateUserDto
    const createUserDto = new CreateUserDto();
    createUserDto.name = userData.name;
    createUserDto.phoneNumber = userData.phoneNumber;
    createUserDto.email = userData.email;
    createUserDto.password = userData.password;
    createUserDto.confirmPassword = userData.confirmPassword;
    createUserDto.image = userData.image;
    createUserDto.roleId = userData.roleId;

    // Validate the DTO using class-validator
    const validationErrors = await validate(createUserDto);

    if (validationErrors.length > 0) {
      // Validation errors occurred, throw an exception with the details
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
      isActive: false,
    });

    // Save the new user
    const savedUser = await newUser.save();
    let userObject = savedUser.toObject();

    // Remove the password from the response
    delete userObject.password;
    
    // Generate and send activation email
    const token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
    // const tokenWithHyphens = token.replace(/\./g, '~');
    let mailType = {
      from: 'castilla@hospital.com',
      to: userData.email,
      subject: 'Account activation link',
      html: `<div class="con">
      <h2>Hello ${userData.name}</h2>
      <h3> Click the link to activate your account </h3>
          <a class="btn" href="http://localhost:8000/register/${token}">Active Your Account</a>
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
        
        return { success: 'Registration Successfully, Please Verify Your Email', newUser: userData };
        

    // import * as nodemailer from 'nodemailer';

    
    // export default sendMailToUser;
    
  }
  
  async verifyUserToken(token: string): Promise<any> {
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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

  async login(loginData: any): Promise<any> {
    // const { error } = LoginValidation(loginData);

    // if (error) {
    //   throw new NotFoundException(error.details[0].message);
    // }

    const user = await this.userModel.findOne({ email: loginData.email });

    if (!user) {
      throw new NotFoundException('This Email is not found');
    }

    const validPass = await bcryptjs.compare(loginData.password, user.password);
    if (!validPass) {
      throw new NotFoundException('Invalid password');
    }

    if (!user.isActive) {
      throw new NotFoundException('Please verify your email');
    }

    const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);

    return { success: 'Login Successful', user, token };
  }

}