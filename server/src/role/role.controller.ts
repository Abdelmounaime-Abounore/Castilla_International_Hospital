import { Controller, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './entity/role.entity';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getRoles(): Promise<Role[]> {
    return await this.roleService.findRoles();
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string): Promise<Role | null> {
    return await this.roleService.findRoleById(id);
  }
}
