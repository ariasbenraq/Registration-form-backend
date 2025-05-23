// import { Controller, Post, Body, Get } from '@nestjs/common';
// import { SheetsService } from '../sheets/sheets.service';

// @Controller('registro')
// export class RegistroController {
//   constructor(private readonly sheetsService: SheetsService) {}

//   @Post()
//   async registrar(@Body() body: {
//     sede: string;
//     proyecto: string;
//     puerto: string;
//     etiqueta: string;
//   }) {
//     await this.sheetsService.registrarDatos({ ...body });
//     return { message: 'Datos registrados correctamente' };
//   }

//     @Get()
//     async obtenerRegistros() {
//       const registros = await this.sheetsService.getRegistros();
//       return registros;
//     }
// }
