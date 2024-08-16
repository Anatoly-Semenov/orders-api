import { Injectable } from '@nestjs/common'

@Injectable()
export class FilterService {
	createQueryString(filterDto: any, execlude: Array<string> = []): any {
		const whereObj = Object.entries(filterDto).filter(([key, value]) => {
			return !execlude.includes(key) && key != 'offset' && key != 'limit'
		})

		const where = Object.fromEntries(
			Object.entries(whereObj)
				.filter(([key, value]) => key.indexOf('Id') != -1)
				.map(([key, value]) => {
					return [key.split('Id')[0], Object.fromEntries([['id', value]])]
				}),
		)
		return { ...where, ...Object.fromEntries(whereObj) }
	}

	manyToManyFilter(array, dto, entityName): any {
		return array.filter(
			(item) =>
				item[entityName].filter((ii) => {
					return ii.id == dto[entityName + 'Id']
				}).length,
		)
	}
	metaFilter(array: any, dto: any): any {
		return array.filter((item) => {
			return dto.meta.filter((fmeta) => {
				const metaFilter = item.meta
					.map((umeta) => {
						return {
							[umeta.key]: umeta.value,
						}
					})
					.filter((umeta) => {
						return (
							Object.keys(umeta).includes(fmeta.key.toString()) &&
							Object.values(umeta).includes(fmeta.value.toString())
						)
					}).length
				return metaFilter
			}).length
		})
	}
}
