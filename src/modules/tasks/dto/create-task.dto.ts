import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { TaskStatus } from '../../../database/entities/task.entity'

export class CreateTaskDto {
  @IsNotEmpty()
  title!: string

  @IsOptional()
  description?: string

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus
}