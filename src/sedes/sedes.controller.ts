import { Controller, Get, Post, Body } from '@nestjs/common';
import { SheetsService } from '../sheets/sheets.service';

@Controller('sedes')
export class SedesController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Get()
  async obtenerSedes() {
    const sedes = await this.sheetsService.getSedes();
    return { sedes };
  }

  @Post()
  async agregarSede(@Body('sede') sede: string) {
    if (!sede) return { message: 'Campo sede vacío' };
    await this.sheetsService.addSede(sede);
    return { message: 'Sede registrada o ya existente' };
  }
}
