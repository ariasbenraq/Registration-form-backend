import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SheetsModule } from './sheets/sheets.module';
import { RegistroModule } from './registro/registro.module';
import { TelegramModule } from './telegram/telegram.module';



@Module({
  imports: [SheetsModule, RegistroModule, TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
