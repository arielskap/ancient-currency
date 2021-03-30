export function formatMoney( amount: string | number, decimalCount = 2, decimal = `,`, thousands = `.` ): string {
	try {
		decimalCount = Math.abs( decimalCount )
		decimalCount = isNaN( decimalCount ) ? 2 : decimalCount

		const negativeSign = amount < 0 ? `-` : ``

		const i = parseInt( amount = Math.abs( Number( amount ) || 0 ).toFixed( decimalCount ) ).toString()
		const j = ( i.length > 3 ) ? i.length % 3 : 0

		return negativeSign + ( j ? i.substr( 0, j ) + thousands : `` ) + i.substr( j ).replace( /(\d{3})(?=\d)/g, `$1` + thousands ) + ( decimalCount ? decimal + Math.abs( ( Number( amount ) || 0 ) - ( Number( i ) || 0 ) ).toFixed( decimalCount ).slice( 2 ) : `` )
	} catch ( e ) {
		console.log( e )
	}
}