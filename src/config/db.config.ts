import * as dotenv from 'dotenv'
import { ConnectionOptions } from 'typeorm'

const path =
	process.env.NODE_ENV === 'production'
		? `${__dirname}/../../.env.production`
		: `${__dirname}/../../.env.development`

dotenv.config({ path })

export const dbConfig = (): ConnectionOptions => ({
	type: process.env.DB_TYPE as 'postgres',
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	cli: {
		migrationsDir: 'src/migrations',
	},
	synchronize: false,
	// @ts-ignore
	autoLoadEntities: true,
	entities: ['dist/**/*.entity{.ts,.js}'],
	migrationsTableName: 'migrations',
	migrations: ['dist/migrations/*{.ts,.js}'],
	migrationsRun: process.env.NODE_ENV === 'production',
	cache: false,
	ssl: {
		rejectUnauthorized: false,
	},
	logging: 'all',
	extra: {
		// based on https://node-postgres.com/api/pool
		// max connection pool size
		max: 80,
	},
})
