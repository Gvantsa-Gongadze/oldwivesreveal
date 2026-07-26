import { Body, Controller, Get, Headers, NotFoundException, Param, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { RevealsService } from './reveals.service';
import { CreateRevealDto } from './dto/create-reveal.dto';
import { renderShareCard } from './share-card';
import { renderSharePage } from './share-page';

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

  @Get(':id/card.png')
  async getShareCard(@Param('id') id: string, @Res() res: Response) {
    const reveal = await this.revealsService.findOne(id);
    if (!reveal) {
      throw new NotFoundException(`No reveal found with id ${id}`);
    }
    const png = renderShareCard(reveal);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(png);
  }

  @Get(':id/share')
  async getSharePage(@Param('id') id: string, @Res() res: Response) {
    const reveal = await this.revealsService.findOne(id);
    if (!reveal) {
      throw new NotFoundException(`No reveal found with id ${id}`);
    }
    const webOrigin = process.env.WEB_ORIGIN ?? 'http://localhost:5173';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderSharePage(reveal, webOrigin));
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
