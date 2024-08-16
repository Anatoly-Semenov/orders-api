import { EQueryFormat } from 'src/utils/filter/enums/filter.enums'
import { FilterOrdersDto } from '../dto/filter-orders.dto'

//Deprecated
export const orderFilterSql = (f: FilterOrdersDto): string => {
	const queryFormat = f.queryFormat || EQueryFormat.AND
	return `
    SELECT 
        b.*,
    FROM orders o
        LEFT JOIN users u ON u.id = o.userId
        LEFT JOIN usersMeta um ON um.userId = u.id
        LEFT JOIN servicesOrdersOrders so ON so.ordersId = o.id
        LEFT JOIN services s ON s.id = so.servicesId
        LEFT JOIN servicesStaffUsers ss ON ss.servicesId = s.id
        LEFT JOIN users staff ON staff.id = ss.usersId
        LEFT JOIN orderPayments op ON op.orderId = o.id
    WHERE 
       ${f.id ? "o.id IN ('" + f.id + "') " + queryFormat : ''}
       ${f.userId ? 'u.id = ' + f.userId + ' ' + queryFormat : ''}
       ${f.userEmail ? "u.userEmail =  '" + f.userEmail + "' " + queryFormat : ''}
       ${f.userPhone ? "um.key = 'phone' AND um.value = '" + f.userPhone + "'" + queryFormat : ''}
       ${f.services ? "s.id IN ('" + f.services + "') " + queryFormat : ''}
       ${f.mainServiceId ? "o.mainServiceId = '" + f.mainServiceId + "' " + queryFormat : ''}
       ${f.status ? "o.status = '" + f.status + "' " + queryFormat : ''}
       
       ${f.paymentIsFree ? "op.isFree = '" + f.paymentIsFree + "' " + queryFormat : ''}
       ${f.staffId ? "staff.id = '" + f.staffId + "' " + queryFormat : ''}
       ${f.dateTimeStart ? "o.dateTimeStart >= '" + f.dateTimeStart + "' AND" : ''}
       ${f.dateTimeEnd ? "o.dateTimeEnd <= '" + f.dateTimeEnd + "' AND" : ''}
       
        1=1
    GROUP BY o.id
    ORDER BY ${f.orderField || 'o.id'}
    ${f.order || 'ASC'}
    LIMIT ${f.offset || 0}, ${f.limit || 25}
    `
}
