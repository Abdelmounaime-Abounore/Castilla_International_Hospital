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

  async findRoleById(roleId: string): Promise<Role | null> {
    const role = await this.roleModel.findById(roleId);
    return role; // Return the role found or null if not found
  }
}
