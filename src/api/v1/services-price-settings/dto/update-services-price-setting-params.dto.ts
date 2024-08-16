import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'
import { CreateServicesPriceSettingParamsDto } from './create-services-price-setting-params.dto'

export class UpdateServicesPriceSettingParamsDto extends PartialType(
	CreateServicesPriceSettingParamsDto,
) {
	@IsInt()
	@IsOptional()
	@ApiProperty({
		default: 'Id параметра в системе',
	})
	readonly id?: number
}
