import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Files } from '../../../files/entity/files.entity'
import { CreateServicesDto } from '../create-services.dto'

export class ServicesSmallListSubClientDto extends OmitType(CreateServicesDto, [
	'additionalServices',
	'prepaymentParams',
	'parentServices',
	'target',
]) {
	@ApiProperty()
	readonly id: number

	@ApiProperty()
	readonly files: Files[]
}
