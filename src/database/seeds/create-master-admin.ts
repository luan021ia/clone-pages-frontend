import { config } from 'dotenv'
config()
import { DataSource } from 'typeorm'
import ds from '../../config/ormconfig'
import { User } from '../entities/user.entity'
import { hash } from 'bcryptjs'

async function createMasterAdmin() {
  console.log('🚀 Iniciando criação do Admin Master...')

  const source: DataSource = await ds.initialize()
  const repo = source.getRepository(User)

  const email = 'luan93dutra@gmail.com'
  const exists = await repo.findOne({ where: { email } })

  if (exists) {
    console.log('⚠️  Admin Master já existe!')
    console.log(`   Email: ${email}`)
    console.log(`   ID: ${exists.id}`)
    console.log(`   Nome: ${exists.name}`)
    await source.destroy()
    return
  }

  const password = await hash('210293', 10)
  const masterAdmin = repo.create({
    name: 'Luan Dutra - Master Admin',
    email: email,
    password: password,
    role: 'admin' // DEFINIR COMO ADMIN
  })

  await repo.save(masterAdmin)

  console.log('✅ Admin Master criado com sucesso!')
  console.log(`   Email: ${email}`)
  console.log(`   ID: ${masterAdmin.id}`)
  console.log(`   Nome: ${masterAdmin.name}`)

  await source.destroy()
}

createMasterAdmin()
  .then(() => {
    console.log('✨ Processo concluído!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro ao criar Admin Master:', error)
    process.exit(1)
  })

