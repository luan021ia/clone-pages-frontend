import { Inject, Injectable } from '@nestjs/common'
import { ITaskService } from '../interfaces/task-service.interface'
import { ITaskRepository } from '../interfaces/task-repository.interface'
import { CreateTaskDto } from '../dto/create-task.dto'
import { UpdateTaskDto } from '../dto/update-task.dto'
import { TaskStatus } from '../../../database/entities/task.entity'

@Injectable()
export class TasksService implements ITaskService {
  constructor(@Inject('ITaskRepository') private readonly tasks: ITaskRepository) {}

  async list(userId: string) {
    return this.tasks.listByUser(userId)
  }

  async create(userId: string, data: CreateTaskDto) {
    const status = data.status || TaskStatus.OPEN
    return this.tasks.create(userId, { title: data.title, description: data.description, status })
  }

  async update(id: string, data: UpdateTaskDto) {
    return this.tasks.update(id, data)
  }

  async remove(id: string) {
    await this.tasks.delete(id)
  }

  async getById(id: string) {
    return this.tasks.findById(id)
  }
}