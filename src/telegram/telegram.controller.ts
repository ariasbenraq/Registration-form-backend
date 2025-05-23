import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  @HttpCode(200)
  async handleTelegramUpdate(@Body() update: any) {
    try {
      console.log('📩 Mensaje recibido:', JSON.stringify(update, null, 2));
      await this.telegramService.handleUpdate(update);
      return 'ok';
    } catch (error) {
      console.error('❌ Error en /telegram:', error);
      return 'error';
    }
  }
}
