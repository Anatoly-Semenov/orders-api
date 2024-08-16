import * as dotenv from 'dotenv'
import { dbConfig } from './db.config'
import { tinkoffConfig } from './tinkoff.config'
import { smtpConfig } from './smtp.config'
import { authConfig } from './auth.config'
import { redisConfig } from './redis.config'

dotenv.config()

export const enum Config {
	PORT = 'port',
	MODE = 'mode',
	FRONTEND_HOST = 'frontendHost',
	SENTRY_DSN = 'sentryDsn',
	CRYPTR_SECRET = 'cryptrSecret',
	RABBIT_MQ_URL = 'rabbitMqUrl',
	DATABASE = 'database',
	REDIS = 'redis',
	TINKOFF = 'tinkoff',
	SMTP = 'smtp',
}

export const mainConfig = () => ({
	port: +process.env.PORT || 3000,
	mode: process.env.MODE || 'PROD',
	frontendHost: process.env.FRONTEND_HOST,
	sentryDsn: process.env.SENTRY_DSN,
	cryptrSecret: process.env.CRYPTR_SECRET,
	rabbitMqUrl: process.env.RABBIT_MQ_URL,
	auth: {
		...authConfig(),
	},
	database: {
		...dbConfig(),
	},
	redis: {
		...redisConfig(),
	},
	tinkoff: {
		...tinkoffConfig(),
	},
	smtp: {
		...smtpConfig(),
	},
})
