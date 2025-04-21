import { Controller, Get, Post, Body } from '@nestjs/common';
import { SheetsService } from '../sheets/sheets.service';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Get()
  async obtenerProyectos() {
    const proyectos = await this.sheetsService.getProyectos();
    return { proyectos };
  }

  @Post()
  async agregarProyecto(@Body('proyecto') proyecto: string) {
    if (!proyecto) return { message: 'Campo proyecto vacío' };
    await this.sheetsService.addProyecto(proyecto);
    return { message: 'Proyecto registrado o ya existente' };
  }
}
