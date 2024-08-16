import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { EFiles, EFilesHost, EFilesTags } from '../enums/files.enum'
import { FileDto } from './file.dto'

export class SaveFileDto extends FileDto {
	@ApiProperty({
		description: 'Entity type',
		enum: EFiles,
		default: EFiles.Clients,
		type: EFiles,
	})
	@IsEnum(EFiles)
	readonly type: EFiles

	@ApiProperty({
		description: 'File tag',
		enum: EFilesTags,
		default: EFilesTags.Photo,
		type: EFilesTags,
	})
	@IsEnum(EFilesTags)
	readonly tag: EFilesTags
}
