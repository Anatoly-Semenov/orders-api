import { ApiProperty } from '@nestjs/swagger'

export class GetClientTimeStepResponseDto {
	@ApiProperty({
		type: Number || String,
	})
	readonly calendarTimeStep: number | string
}
