import { BadRequestException } from '@nestjs/common'

export async function generateWorkingTime(workingTimeArray) {
	if (!workingTimeArray || !workingTimeArray.length) return []

	// const daysList = workingTimeArray
	//   .map((item) => {
	//     if (typeof item?.day == 'string') {
	//       item.day = item?.day.split(',');
	//     }
	//     item.day = item.day.map((d) => `${d}_${item.sortPosition}`);
	//     return item.day;
	//   })
	//   .flat();

	// const dublicates = await getDublicatesDays(daysList);

	// if (dublicates.length) {
	//   throw new BadRequestException(
	//     {
	//       dublicateIn: dublicates.map((dublicate) => {
	//         const d = dublicate.split('_');
	//         return { day: d[0], sortPostion: Number(d[1]) };
	//       }),
	//     },
	//     `${dublicates.join(', ')} - Dublicate days`,
	//   );
	// }

	const workingTime = workingTimeArray.map((wta: any) => {
		if (typeof wta?.day == 'string') {
			wta.day = wta?.day.split(',')
		}
		wta.day = wta.day.map((d) => d.split('_')[0])
		return wta
	})

	return workingTime
}

async function getDublicatesDays(daysArray) {
	const uniqDays = []
	const dublicateDays = []
	for (const d of daysArray) {
		const day = d.split('_')[0]
		if (uniqDays.includes(day)) {
			dublicateDays.push(d)
		} else {
			uniqDays.push(day)
		}
	}
	return dublicateDays
}
