import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { SpecialityService } from './speciality.service';
import { Speciality } from './entity/speciality.entity';

@Controller('speciality')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Post("add")
  async addSpeciality(@Body() specialityData: any): Promise<any> {
    
    try {
      const result = await this.specialityService.addSpeciality(specialityData);
      return result;
    } catch (error) {
      return { error: error.message };
    }    
  }

  @Get()
  async getSpeciality(): Promise<Speciality[]> {
    return await this.specialityService.findSpeciality();
  }
}
