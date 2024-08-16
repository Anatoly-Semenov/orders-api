export function padTo2Digits(num) {
	return String(num).padStart(2, '0')
}

export function getHoursAndMinutes(date) {
	if (date instanceof Date) {
		return `${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}`
	}
	return ''
}

export function formatDate(date) {
	return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join(
		'-',
	)
}
