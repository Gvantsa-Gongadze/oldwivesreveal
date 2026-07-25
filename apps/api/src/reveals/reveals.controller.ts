import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { RevealsService } from './reveals.service';
import { CreateRevealDto } from './dto/create-reveal.dto';

@Controller('reveals')
export class RevealsController {
  constructor(private readonly revealsService: RevealsService) {}

  @Post()
  create(@Body() dto: CreateRevealDto) {
    return this.revealsService.create(dto);
  }

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.revealsService.findAll(limit ? Number(limit) : undefined);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const reveal = await this.revealsService.findOne(id);
    if (!reveal) {
      throw new NotFoundException(`No reveal found with id ${id}`);
    }
    return reveal;
  }
}
