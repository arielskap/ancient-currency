import { Button } from "@components/Button"
import Layout from "@components/Layout"
import TableDivisa from "@components/TableDivisa"
import { IDivisa } from "interface/IDivisa"
import { GetServerSideProps } from "next"
import { useRef, useState } from "react"
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
		const nameNewDivisa = inputDivisa.current?.value.toUpperCase()

		if ( nameNewDivisa ) {
			if ( divisas.some( ( divisa ) => divisa.base === nameNewDivisa ) ) {
				setErrorDivisa( {
					text: `Ya existe una tabla con la moneda: ${nameNewDivisa}`,
					base: nameNewDivisa
				} )
			} else {
				const newDivisa = await fetchDivisa( nameNewDivisa )

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
					window.scrollTo( 0, document.body.scrollHeight )
				}
			}
		} else {
			setErrorDivisa( {
				text: `No se ingreso divisa`,
				base: ``
			} )
		}
	}

	return (
		<Layout>
			<div className='container flex flex-col justify-center w-full px-2 pt-6 mx-auto'>
				<div className='space-y-3 divide-y-2 divide-blue-400 md:grid md:grid-cols-4 md:gap-x-4 md:divide-y-0 md:space-y-0 md:gap-y-4'>
					{divisasState.map( ( { rates, base, date } ) => {
						return (
							<div className='pt-3 md:pt-0' key={`table-${base}`} id={`table-${base.toUpperCase()}`}>
								<TableDivisa tarifas={rates} nombre={base} fecha={date} cantPorPagina={5} />
							</div>
						)
					} )}
				</div>
				<div className='sticky bottom-0 w-full py-3 bg-white'>
					<form onSubmit={handleSubmit} className='grid grid-cols-2 gap-x-4 md:flex md:flex-col md:max-w-xs md:w-full md:mx-auto md:space-y-2'>
						<input className='px-2 border border-gray-600 rounded' ref={inputDivisa} type="text" name="new-divisa" id="" placeholder="Escriba nueva divisa" />
						<Button type='submit'>Traer Nueva Divisa</Button>
					</form>
					<div className='text-center'>
						{errorDivisa.text && <p className='text-red-600'>{errorDivisa.text}</p>}
						{errorDivisa.base && <a className='md:hidden' href={`#table-${errorDivisa.base}`}>Ir a esa tabla</a>}
					</div>
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
			return result
		} )

	const parseDivisas = divisasResult.map( parseDivisa )

	return { props: { divisas: parseDivisas } }
}

export default Index
