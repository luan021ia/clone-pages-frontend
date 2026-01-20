import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../../database/entities/task.entity';
import { ITaskRepository } from '../interfaces/task-repository.interface'

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>
  ) {}

  async listByUser(userId: string): Promise<Task[]> {
    return this.repo.find({ where: { user: { id: userId } } })
  }

  async getById(id: string): Promise<Task | null> {
    return this.repo.findOne({ where: { id } })
  }

  async findById(id: string): Promise<Task | null> {
    return this.repo.findOne({ where: { id } })
  }

  async create(userId: string, data: Partial<Task>): Promise<Task> {
    const entity = this.repo.create({ ...data, user: { id: userId } as any })
    return this.repo.save(entity)
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    await this.repo.update({ id }, data)
    const updated = await this.getById(id)
    if (!updated) throw new Error('Task not found')
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id })
  }
}