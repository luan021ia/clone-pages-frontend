import { User } from '../../../database/entities/user.entity'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'

export interface IUserService {
  create(data: CreateUserDto): Promise<User>
  update(id: string, data: UpdateUserDto): Promise<User>
  remove(id: string): Promise<void>
  getById(id: string): Promise<User | null>
  validate(email: string, plain: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
}