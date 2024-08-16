import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsArray, IsOptional } from 'class-validator'
import { CreateServicesPriceSettingDto } from './create-services-price-setting.dto'
import { UpdateServicesPriceSettingParamsDto } from './update-services-price-setting-params.dto'

export class UpdateServicesPriceSettingDto extends PartialType(CreateServicesPriceSettingDto) {
	@IsArray()
	@IsOptional()
	@ApiProperty({
		description: 'Параметры настроки',
		required: false,
		type: [UpdateServicesPriceSettingParamsDto],
	})
	readonly params?: UpdateServicesPriceSettingParamsDto[]
}
