import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from './admin-auth.guard';
import { AdminService } from './admin.service';

@UseGuards(AdminAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('reveals')
  findAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.adminService.findAll(limit ? Number(limit) : undefined, offset ? Number(offset) : undefined);
  }
}
