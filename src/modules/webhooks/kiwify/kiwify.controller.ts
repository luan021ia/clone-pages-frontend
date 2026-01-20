import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { KiwifyService } from './kiwify.service';
import { KiwifyWebhookDto } from './dto/kiwify-webhook.dto';

@Controller('webhooks/kiwify')
export class KiwifyController {
  private readonly logger = new Logger(KiwifyController.name);

  constructor(private readonly kiwifyService: KiwifyService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() data: KiwifyWebhookDto,
    @Query('signature') signature?: string,
  ) {
    this.logger.log('📥 Webhook recebido da Kiwify');

    // Validar assinatura
    if (!signature) {
      this.logger.error('Assinatura não fornecida no webhook');
      throw new UnauthorizedException('Assinatura do webhook não fornecida');
    }

    const isValid = this.kiwifyService.validateSignature(data, signature);
    
    if (!isValid) {
      this.logger.error('Assinatura inválida do webhook');
      throw new UnauthorizedException('Assinatura do webhook inválida');
    }

    try {
      // Processar webhook
      await this.kiwifyService.processWebhook(data);
      
      this.logger.log('✅ Webhook processado com sucesso');
      return { success: true, message: 'Webhook processado com sucesso' };
    } catch (error) {
      this.logger.error('Erro ao processar webhook:', error);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Erro ao processar webhook',
      );
    }
  }
}
