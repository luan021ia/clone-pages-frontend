import { config } from 'dotenv'
config()
import { DataSource } from 'typeorm'
import ds from '../../config/ormconfig'
import { User } from '../entities/user.entity'
import { hash } from 'bcryptjs'

async function run() {
  const source: DataSource = await ds.initialize()
  const repo = source.getRepository(User)
  const exists = await repo.findOne({ where: { email: 'admin@example.com' } })
  if (!exists) {
    const password = await hash('admin123', 10)
    await repo.save(repo.create({ name: 'Admin', email: 'admin@example.com', password }))
  }
  await source.destroy()
}

run()