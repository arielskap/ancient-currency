import Layout from "@components/Layout"
import TableDivisa from "@components/TableDivisa"
import { IDivisa } from "interface/IDivisa"
import { GetServerSideProps } from "next"

interface Props {
	divisas: IDivisa[]
}

const Index: React.FC<Props> = ( { divisas } ) => {
	console.log( divisas )
	return (
		<Layout>
			<div className='flex flex-col justify-center w-screen pt-6'>
				<div className='space-y-6'>
					{divisas.map( ( { rates, base, date } ) => {
						return (
							<div key={`table-${base}`}>
								<TableDivisa tarifas={rates} nombre={base} fecha={date} cantPorPagina={5} />
							</div>
						)
					} )}
				</div>
				{/* <div>
					<input type="text" name="new-divisa" id="" placeholder="Escriba nueva divisa" />
					<button type='submit'>Traer Nueva Divisa</button>
				</div> */}
			</div>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = async () => {
	const divisasResult = await Promise.all( [
		fetch( `https://api.exchangeratesapi.io/latest?base=USD` ),
		fetch( `https://api.exchangeratesapi.io/latest?base=EUR` )
	] )
		.then( ( divisas ) => {
			return Promise.all( divisas.map( ( divisa ) => {
				return divisa.json()
			} ) )
		} ).catch( ( e ) => {
			console.log( e )
			return e
		} ).then( ( result ) => {
			// console.log( result )
			return result
		} )

	const parseDivisas = divisasResult.map( ( divisa ) => {
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
	} )

	return { props: { divisas: parseDivisas } }
}

export default Index
