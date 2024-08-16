import { EQueryFormat } from 'src/utils/filter/enums/filter.enums'
import { FilterUsersDto } from '../dto/filter-users.dto'

export const userFilterSql = (f: FilterUsersDto) => {
	const queryFormat = f.queryFormat || EQueryFormat.AND
	return `
    SELECT 
      u.*,
      (SELECT JSONOBJECTAGG(um2.key, um2.value) FROM usersMeta um2 WHERE userId = u.id) as meta,
      JSON_ARRAYAGG(
        JSONOBJECT('id', r.id, 'name', r.name)  
      ) as roles
      FROM users u
        LEFT JOIN usersRolesUsersRoles ur ON ur.usersId = u.id
        LEFT JOIN usersRoles r ON ur.usersRolesId = r.id
        LEFT JOIN usersClientsClients uc ON uc.usersId = u.id
        LEFT JOIN clients c ON c.id = uc.clientsId
        LEFT JOIN usersAddressesAddresses ua ON ua.usersId = u.id
        LEFT JOIN addresses a ON a.id = ua.addressesId
        LEFT JOIN usersMeta um ON um.userId = u.id
        LEFT JOIN servicesStaffUsers us ON us.usersId = u.id
        LEFT JOIN services s ON s.id = us.servicesId
      WHERE 
        ${f.userEmail ? "u.userEmail = '" + f.userEmail + "' " + queryFormat : ''}
        ${f.userEnable ? "u.isEnable = '" + f.userEnable + "' " + queryFormat : ''}

        ${f.clientsId ? "c.id = '" + f.clientsId + "' " + queryFormat : ''}
        ${f.roles ? 'r.name IN ( ' + f.roles + ') ' + queryFormat : ''}
        ${f.countryIsoCode ? "a.countryIsoCode = '" + f.countryIsoCode + "' " + queryFormat : ''}
        ${f.city ? "a.city = '" + f.city + "' " + queryFormat : ''}
        ${f.street ? "a.city = '" + f.street + "' " + queryFormat : ''}
        ${f.services ? 's.id IN (' + f.services + ') ' + queryFormat : ''}
        ${
					f.firstname
						? " um.key = 'firstname' AND um.value = '" + f.firstname + "'" + queryFormat
						: ''
				}
        ${
					f.lastname ? " um.key = 'lastname' AND um.value = '" + f.lastname + "'" + queryFormat : ''
				}
        ${
					f.birthdate
						? " um.key = 'birthdate' AND um.value = '" + f.birthdate + "'" + queryFormat
						: ''
				}
        ${
					f.instagram
						? " um.key = 'instagram' AND um.value = '" + f.instagram + "'" + queryFormat
						: ''
				}
        ${
					f.workname ? " um.key = 'workname' AND um.value = '" + f.workname + "'" + queryFormat : ''
				}
        ${f.phone ? " um.key = 'phone' AND um.value = '" + f.phone + "'" + queryFormat : ''}
        1=1
      GROUP BY u.id
      ORDER BY ${f.orderField || 'u.id'}
      ${f.order || 'ASC'}
      LIMIT ${f.offset || 0}, ${f.limit || 25}
      `
}
