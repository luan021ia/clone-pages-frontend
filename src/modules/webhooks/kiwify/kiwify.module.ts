import { Module } from '@nestjs/common';
import { KiwifyController } from './kiwify.controller';
import { KiwifyService } from './kiwify.service';
import { UsersModule } from '../../users/users.module';
import { LicensesModule } from '../../licenses/licenses.module';

@Module({
  imports: [UsersModule, LicensesModule],
  controllers: [KiwifyController],
  providers: [KiwifyService],
})
export class KiwifyModule {}
