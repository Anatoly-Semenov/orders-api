import { PartialType } from '@nestjs/swagger'
import { CreateCaddyDto } from './create-caddy.dto'

export class UpdateCaddyDto extends PartialType(CreateCaddyDto) {}
