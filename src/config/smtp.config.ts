export interface SmtpConfig {
	name: string
	login: string
	password: string
	port: string
	host: string
}

export const smtpConfig = (): SmtpConfig => ({
	name: process.env.SMTP_NAME,
	login: process.env.SMTP_LOGIN,
	password: process.env.SMTP_PASSWORD,
	port: process.env.SMTP_PORT,
	host: process.env.SMTP_HOST,
})
