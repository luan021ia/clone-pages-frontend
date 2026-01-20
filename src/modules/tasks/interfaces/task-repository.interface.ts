import { Task } from '../../../database/entities/task.entity'

export interface ITaskRepository {
  listByUser(userId: string): Promise<Task[]>
  getById(id: string): Promise<Task | null>
  findById(id: string): Promise<Task | null>
  create(userId: string, data: Partial<Task>): Promise<Task>
  update(id: string, data: Partial<Task>): Promise<Task>
  delete(id: string): Promise<void>
}