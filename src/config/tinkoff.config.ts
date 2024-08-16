export interface TinkoffConfig {
	username: string
	password: string
	url: string
	url_pay: string
	url_notification: string
	terminalRegisterUrl: string
	terminalKey: string
	taxation: string
	tax: string
}

export const tinkoffConfig = (): TinkoffConfig => ({
	username: process.env.TINKOFF_SPLIT_USERNAME,
	password: process.env.TINKOFF_SPLIT_PASSWORD,
	url: process.env.TINKOFF_URL,
	url_pay: process.env.TINKOFF_PAY_URL,
	url_notification: process.env.TINKOFF_NOTIFICATION_URL,
	terminalRegisterUrl: process.env.TINKOFF_TERMINAL_REGISTER_URL,
	terminalKey: process.env.TINKOFF_TERMINAL_KEY,
	taxation: process.env.TINKOFF_TAXATION,
	tax: process.env.TINKOFF_TAX,
})
