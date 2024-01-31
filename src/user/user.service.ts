import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity/user.entity'
import * as bcryptjs from 'bcryptjs';
// import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async registerUser(userData: any): Promise<any> {

    // Check if email already exists
    const emailExists = await this.userModel.findOne({ email: userData.email });
    if (emailExists) {
      throw new NotFoundException('This Email is already exists. Try to sign in.');
    }

    // Hash the password
    const genSalt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(userData.password, genSalt);

    // Create a new user instance
    const newUser = new this.userModel({
      name: userData.name,
      phoneNumber: hashedPassword,
      email: userData.email,
      password: hashedPassword,
      image: userData.image,
      roleId: userData.roleId,
    });

    // Save the new user
    try {
      const savedUser = await newUser.save();
      let userData = savedUser.toObject();

      delete userData.password;

      // Generate and send activation email
    //   const token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
    //   const tokenWithHyphens = token.replace(/\./g, '~');

    //   let mailType = {
    //     from: 'castilla@hospital.com',
    //     to: userData.email,
    //     subject: 'Account activation link',
    //     html: `<div class="con">
    //       <h2>Hello ${userData.name}</h2>
    //       <h3> Click the link to activate your account </h3>
    //       <a class="btn" href="http://localhost:5173/verifyEmail/${tokenWithHyphens}">Active Your Account</a>
    //     </div>
    //     <style>
    //       .con{
    //         display: flex;
    //         align-items: center;
    //         flex-direction: column;
    //         justify-content: center;
    //         height: 100vh;
    //       }
    //       .btn{
    //         background-color: #4CAF50;
    //         font-size: 16px;
    //         font-weight: bold;
    //         border-radius: 30px;
    //         border-width: 0;
    //         margin-top: 15px;
    //         padding: 10px 32px;
    //         color: white;
    //         text-decoration: none; 
    //       }
    //     </style>`,
    //   };
    //   sendMailToUser(mailType);

      return { success: 'Registration Successfully, Please Verify Your Email', newUser: userData };
    } catch (err) {
      throw new NotFoundException(err);
    }
  }
}
