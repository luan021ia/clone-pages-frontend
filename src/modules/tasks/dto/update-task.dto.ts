import { IsEnum, IsOptional } from 'class-validator'
import { TaskStatus } from '../../../database/entities/task.entity'

export class UpdateTaskDto {
  @IsOptional()
  title?: string

  @IsOptional()
  description?: string

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus
}