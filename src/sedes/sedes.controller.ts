import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SheetsService } from '../sheets/sheets.service';

@Controller('sedes')
export class SedesController {
    constructor(private readonly sheetsService: SheetsService) { }

    // SedesController
    @Get()
    async obtenerSedes(@Query('q') query?: string) {
        const sedes = await this.sheetsService.getSedes();
        if (query) {
            const normalizar = (txt: string) => txt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            return {
                sedes: sedes.filter(s => normalizar(s).includes(normalizar(query)))
            };
        }
        return { sedes };
    }


    @Post()
    async agregarSede(@Body() body: { sede: string; force?: boolean }) {
        const { sede, force = false} = body;
        await this.sheetsService.addSede(sede, force);
        return { message: 'Sede registrada correctamente' };
    }

}
