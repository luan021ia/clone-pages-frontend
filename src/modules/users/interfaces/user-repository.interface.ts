import { User } from '../../../database/entities/user.entity'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  findAuthByEmail(email: string): Promise<User | null>
  create(user: Partial<User>): Promise<User>
  update(id: string, data: Partial<User>): Promise<User>
  delete(id: string): Promise<void>
  findAll(): Promise<User[]>
}