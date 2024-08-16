export interface RedisConfig {
	host: string
	port: number
	username: string
	password: string
	connectTimeout: number
	maxLoadingRetryTime: number
	disconnectTimeout: number
	sentinelCommandTimeout: number
	tls: object
}

export const redisConfig = (): RedisConfig => ({
	host: process.env.REDIS_HOST || '',
	port: +process.env.REDIS_PORT || 0,
	username: process.env.REDIS_USERNAME || '',
	password: process.env.REDIS_PASSWORD || '',
	connectTimeout: +process.env.REDIS_TIMEOUT || 30000,
	maxLoadingRetryTime: +process.env.REDIS_TIMEOUT || 30000,
	disconnectTimeout: +process.env.REDIS_TIMEOUT || 30000,
	sentinelCommandTimeout: +process.env.REDIS_TIMEOUT || 30000,
	tls: {},
})
