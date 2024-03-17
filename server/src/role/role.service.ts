// role.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './entity/role.entity';

@Injectable()
export class RoleService {
  constructor(@InjectModel('Role') private readonly roleModel: Model<Role>) {}

  async findRoles(): Promise<Role[]> {
    return await this.roleModel.find({ roleName: { $in: ["Medecin", "Client"] } }).exec();
  }
}
