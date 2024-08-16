import { EQueryFormat } from 'src/utils/filter/enums/filter.enums'
import { FilterClientsDto } from '../dto/filter-clients.dto'

export const clientsFilterSql = (f: FilterClientsDto): string => {
	const queryFormat = f.queryFormat || EQueryFormat.AND
	return `
    SELECT 
    bp.*
    ur.expired
    FROM clients c
        LEFT JOIN userRate ur ON ur.clientId = c.id
        LEFT JOIN addresses a ON a.clientId = c.id
        LEFT JOIN clientsMeta cm ON cm.clientId = c.id
        LEFT JOIN services s ON s.clientId = c.id
    WHERE 
        ${f.id ? "c.id = '" + f.id + "' " + queryFormat : ''}
        ${f.rateId ? "ur.id = '" + f.rateId + "' " + queryFormat : ''}
        ${f.clientName ? "c.clientName = '" + f.clientName + "' " + queryFormat : ''}
        ${f.clientUrl ? "c.clientUrl = '" + f.clientName + "' " + queryFormat : ''}
        ${f.isEnable ? "c.isEnable = '" + f.isEnable + "' " + queryFormat : ''}
        ${f.countryIsoCode ? "a.countryIsoCode = '" + f.countryIsoCode + "' " + queryFormat : ''}
        ${f.city ? "a.countryIsoCode = '" + f.city + "' " + queryFormat : ''}
        ${f.phone ? "cm.key = 'phone' AND cm.value = '" + f.phone + "' " + queryFormat : ''}
        ${f.email ? "cm.key = 'email' AND cm.value = '" + f.email + "' " + queryFormat : ''}
        ${f.serviceId ? "s.id = '" + f.serviceId + "' " + queryFormat : ''}

        1=1
    LIMIT ${f.offset || 0}, ${f.limit || 25}
    `
}
