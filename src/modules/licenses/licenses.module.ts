import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { License } from '../../database/entities/license.entity'
import { LicensesService } from './licenses.service'

@Module({
  imports: [TypeOrmModule.forFeature([License])],
  providers: [LicensesService],
  exports: [LicensesService],
})
export class LicensesModule {}

