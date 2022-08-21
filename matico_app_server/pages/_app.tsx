import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {SessionProvider} from "next-auth/react"
import {Button, darkTheme, Provider, SSRProvider} from '@adobe/react-spectrum';
import {StandardLayout} from '../components/StandardLayout/StandardLayout';



function MyApp({ Component, pageProps: {session,...pageProps} }: AppProps) {
  return(
    <SessionProvider session={pageProps.session}>
      <SSRProvider>
        <Provider theme={darkTheme}>
          <Component {...pageProps} />
      </Provider>
    </SSRProvider>
    </SessionProvider>
  )
}

export default MyApp