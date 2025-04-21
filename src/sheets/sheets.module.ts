import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { SedesController } from '../sedes/sedes.controller';
import { ProyectosController } from '../proyectos/proyectos.controller';
import { RegistroController } from './sheets.controller';

@Module({
  controllers: [SedesController, ProyectosController, RegistroController],
  providers: [SheetsService],
  exports: [SheetsService] // ← necesario si lo vas a usar en otro módulo también
})
export class SheetsModule {}
