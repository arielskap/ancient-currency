import Head from "next/head"
import { NextSeo } from "next-seo"
import Header from "./Header"

interface Props {
	title?: string
}

const Layout: React.FunctionComponent<Props> = ( { children, title } ) => {
	return (
		<div>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link href="/logoweb.png" rel="shortcut icon" />
				<link href="/logoweb.png" rel="icon" type="image/png" sizes="16x16" />
				<link href="/logoweb.png" rel="icon" type="image/png" sizes="32x32" />
				<link rel="apple-touch-icon" href="/logoweb.png" />
				<meta name="theme-color" content="#000000" />
			</Head>
			<NextSeo
				title={title}
				description='This is a Ancient Tech Test 😊'
				canonical="http://localhost:3001"
			/>
			<div className="flex flex-col min-h-screen">
				<Header/>
				<main className='flex-grow'>
					<div className='bg-white bg-opacity-70'>
						{children}
					</div>
				</main>
			</div>
		</div>
	)
}

Layout.defaultProps = {
	title: `Inicio 🚀`
}

export default Layout
