import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { ERateStatus } from '../enums/rate-status.enum'

export class CreateUserRateDto {
	@ApiProperty()
	appId: number

	@ApiProperty()
	rateId: number

	@IsEnum(ERateStatus)
	@ApiProperty({
		enum: ERateStatus,
	})
	status?: ERateStatus = ERateStatus.Nulled
}
