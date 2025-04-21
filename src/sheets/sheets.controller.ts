import { Controller, Post, Body } from '@nestjs/common';
import { SheetsService } from '../sheets/sheets.service';

@Controller('registro')
export class RegistroController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Post()
  async registrar(@Body() body: {
    sede: string;
    proyecto: string;
    puerto: string;
    etiqueta: string;
  }) {
    await this.sheetsService.registrarDatos({ ...body });
    return { message: 'Datos registrados correctamente' };
  }
}
