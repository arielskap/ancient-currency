export function formatDate( date ) {
	const newDate = new Date( date )

	const day = newDate.getDate()
	const month = newDate.getMonth() + 1
	const year = newDate.getFullYear()

	if ( month < 10 ) {
		return `${day}-0${month}-${year}`
	} else {
		return `${day}-${month}-${year}`
	}
}