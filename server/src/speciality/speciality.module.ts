import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Speciality, SpecialitySchema } from './entity/speciality.entity';
import { SpecialityController } from './speciality.controller';
import { SpecialityService } from './speciality.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Speciality.name, schema: SpecialitySchema }

    ]),
  ],
  controllers: [SpecialityController],
  providers: [SpecialityService],
  exports: [SpecialityService]
})
export class SpecialityModule { }
