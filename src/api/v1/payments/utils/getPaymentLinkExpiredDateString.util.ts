import * as dayjs from 'dayjs'
import * as timezone from 'dayjs/plugin/timezone'

const secPerOneDay = 60 * 60 * 24

const dateFormat = (date: Date) => {
	if (!dayjs.tz) {
		dayjs.extend(timezone)
	}
	return dayjs(date).tz('Europe/Moscow').format()
}

export const getPaymentLinkExpiredDate = (
	paymentLinkSeconds: number | null = secPerOneDay,
): Date => {
	return new Date(Date.now() + paymentLinkSeconds * 1000)
}

export const getPaymentLinkExpiredDateString = (
	paymentLinkSeconds: number | null = secPerOneDay,
): string => {
	const date = getPaymentLinkExpiredDate(paymentLinkSeconds)

	return dateFormat(date)
}
