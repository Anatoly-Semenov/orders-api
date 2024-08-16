import { ApiProperty } from '@nestjs/swagger'
import { DefaultOrderDocFields } from '../constants'
import {
	AdditionalOrderDocFields,
	OrderDocFields,
	OrderPaymentDocFields,
} from '../enums/doc-fields.enums'
import { FilterOrdersV2Dto } from './filter-order-v2.dto'

export class ExportOrdersDTO {
	@ApiProperty({
		default: DefaultOrderDocFields,
	})
	fields?: (OrderDocFields | AdditionalOrderDocFields | OrderPaymentDocFields)[]

	@ApiProperty({
		default: {},
	})
	filters?: FilterOrdersV2Dto
}
