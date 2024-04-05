import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Query } from '@nestjs/common';
import { User } from './entity/user.entity';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("register")
  async registerUser(@Body() userData: any): Promise<any> {
    console.log("userData: ", userData);

    try {
      const result = await this.userService.registerUser(userData);
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
  async loginUser(@Body() loginData: any): Promise<{ token: string }> {
    return this.userService.login(loginData);
  }

  @Post('check')
  async validateToken(@Req() req: Request) {
    console.log(req)
    const tokenCookie = req.cookies['token'];
    console.log(tokenCookie);
    return true;
  }

  @Get("/role/:roleName")
  async getUsersByRoleName(
    @Param('roleName') roleName: string,
  ): Promise<User[]> {
    console.log("test");
    
    return this.userService.getUsersByRoleName(roleName);
  }

}
