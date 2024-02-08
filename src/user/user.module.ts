import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity/user.entity';
import { Role, RoleSchema } from './entities/role.entity/role.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema},
    { name: Role.name, schema: RoleSchema },

  ])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
