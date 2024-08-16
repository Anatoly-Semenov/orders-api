import { ServicePriceSetting } from './ServicePriceSetting'
import type { ServicePriceSettingParameter } from './ServicePriceSettingParam'
import { PriceSettingsActions, ServiceTypes, IService, ITarget } from './types'
import { clearDate } from './utils'

export class ServicePriceLib {
	service: IService
	settings

	constructor(service: any) {
		this.service = service
		this.settings = this.service.priceSettings.map(
			(setting) => new ServicePriceSetting(setting, this.service),
		)
	}

	getSettingsByPriority(settings = this.settings) {
		return [
			...settings.sort(({ setting }) => {
				if (setting.action === PriceSettingsActions.const) return -2
				if (setting.action === PriceSettingsActions.from) return -1
				return 0
			}),
		].reverse()
	}

	getSettingsFromOptions({
		dateStart,
		dateEnd,
		target,
	}: {
		dateStart: Date
		dateEnd: Date
		target?: ITarget['id']
	}) {
		return this.settings.filter((setting) => {
			let isTarget = true
			let isDate = true
			const settingStart = setting.start && clearDate(setting.start)
			const settingEnd = setting.end && clearDate(setting.end)
			if (
				target !== undefined &&
				setting.target &&
				!setting.setting.unimportantTarget &&
				this.service.type === ServiceTypes.rent
			) {
				isTarget = target ? +setting.target.id === +target : false
			}
			if (setting.setting.action === PriceSettingsActions.from && settingStart) {
				isDate = +clearDate(dateStart) >= +settingStart
			}
			if (
				setting.setting.action === PriceSettingsActions.temporarily &&
				settingStart &&
				settingEnd
			) {
				isDate = +clearDate(dateStart) >= +settingStart && +clearDate(dateEnd) <= +settingEnd
			}
			return isDate && isTarget
		})
	}

	getParamFromOptions({
		target,
		...settingOptions
	}: Parameters<(typeof ServicePriceSetting)['prototype']['getParamFromOptions']>[0] & {
		target?: ITarget['id']
	}) {
		let param: ServicePriceSettingParameter | undefined
		this.getSettingsByPriority(this.getSettingsFromOptions({ target, ...settingOptions })).some(
			(setting) => {
				return (param = setting.getParamFromOptions(settingOptions))
			},
		)

		return param
	}
}
