import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { CreateServicesPriceSettingParamsDto } from 'src/api/v1/services-price-settings/dto/create-services-price-setting-params.dto'

export class ServicesPrepaymentsSettingsDto extends CreateServicesPriceSettingParamsDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	readonly amountType?: string
}
