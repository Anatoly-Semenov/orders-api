import { Module } from '@nestjs/common'
import { CaddyService } from './caddy.service'
import { HttpModule } from '@nestjs/axios'

@Module({
	imports: [HttpModule],
	providers: [CaddyService],
	exports: [CaddyModule, CaddyService],
})
export class CaddyModule {}
