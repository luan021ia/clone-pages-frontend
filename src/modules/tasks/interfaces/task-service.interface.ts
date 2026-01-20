import { Task } from '../../../database/entities/task.entity'
import { CreateTaskDto } from '../dto/create-task.dto'
import { UpdateTaskDto } from '../dto/update-task.dto'

export interface ITaskService {
  list(userId: string): Promise<Task[]>
  create(userId: string, data: CreateTaskDto): Promise<Task>
  update(id: string, data: UpdateTaskDto): Promise<Task>
  remove(id: string): Promise<void>
  getById(id: string): Promise<Task | null>
}