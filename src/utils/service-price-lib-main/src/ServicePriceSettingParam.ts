import { ServiceTypes, IPriceSettingParam, IService } from './types'

export class ServicePriceSettingParameter {
	param: IPriceSettingParam
	service: IService
	calcOptions: {
		amountPeople?: number
		duration?: number
	}

	constructor(
		param: ServicePriceSettingParameter['param'],
		service: ServicePriceSettingParameter['service'],
	) {
		this.param = param
		this.service = service
		this.calcOptions = {}
	}

	get time() {
		return {
			weekDays: this.param.weekDays,
			start: this.param.timeStart,
			end: this.param.timeEnd,
		}
	}

	setCalcOptions(options: ServicePriceSettingParameter['calcOptions'] = {}) {
		this.calcOptions = options
	}

	updateCalcOptions(options: ServicePriceSettingParameter['calcOptions'] = {}) {
		this.setCalcOptions({ ...this.calcOptions, ...options })
	}

	calcPrice({ amountPeople = 0, duration = 0 } = this.calcOptions) {
		let multiplier = 1
		if (this.service.type === ServiceTypes.rent) multiplier = duration / 60
		if (this.service.type === ServiceTypes.individual) multiplier = amountPeople
		return +this.price * (multiplier || 1)
	}

	get price() {
		return this.param.amount
	}
}
