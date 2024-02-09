import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('register')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async registerUser(@Body() userData: any): Promise<any> {
    try {
      const result = await this.userService.registerUser(userData);
      return result;
    } catch (error) {
      return { error: error.message };
    }    
  }

  @Get(':token')
  async verifyEmail(@Param('token') token: string) {
    try {
      await this.userService.verifyTokenAndActivateAccount(token);
      return 'Email verified successfully. Your account is now activated.';
    } catch (error) {
      return error.message;
    }
  }
}
