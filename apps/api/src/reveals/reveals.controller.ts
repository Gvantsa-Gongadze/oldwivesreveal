import { Body, Controller, Get, Headers, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { RevealsService } from './reveals.service';
import { CreateRevealDto } from './dto/create-reveal.dto';

@Controller('reveals')
export class RevealsController {
  constructor(private readonly revealsService: RevealsService) {}

  @Post()
  create(@Body() dto: CreateRevealDto, @Headers('x-client-id') clientId?: string) {
    return this.revealsService.create(dto, clientId ?? null);
  }

  @Get()
  findAll(@Query('limit') limit?: string, @Headers('x-client-id') clientId?: string) {
    return this.revealsService.findAll(clientId ?? null, limit ? Number(limit) : undefined);
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
