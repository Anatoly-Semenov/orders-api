import { format } from 'date-fns-tz'
import { getHours, parseISO, setHours, setMilliseconds, setSeconds, sub } from 'date-fns'

export class DateTimeHelper {
	getDeteString(date: string): string {
		const offset = this.timeOffset(new Date(date)).getUTCHours()
		const dateString = format(sub(parseISO(date), { hours: offset }), 'yyyy-MM-dd')
		return dateString
	}
	getTimeString(date: string): string {
		const offset = this.timeOffset(new Date(date)).getUTCHours()
		const timeString = format(sub(parseISO(date), { hours: offset }), 'HH:mm')
		return timeString
	}
	getNormalDate(dateTimeString: string): Date {
		return new Date(parseISO(dateTimeString))
	}
	convertTimeTiMinutes(dateTimeString: string): number {
		let dateTime = new Date(parseISO(dateTimeString))
		const offset = this.timeOffset(dateTime).getUTCHours()

		dateTime = setMilliseconds(setSeconds(dateTime, 0), 0)
		dateTime = sub(dateTime, { hours: offset })

		return dateTime.getHours() * 60 + dateTime.getMinutes()
	}
	private timeOffset(date: Date) {
		return new Date(date.getMinutes() - date?.getTimezoneOffset() * 60 * 1000)
	}

	getApproximateTime(minutes: number, findArray) {
		findArray = findArray?.filter((fa) => fa <= minutes)

		const result =
			findArray?.reduce(function (prev, curr) {
				return Math.abs(curr - minutes) < Math.abs(prev - minutes) ? curr : prev
			}) || 0

		return result
	}
}
