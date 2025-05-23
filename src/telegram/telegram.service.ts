import { Injectable } from '@nestjs/common';
import { SheetsService } from '../sheets/sheets.service';
import axios from 'axios';

const TELEGRAM_API = 'https://api.telegram.org/bot8159317912:AAGyhDj48bO2VsRRBHDAr7ZLTfirwO0QXmg/sendMessage';

@Injectable()
export class TelegramService {
  constructor(private readonly sheetsService: SheetsService) {}

  async handleUpdate(update: any): Promise<void> {
    try {
      const message = update.message;
      if (!message || !message.text) return;

      const chatId = message.chat.id;
      const text = message.text.trim();

      if (text === '/sedes') {
        const sedes = await this.sheetsService.getSedes();
        const texto = sedes.length
          ? `📍 Sedes disponibles:\n${sedes.join('\n')}`
          : 'No se encontraron sedes.';
        await this.responder(chatId, texto);
      } else {
        await this.responder(chatId, '❌ Comando no reconocido. Usa /sedes.');
      }
    } catch (error) {
      console.error('❌ Error en handleUpdate:', error);
    }
  }

  private async responder(chatId: number, text: string) {
    await axios.post(TELEGRAM_API, {
      chat_id: chatId,
      text,
    });
  }
}
