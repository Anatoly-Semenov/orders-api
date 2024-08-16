import { Timezone } from '../Timezone/Timezone'
import { Orders } from 'src/api/v1/orders/entities/orders.entity'

export class OrderManager<T extends Orders = Orders> {
	order: Orders
	constructor(order: T) {
		this.order = this.clone(order)
	}
	getTimezone(order = this.order): string {
		return order.address.timezone
	}
	clone(data = this.order): OrderManager['order'] {
		return JSON.parse(JSON.stringify(data))
	}
	applyTimezone() {
		const _order = this.clone()
		const timezone = this.getTimezone(_order)
		_order.dateTimeStart = new Timezone(_order.dateTimeStart, timezone).apply()
		_order.dateTimeEnd = new Timezone(_order.dateTimeEnd, timezone).apply()
		_order.orderServices = (_order.orderServices || []).map((os) => {
			os.service.priceSettings = (os.service.priceSettings || []).map((setting) => {
				setting.dateStart &&= new Timezone(setting.dateStart, timezone).apply()
				setting.dateEnd &&= new Timezone(setting.dateEnd, timezone).apply()
				return setting
			})
			return os
		})
		return _order
	}
}
