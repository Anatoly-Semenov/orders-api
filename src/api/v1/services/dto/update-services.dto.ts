import { PartialType } from '@nestjs/swagger'
import { CreateServicesDto } from './create-services.dto'

export class UpdateServicesDto extends PartialType(CreateServicesDto) {}
