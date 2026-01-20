import { config } from 'dotenv'
config()
import ds from '../config/ormconfig'

async function updateAdminRole() {
  console.log('🚀 Atualizando role do admin master...')

  try {
    const source = await ds.initialize()

    await source.query(`
      UPDATE users
      SET role = 'admin'
      WHERE email = 'luan93dutra@gmail.com'
    `)

    // Verificar se foi atualizado
    const [user] = await source.query(`
      SELECT id, email, role
      FROM users
      WHERE email = 'luan93dutra@gmail.com'
    `)

    if (user) {
      console.log('✅ Usuário atualizado com sucesso!')
      console.log(`   Email: ${user.email}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Role: ${user.role}`)
    } else {
      console.log('❌ Usuário não encontrado!')
    }

    await source.destroy()
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro:', error)
    process.exit(1)
  }
}

updateAdminRole()

