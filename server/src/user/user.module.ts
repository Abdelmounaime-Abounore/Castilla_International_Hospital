import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entity/user.entity';
import { UserUtilService } from './user.util';
import { Role, RoleSchema } from 'src/role/entity/role.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },

    ]),
    JwtModule.register({
      secret: 'axLQympbt7ChG6y0GcbT',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserUtilService],
  exports: [UserService]
})
export class UserModule { }
