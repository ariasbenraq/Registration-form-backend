import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { SedesController } from '../sedes/sedes.controller';
import { ProyectosController } from '../proyectos/proyectos.controller';

@Module({
  controllers: [SedesController, ProyectosController],
  providers: [SheetsService],
  exports: [SheetsService], // 👈 para que lo use RegistroModule
})
export class SheetsModule {}
