import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from 'dotenv'
import { join } from 'path'
config()

// __dirname em produção: dist/config/
// __dirname em dev (ts-node): src/config/
// baseDir sempre aponta para o diretório pai (dist/ ou src/)
const baseDir = join(__dirname, '..')
const isProd = process.env.NODE_ENV === 'production'

// Usar SQLite em todos os ambientes (dev e produção)
const dataSourceConfig: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.SQLITE_DB || 'saas-dev.sqlite',
  entities: isProd
    ? [join(baseDir, '**/*.entity.js')]
    : [join(baseDir, '**/*.entity{.ts,.js}')],
  migrations: isProd
    ? [join(baseDir, 'database/migrations/*.js')]
    : [join(baseDir, 'database/migrations/*{.ts,.js}')],
  synchronize: true
}

export default new DataSource(dataSourceConfig)

