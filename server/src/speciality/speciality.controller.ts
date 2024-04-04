import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { SpecialityService } from './speciality.service';

@Controller('speciality')
export class SpecialityController {
  constructor(private readonly specialityrService: SpecialityService) {}

  @Post("add")
  async addSpeciality(@Body() specialityData: any): Promise<any> {
    
    try {
      const result = await this.specialityrService.addSpeciality(specialityData);
      return result;
    } catch (error) {
      return { error: error.message };
    }    
  }

}
