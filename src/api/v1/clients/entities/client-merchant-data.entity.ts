import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import {
	CreateMerchantShopInTinkoffAddressesDto,
	CreateMerchantShopInTinkoffCEODto,
	CreateMerchantShopInTinkoffBankAccountDto,
} from '../../payments/dto/tinkoff/create-merchant-shop-in-tinkoff.dto'
import { EPaymentProvider } from '../../payments/enums/payments.enum'
import { Clients } from './clients.entity'

@Entity()
export class ClientMerchantData {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	billingDescriptor: string

	@Column()
	fullName: string

	@Column()
	name: string

	@Column()
	inn: string

	@Column()
	kpp: string

	@Column()
	ogrn: string

	@Column({
		type: 'jsonb',
	})
	addresses: CreateMerchantShopInTinkoffAddressesDto[]

	@Column()
	email: string

	@Column()
	siteUrl: string

	@Column({
		default: '',
	})
	code: string

	@Column({
		default: '',
	})
	shopCode: string

	@Column({
		type: 'jsonb',
		default: [],
	})
	terminals: any

	@Column({
		type: 'jsonb',
	})
	ceo: CreateMerchantShopInTinkoffCEODto

	@Column({
		type: 'jsonb',
	})
	bankAccount: CreateMerchantShopInTinkoffBankAccountDto

	@Column({
		enum: EPaymentProvider,
		default: EPaymentProvider.TINKOFF,
	})
	provider: EPaymentProvider

	@OneToOne(() => Clients, (client) => client.merchantData, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	client: Clients
}
