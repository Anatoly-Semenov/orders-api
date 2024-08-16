import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
	JoinTable,
	ManyToOne,
	JoinColumn,
	Index,
} from 'typeorm'
import { Addresses } from '../../addresses/entities/address.entity'
import { Clients } from '../../clients/entities/clients.entity'
import { Files } from '../../files/entity/files.entity'
import { ServiceCategories } from '../../services-categories/entities/service-categories.entity'

import {
	EAdditionalTypes,
	EBlockBookingType,
	EPaymentTypes,
	EServicePaymentTypes,
	EServicePrepayment,
	EServiceTypes,
} from '../enums/service.enum'
import { AdditionalEnableServices } from './additional-enable-services.entity'
// import { ServicesPrepaymentsSettings } from './service-prepayment-settings.entity';
import { ServicesTarget } from './service-target.entity'

@Entity()
export class Services {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	title: string

	@Column({ length: 1000, default: '' })
	description: string

	@OneToMany(() => Files, (file) => file.services, {
		cascade: ['insert', 'remove', 'update'],
		onDelete: 'CASCADE',
		// eager: true,
	})
	files: Files[]

	@ManyToMany(() => Addresses, (address) => address.services, {
		eager: true,
	})
	@JoinTable({
		name: 'service_addresses',
	})
	addresses: Addresses[]

	@Column({
		type: 'json',
		nullable: true,
	})
	components: any[]

	//   Аренда или что то еще
	@Index()
	@Column({
		default: EServiceTypes.Rent,
	})
	type: string

	@Column({ type: 'decimal', nullable: true })
	price: number

	@Column({
		default: EAdditionalTypes.REQUISITE,
		enum: EAdditionalTypes,
		nullable: true,
	})
	additionalType: EAdditionalTypes

	@Column({
		default: null,
		enum: EPaymentTypes,
		nullable: true,
	})
	paymentType: EPaymentTypes

	@Column({ type: 'decimal', nullable: true })
	paymentAmount: number
	// Оплата за время
	// Оплата за время и место
	// без оплаты
	@Column({
		default: '',
	})
	format: string

	@Column({
		default: EBlockBookingType.MIN,
	})
	blockBookingType: string

	//Мин. длительность сеанса
	@Column({
		default: 0,
	})
	minTimeLength: number

	@Column({
		default: 0,
	})
	timeLength: number

	//Перерыв между сеансами
	@Column({
		default: 0,
	})
	break: number

	//Блокировка онлайн-записи за N мин. до начала сеанса
	@Column({
		default: false,
	})
	blockBookingIsEnable: boolean
	// время блокировки записи для парамтера выше
	@Column({
		default: 0,
	})
	blockBookingTime: number

	@Column({ default: 0 })
	amountPeopleMin: number

	//Вместимость
	@Column({ default: 0 })
	amountPeopleMax: number

	//Вместимость
	@Column({ default: 1 })
	seats: number

	//Места, входящие в стоимость
	@Column({ default: 1 })
	includedSeats: number

	//Дополнительные места on/off
	@Column({ default: false })
	additionalSeatsIsEnable: boolean

	//Количество дополнительных мест (чел)
	@Column({ default: 0 })
	additionalSeats: number

	@Column({
		default: 1,
	})
	copyVersion: number

	//Оплата за доп. места берется за
	@Column({ default: '' })
	additionalSeatsPaymentType: string

	//Стоимость доп. места
	@Column({ default: 0 })
	additionalSeatsAmount: number

	//Цели аренды
	@OneToMany(() => ServicesTarget, (target) => target.services, {
		cascade: ['insert', 'update', 'remove'],
		eager: true,
	})
	targets: ServicesTarget[]

	//Предоплата
	@Column({ default: EServicePrepayment.Main })
	prepayment: string

	@Column({ default: 0 })
	duration: number

	//Размер предоплаты
	@Column({ default: 0 })
	prepaymentAmount: number

	@Column({ default: true })
	isValid: boolean

	//Тип предоплаты %/сумма
	@Column({ default: EServicePaymentTypes.Amount })
	prepaymentType: string

	//Отображать для клиентов
	@Column({ default: false })
	customerCanView: boolean

	//Приоритет сортировки
	@Column({
		default: 0,
	})
	sortPosition: number

	//Активна услуга или нет
	@Column({ default: false })
	isEnable: boolean

	@Column({ default: false })
	breakIsEnable: boolean

	@Column({ default: false })
	isDeleted: boolean

	@Column({ default: false })
	isRequire: boolean

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	created: string

	@ManyToMany(() => Services, (service) => service.parentServices, {
		cascade: ['insert', 'remove', 'update'],
	})
	@JoinTable({
		name: 'service_parent_additional',
	})
	additionalServices: Services[]

	@ManyToMany(() => Services, (service) => service.additionalServices, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinTable({
		name: 'service_parent_additional',
	})
	parentServices: Services[]

	@OneToMany(() => AdditionalEnableServices, (ade) => ade.parent, {
		cascade: ['insert', 'update', 'remove'],
		onUpdate: 'CASCADE',
	})
	additionalEnableServices: AdditionalEnableServices[]

	@Index()
	@ManyToOne(() => Clients, (client) => client.services, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn()
	client: Clients

	@ManyToOne(() => ServiceCategories, (category) => category.services, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	category: ServiceCategories

	@Column({ type: 'json', nullable: true })
	priceSettings: any[]

	@Column({ type: 'json', nullable: true })
	prepaymentParams: any[]
}
