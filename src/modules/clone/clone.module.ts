import { Module } from '@nestjs/common';
import { CloneController } from './clone.controller';
import { CloneService } from './clone.service';
import { TrackingCleanerService } from './tracking-cleaner.service';
import { ExportService } from './export.service';

@Module({
  controllers: [CloneController],
  providers: [CloneService, TrackingCleanerService, ExportService],
  exports: [CloneService, ExportService],
})
export class CloneModule {}

