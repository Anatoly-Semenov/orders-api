import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import {
	ETinkoffPaymentMethod,
	ETinkoffPaymentObject,
	ETinkoffTax,
	ETinkoffTaxation,
} from '../../enums/tinkoff/tinkoff.enum'
export class InitTinkoffSupplierInfo {
	@ApiProperty()
	@IsArray()
	Phones: string[]

	@ApiProperty()
	@IsString()
	Name: string

	@ApiProperty()
	@IsString()
	Inn: string
}

export class InitTinkoffReceiptItem {
	@ApiProperty()
	@IsString()
	Name: string

	@ApiProperty()
	@IsInt()
	Price: number

	@ApiProperty()
	@IsInt()
	Quantity: number

	@ApiProperty()
	@IsInt()
	Amount: number

	@ApiProperty({
		enum: ETinkoffPaymentMethod,
	})
	@IsEnum(ETinkoffPaymentMethod)
	PaymentMethod: ETinkoffPaymentMethod

	@ApiProperty({
		enum: ETinkoffPaymentObject,
	})
	@IsEnum(ETinkoffPaymentObject)
	PaymentObject: ETinkoffPaymentObject

	@ApiProperty({
		enum: ETinkoffTax,
	})
	Tax: ETinkoffTax | string

	@ApiProperty()
	@IsString()
	@IsOptional()
	Ean13?: string

	@ApiProperty({
		type: InitTinkoffSupplierInfo,
	})
	@IsOptional()
	SupplierInfo?: InitTinkoffSupplierInfo
}
export class InitTinkoffPayments {
	@ApiProperty()
	@IsNumber()
	Electronic: number
}

export class InitTinkoffReceipt {
	@ApiProperty()
	@IsString()
	Email: string

	@ApiProperty()
	@IsString()
	Phone: string

	@ApiProperty()
	@IsString()
	EmailCompany: string

	@ApiProperty({
		enum: ETinkoffTaxation,
	})
	Taxation: ETinkoffTaxation | string

	@ApiProperty({
		type: [InitTinkoffReceiptItem],
	})
	Items: InitTinkoffReceiptItem[]

	@ApiProperty({
		type: InitTinkoffPayments,
	})
	@IsOptional()
	Payments?: InitTinkoffPayments
}

export class InitTinkoffShopDto {
	ShopCode: string
	Amount: number
	Name: string
}

export class InitTinkoffDto {
	@ApiProperty()
	@IsString()
	TerminalKey?: string

	@ApiProperty()
	@IsInt()
	Amount: number

	@ApiProperty()
	@IsInt()
	OrderId: number

	@ApiProperty()
	@IsString()
	Description?: string

	@ApiProperty()
	@IsOptional()
	DATA?: any

	@ApiProperty({
		type: InitTinkoffReceipt,
	})
	@IsOptional()
	Receipt?: InitTinkoffReceipt

	@ApiProperty({
		type: [InitTinkoffShopDto],
	})
	Shops?: InitTinkoffShopDto[]

	@ApiProperty()
	@IsString()
	SuccessURL?: string

	@ApiProperty()
	@IsString()
	FailURL?: string

	@ApiProperty()
	@IsString()
	RedirectDueDate?: string

	@ApiProperty()
	@IsString()
	NotificationURL?: string
}
