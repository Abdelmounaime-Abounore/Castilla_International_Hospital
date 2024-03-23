import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request } from 'express';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async registerUser(@Body() userData: any): Promise<any> {
    
    try {
      const result = await this.userService.registerUser(userData);
      console.log("test2");
      return result;
    } catch (error) {
      return { error: error.message };
    }    
  }

  @Get(':token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    try {
      // console.log("first")
      await this.userService.verifyTokenAndActivateAccount(token);
      return res.redirect('http://localhost:5173/login');
    } catch (error) {
      return error.message;
    }
  }

  @Post('login')
  async loginUser(@Body()  loginData: any): Promise<{ token: string }> {
    return this.userService.login(loginData);
  }

  @Post('check')
  async validateToken(@Req() req: Request) {
    console.log(req)
    const tokenCookie = req.cookies['token'];
    console.log(tokenCookie);
    return true;
  }
}
