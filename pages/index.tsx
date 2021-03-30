import { Button } from "@components/Button"
import Layout from "@components/Layout"
import TableDivisa from "@components/TableDivisa"
import { IDivisa } from "interface/IDivisa"
import { GetServerSideProps } from "next"
import { useEffect, useRef, useState } from "react"
import { fetchDivisa, parseDivisa } from "utils/divisa"

interface Props {
	divisas: IDivisa[]
}

const Index: React.FC<Props> = ( { divisas } ) => {
	const inputDivisa = useRef<HTMLInputElement>( null )
	const [divisasState, setDivisasState] = useState<IDivisa[]>( divisas )
	const [errorDivisa, setErrorDivisa] = useState( {
		text: ``,
		base: ``
	} )
	const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
		e.preventDefault()
		const nameNewDivisa = inputDivisa.current.value.toUpperCase()

		if ( divisas.some( ( divisa ) => divisa.base === nameNewDivisa ) ) {
			setErrorDivisa( {
				text: `Ya existe una tabla con la moneda: ${nameNewDivisa}`,
				base: nameNewDivisa
			} )
		} else {
			const newDivisa = await fetchDivisa( inputDivisa.current.value.toUpperCase() )

			console.log( newDivisa )
			if ( newDivisa.error ) {
				setErrorDivisa( {
					text: `No esta soportada la moneda ${nameNewDivisa}`,
					base: ``
				} )
			} else {
				setDivisasState( ( prevState ) => {
					prevState.push( newDivisa )
					return prevState
				} )
				setErrorDivisa( {
					text: ``,
					base: ``
				} )
			}
		}
	}

	console.log( divisas )
	return (
		<Layout>
			<div className='flex flex-col justify-center w-screen pt-6'>
				<div className='space-y-6'>
					{divisasState.map( ( { rates, base, date } ) => {
						return (
							<div key={`table-${base}`} id={`table-${base.toUpperCase()}`}>
								<TableDivisa tarifas={rates} nombre={base} fecha={date} cantPorPagina={5} />
							</div>
						)
					} )}
				</div>
				<div className='py-6'>
					<form onSubmit={handleSubmit} className='flex'>
						<input className='px-2 border border-gray-600 roudned' ref={inputDivisa} type="text" name="new-divisa" id="" placeholder="Escriba nueva divisa" />
						<Button type='submit'>Traer Nueva Divisa</Button>
					</form>
					{errorDivisa.text && <p className='text-red-600'>{errorDivisa.text}</p>}
					{errorDivisa.base && <a href={`#table-${errorDivisa.base}`}>Ir a esa tabla</a>}
				</div>
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

	const parseDivisas = divisasResult.map( parseDivisa )

	return { props: { divisas: parseDivisas } }
}

export default Index
