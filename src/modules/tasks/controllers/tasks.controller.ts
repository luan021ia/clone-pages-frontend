import { Body, Controller, Delete, Get, Headers, Param, Post, Put, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { TasksService } from '../services/tasks.service'
import { CreateTaskDto } from '../dto/create-task.dto'
import { UpdateTaskDto } from '../dto/update-task.dto'
import { JwtService } from '@nestjs/jwt'

function getUserIdFromAuth(headers: Record<string, string | undefined>, jwt: JwtService) {
  const auth = headers['authorization'] || ''
  const token = auth.startsWith('Bearer ') ? auth.substring(7) : ''
  if (!token) throw new UnauthorizedException('No token provided')
  const payload = jwt.verify(token) as any
  return payload.sub as string
}

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly service: TasksService,
    private readonly jwt: JwtService
  ) {}

  private async validateTaskOwnership(taskId: string, userId: string): Promise<void> {
    // Verificar se a task existe e pertence ao usuário
    const task = await this.service.getById(taskId);
    if (!task) {
      throw new ForbiddenException('Task not found');
    }

    // Se implementado no service, verificar ownership
    // Por enquanto, assumimos que o service.getById retorna apenas tasks do usuário
    // ou implementamos a validação aqui
    if (task.user && task.user.id !== userId) {
      throw new ForbiddenException('Access denied: You can only modify your own tasks');
    }
  }

  @Get()
  list(@Headers() headers: Record<string, string | undefined>) {
    const userId = getUserIdFromAuth(headers, this.jwt)
    return this.service.list(userId)
  }

  @Post()
  create(@Headers() headers: Record<string, string | undefined>, @Body() data: CreateTaskDto) {
    const userId = getUserIdFromAuth(headers, this.jwt)
    return this.service.create(userId, data)
  }

  @Put(':id')
  async update(
    @Headers() headers: Record<string, string | undefined>,
    @Param('id') id: string,
    @Body() data: UpdateTaskDto
  ) {
    const userId = getUserIdFromAuth(headers, this.jwt)
    await this.validateTaskOwnership(id, userId)
    return this.service.update(id, data)
  }

  @Delete(':id')
  async remove(
    @Headers() headers: Record<string, string | undefined>,
    @Param('id') id: string
  ) {
    const userId = getUserIdFromAuth(headers, this.jwt)
    await this.validateTaskOwnership(id, userId)
    return this.service.remove(id)
  }
}