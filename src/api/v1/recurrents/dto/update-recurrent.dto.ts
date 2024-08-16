import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateRecurrentDto } from './create-recurrent.dto'

export class UpdateRecurrentDto extends PartialType(CreateRecurrentDto) {
	@ApiProperty({
		description: 'Recurrent Id',
	})
	readonly recurrentId: number
}
