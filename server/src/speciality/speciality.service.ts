import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validate } from 'class-validator';
import { Speciality } from './entity/speciality.entity';
import { CreateSpecialityDto } from './dto/create.speciality.dto';

@Injectable()
export class SpecialityService {
  constructor(
    @InjectModel(Speciality.name) private readonly specialityModel: Model<Speciality>,
  ) {}

  async addSpeciality(specialityData: any): Promise<any> {
    
    const createSpecialityDto = new CreateSpecialityDto();
    
    createSpecialityDto.name = specialityData.name;    
    
    const validationErrors = await validate(createSpecialityDto);
    
    if (validationErrors.length > 0) {
      console.error(validationErrors);
      throw new ConflictException(validationErrors.map(error => Object.values(error.constraints).join(', ')).join(', '));
    }

    const newSpeciality = new this.specialityModel({
      name: specialityData.name
    });
    
    let savedSpeciality: any;
    try {
        savedSpeciality = await newSpeciality.save();
        console.log("Result of newUser.save():", savedSpeciality);
        return { success: 'New speciality saved successfully', newSpeciality: savedSpeciality };
    } catch (error) {
        console.error("Error saving user:", error);
        throw error;
    }    
        

    // import * as nodemailer from 'nodemailer';

    
    // export default sendMailToUser;
    
  }
}