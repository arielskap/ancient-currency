import { IDivisa } from "interface/IDivisa"

const fetchDivisa = async ( base: string ): Promise<IDivisa> => {
	const divisa = await fetch( `https://api.exchangeratesapi.io/latest?base=${base}` ).then( ( divisa ) => {
		return divisa.json()
	} ).catch( ( e ) => {
		console.log( e )
		return e
	} ).then( ( result ) => {
		// console.log( result )
		return result
	} )

	return parseDivisa( divisa )
}

const parseDivisa = ( divisa: any ): IDivisa => {
	const ratesArray = []

	for ( const key in divisa.rates ) {
		if ( Object.prototype.hasOwnProperty.call( divisa.rates, key ) ) {
			const value = divisa.rates[key]

			ratesArray.push( {
				name: key,
				value
			} )
		}
	}
	return {
		...divisa,
		rates: ratesArray
	}
}


export {
	fetchDivisa,
	parseDivisa
}