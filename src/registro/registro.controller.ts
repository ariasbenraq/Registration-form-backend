import { Controller, Post, Body, Get } from '@nestjs/common';
import { SheetsService } from '../sheets/sheets.service';
import { RegistroDto } from './dto/registro.dto';

@Controller('registro')
export class RegistroController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Post()
  async registrar(@Body() body: RegistroDto) {
    await this.sheetsService.registrarDatos(body);
    return { message: 'Datos registrados correctamente' };
  }

  @Get()
  async obtenerRegistros() {
    const registros = await this.sheetsService.getRegistros();
    return registros;
  }
}
