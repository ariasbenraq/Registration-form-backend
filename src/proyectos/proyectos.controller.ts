import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SheetsService } from '../sheets/sheets.service';

@Controller('proyectos')
export class ProyectosController {
    constructor(private readonly sheetsService: SheetsService) { }

    // ProyectosController
    @Get()
    async obtenerProyectos(@Query('q') query?: string) {
        const proyectos = await this.sheetsService.getProyectos();
        if (query) {
            const normalizar = (txt: string) => txt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            return {
                proyectos: proyectos.filter(s => normalizar(s).includes(normalizar(query)))
            };
        }
        return { proyectos };
    }

    @Post()
    async registrarProyecto(@Body() body: { proyecto: string; force?: boolean }) {
        const { proyecto, force = false } = body;
        await this.sheetsService.addProyecto(proyecto, force);
        return { message: 'Proyecto registrado correctamente' };
    }

}



