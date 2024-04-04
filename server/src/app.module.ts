import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { SpecialityModule } from './speciality/speciality.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UserModule, RoleModule, SpecialityModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
