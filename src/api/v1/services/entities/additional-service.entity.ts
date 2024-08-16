import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
	JoinTable,
	ManyToOne,
	JoinColumn,
} from 'typeorm'
import { Addresses } from '../../addresses/entities/address.entity'
import { Clients } from '../../clients/entities/clients.entity'
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
import { Services } from './services.entity'

@Entity()
export class AdditionalService {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ nullable: true })
	title: string

	@Column({ length: 200, default: '' })
	description: string

	@ManyToMany(() => Addresses, (address) => address.services, {
		cascade: ['insert'],
		eager: true,
	})
	@JoinTable()
	addresses: Addresses[]

	@Column({
		type: 'json',
		nullable: true,
	})
	components: any[]

	//   Аренда или что то еще
	@Column({
		default: EServiceTypes.Rent,
	})
	type: string

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

	@Column({ default: EAdditionalTypes.REQUISITE })
	additionalType: string

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

	@OneToMany(
		() => AdditionalEnableServices,
		(additionalEnableServices) => additionalEnableServices.parent,
		{
			cascade: ['insert', 'update', 'remove'],
		},
	)
	targets: AdditionalEnableServices[]

	//Предоплата
	@Column({ default: EServicePrepayment.Main })
	prepayment: string

	@Column({ default: 0 })
	duration: number

	//Размер предоплаты
	@Column({ default: 0 })
	prepaymentAmount: number

	@Column({ default: 0 })
	paymentAmount: number

	@Column({ default: true })
	isValid: boolean

	//Тип предоплаты %/сумма
	@Column({ default: EServicePaymentTypes.Amount })
	prepaymentType: string

	//Тип предоплаты %/сумма
	@Column({ default: EPaymentTypes.TIME })
	paymentType: string

	//Отображать для клиентов
	@Column({ default: false })
	customerCanView: boolean

	//Приоритет сортировки
	@Column({
		default: 0,
	})
	sortPosition: number

	//Цена
	@Column({ default: 0 })
	price: number

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

	@ManyToMany(() => Services, (service) => service.additionalServices, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	parentServices: Services[]

	@OneToMany(() => AdditionalEnableServices, (ade) => ade.parent, {
		cascade: ['insert', 'update', 'remove'],
		onUpdate: 'CASCADE',
	})
	@JoinColumn()
	additionalEnableServices: AdditionalEnableServices[]

	// Свящь с компанией
	@ManyToOne(() => Clients, (client) => client.services, {
		onDelete: 'CASCADE',
	})
	client: Clients

	@ManyToOne(() => ServiceCategories, (category) => category.services, {
		onDelete: 'CASCADE',
	})
	@Column({ type: 'json', nullable: true })
	prepaymentParams: any[]
}
