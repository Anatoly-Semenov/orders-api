/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dayjs from 'dayjs'
import { ServicePriceSettingParameter } from './ServicePriceSettingParam'
import { ServiceTypes, IPriceSetting, IService } from './types'
import { contains, dateToMinutes, getAllDaysBetween } from './utils'

export class ServicePriceSetting {
	setting: IPriceSetting
	service: IService
	parameters

	constructor(setting: ServicePriceSetting['setting'], service: ServicePriceSetting['service']) {
		this.setting = setting
		this.service = service

		this.parameters = this.setting.parameters.map(
			(param) => new ServicePriceSettingParameter(param, this.service),
		)
	}

	getSortedParameters() {
		return this.parameters.sort((a, b) => +a.price - +b.price)
	}

	getParamFromOptions({
		dateStart,
		dateEnd,
		amountPeople,
		isFree = false,
	}: {
		dateStart: Date
		dateEnd: Date
		amountPeople?: number
		isFree?: boolean
	}) {
		const start = dateToMinutes(dateStart)!
		let end = dateToMinutes(dateEnd)!
		end === 0 && (end = 1440)

		const duration = end - start
		const weekDays = getAllDaysBetween(dateStart, dateEnd, true)
		const param = this.getSortedParameters().find((param) => {
			const isBetween = start >= param.time.start && end <= param.time.end
			const isDuration =
				this.service.type === ServiceTypes.rent && !isFree
					? duration >= +param.param.durationHour * 60 + +param.param.durationMinutes
					: true
			const isDay = contains(param.time.weekDays, weekDays)
			const isAmount =
				this.service.type === ServiceTypes.individual && !isFree && amountPeople !== undefined
					? amountPeople >= param.param.amountPeople
					: true
			return isBetween && isDuration && isDay && isAmount && !param.param.isDisabled
		})
		param?.setCalcOptions({
			duration,
			amountPeople,
		})
		return param
	}

	get start() {
		return this.setting.dateStart
	}

	get end() {
		return this.setting.dateEnd
	}

	get target() {
		return this.setting.target
	}
}
