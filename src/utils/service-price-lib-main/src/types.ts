export interface ITarget {
	id: number
	name: string
}

export enum PriceSettingsActions {
	const = 'const',
	temporarily = 'temporarily',
	from = 'from',
}

export enum ServiceFormats {
	time = 'time',
	timeAndPlace = 'timeAndPlace',
	without = 'without',
}

export enum ServiceTypes {
	rent = 'rent',
	individual = 'individual',
	group = 'group',
	additional = 'additional',
}

export enum ServicePaymentTypes {
	time = 'time',
	piece = 'piece',
}

export enum ServiceBlockBookingTypes {
	m = 'min',
	h = 'hour',
}

export enum ServiceSeatsPaymentTypes {
	place = 'place',
	time = 'time',
}

export interface IPriceSettingParam {
	id: number
	weekDays: string[]
	timeStart: number
	timeEnd: number
	durationHour: string | number
	durationMinutes: string | number
	amountPeople: string | number
	amount: string | number
	isDisabled: boolean
}

export interface IPriceSetting {
	id: number
	target?: ITarget
	unimportantTarget: boolean
	action: PriceSettingsActions
	dateStart?: Date
	dateEnd?: Date
	parameters: IPriceSettingParam[]
}

export interface IService {
	id: number | string
	title: string
	description?: string
	price: string | number
	priceSettings: IPriceSetting[]
	type: ServiceTypes
	format: ServiceFormats
	minTimeLength: string | number
	timeLength: string | number
	breakIsEnable: boolean
	break: string | number
	blockBookingIsEnable: boolean
	blockBookingTime: string | number
	blockBookingType: ServiceBlockBookingTypes
	seats: string | number
	includedSeats: string | number
	additionalSeatsIsEnable: boolean
	additionalSeats: string | number
	additionalSeatsPaymentType: ServiceSeatsPaymentTypes
	additionalSeatsAmount: string | number
	targets: ITarget[]
	amountPeopleMin: string | number
	amountPeopleMax: string | number
	paymentType: ServicePaymentTypes
	paymentAmount: string | number
	duration: string | number
	parentServices: Array<{ id: number }>
	customerCanView: boolean
	isEnable: boolean
	isRequire: boolean
	isValid: boolean
	clientId: string | number
	sortPosition?: number
}
