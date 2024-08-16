import { EQueryFormat } from 'src/utils/filter/enums/filter.enums'
import {
	FilterClientsCategoriesDto,
	FilterClientsTypesDto,
} from '../dto/filter-clientcategories.dto'

export const clientsCategoriesFilterSql = (f: FilterClientsCategoriesDto): string => {
	const queryFormat = f.queryFormat || EQueryFormat.AND
	return `
    SELECT 
    *
    FROM clientsCategories
    WHERE 
       ${f.id ? 'id IN (' + f.id + ') ' + queryFormat : ''}
       ${f.name ? "name LIKE  '%" + f.name + "%' " + queryFormat : ''}
        1=1
    LIMIT ${f.offset || 0}, ${f.limit || 25}
    `
}

export const clientsTypesFilterSql = (f: FilterClientsTypesDto): string => {
	const queryFormat = f.queryFormat || EQueryFormat.AND
	return `
      SELECT 
      *
      FROM clientsCategoriesTypes
      WHERE 
         ${f.id ? 'id IN (' + f.id + ') ' + queryFormat : ''}
         ${f.name ? "name LIKE  '%" + f.name + "%' " + queryFormat : ''}
         ${f.categoryId ? "categoryId =  '" + f.categoryId + "' " + queryFormat : ''}
          1=1
      LIMIT ${f.offset || 0}, ${f.limit || 25}
      `
}
