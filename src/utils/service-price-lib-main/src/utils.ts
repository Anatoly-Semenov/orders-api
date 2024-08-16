/* eslint-disable @typescript-eslint/ban-ts-comment */

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export const clearDate = (date: Date) => {
	const _date = new Date(date)
	return new Date(_date.getFullYear(), _date.getMonth(), _date.getDate())
}

export const unifyArray = <T extends Array<unknown>>(arr: T) => {
	return arr && Array.from(new Set([...arr]))
}

export function contains(where: unknown[], what: unknown[], any = true) {
	for (let i = 0; i < what.length; i++) {
		if (any) {
			if (where.indexOf(what[i]) !== -1) return true
		} else {
			if (where.indexOf(what[i]) === -1) return false
		}
	}
	return !any
}

export function dateToMinutes<T extends Date>(date?: T) {
	if (date) return date.getHours() * 60 + date.getMinutes()
	return
}

export const getDayName = (date: Date) => WEEK_DAYS[date.getDay()]

export const getAllDatesBetween = (dateFrom: Date, dateTo: Date) => {
	dateFrom && (dateFrom = new Date(dateFrom))
	dateTo && (dateTo = new Date(dateTo))
	const dateArray = []
	if (dateFrom && dateTo) {
		const currentDate = dateFrom
		while (currentDate <= dateTo) {
			dateArray.push(new Date(currentDate))
			currentDate.setDate(currentDate.getDate() + 1)
		}
	}
	return dateArray
}

export const getAllDaysBetween = (dateFrom: Date, dateTo: Date, unique = false): string[] => {
	const days = getAllDatesBetween(dateFrom, dateTo).map((d) => getDayName(d))
	return unique ? unifyArray(days) : days
}
