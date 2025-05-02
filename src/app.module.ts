import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SheetsModule } from './sheets/sheets.module';
import { RegistroModule } from './registro/registro.module';



@Module({
  imports: [SheetsModule, RegistroModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
