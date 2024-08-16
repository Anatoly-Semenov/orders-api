import { EQueryFormat } from 'src/utils/filter/enums/filter.enums'
import { FilterServiceCategoryDto } from '../dto/filter-service-category.dto'

export const serviceCategoryFilterSql = (f: FilterServiceCategoryDto): string => {
	const queryFormat = f.queryFormat || EQueryFormat.AND
	return `
    SELECT 
    *
    FROM serviceCategories
    WHERE 
        ${f.name ? "name LIKE '%" + f.name + "%' " + queryFormat : ''}
        ${f.id ? "id = '" + f.id + "' " + queryFormat : ''}
        1=1
    ORDER BY ${f.orderField || 'id'}
    ${f.order || 'ASC'}
    LIMIT ${f.offset || 0}, ${f.limit || 25}
    `
}
