import { config } from 'dotenv'
config()
import ds from '../config/ormconfig'

async function runMigrations() {
  console.log('🚀 Rodando migrations...')

  try {
    const source = await ds.initialize()
    await source.runMigrations()
    console.log('✅ Migrations executadas com sucesso!')
    await source.destroy()
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro ao rodar migrations:', error)
    process.exit(1)
  }
}

runMigrations()

