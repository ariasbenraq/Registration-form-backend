import { Module } from '@nestjs/common';
import { RegistroController } from './registro.controller';
import { SheetsModule } from '../sheets/sheets.module';

@Module({
  imports: [SheetsModule], // ✅ Necesario para acceder a SheetsService
  controllers: [RegistroController],
})
export class RegistroModule {}
