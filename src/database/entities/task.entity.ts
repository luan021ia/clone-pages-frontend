import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

export enum TaskStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 160 })
  title!: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'varchar' })
  status!: TaskStatus

  @ManyToOne(() => User)
  user!: User

  @CreateDateColumn()
  createdAt!: Date
}

