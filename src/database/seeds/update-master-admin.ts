import { config } from 'dotenv'
config()
import { DataSource } from 'typeorm'
import ds from '../../config/ormconfig'
import { User } from '../entities/user.entity'
import { hash } from 'bcryptjs'

async function updateMasterAdmin() {
  console.log('🚀 Atualizando Admin Master para role admin...')

  const source: DataSource = await ds.initialize()
  const repo = source.getRepository(User)

  const email = 'luan93dutra@gmail.com'
  const user = await repo.findOne({ where: { email } })

  if (!user) {
    console.log('❌ Usuário não encontrado! Criando...')
    const password = await hash('210293', 10)
    const masterAdmin = repo.create({
      name: 'Luan Dutra - Master Admin',
      email: email,
      password: password,
      role: 'admin'
    })
    await repo.save(masterAdmin)
    console.log('✅ Admin Master criado com sucesso!')
    console.log(`   Email: ${email}`)
    console.log(`   ID: ${masterAdmin.id}`)
    console.log(`   Role: ${masterAdmin.role}`)
  } else {
    console.log('✅ Usuário encontrado! Atualizando role...')
    console.log(`   Email: ${email}`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Role atual: ${user.role}`)

    user.role = 'admin'
    await repo.save(user)

    console.log('✅ Role atualizada para: admin')
  }

  await source.destroy()
}

updateMasterAdmin()
  .then(() => {
    console.log('✨ Processo concluído!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })

