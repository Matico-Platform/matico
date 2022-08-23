import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {SessionProvider} from "next-auth/react"
import {Button, darkTheme, Provider, SSRProvider} from '@adobe/react-spectrum';
import {StandardLayout} from '../components/StandardLayout/StandardLayout';
import Head from 'next/head';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

if (typeof window !== 'undefined') {
  LogRocket.init('5fasmn/matico');
  setupLogRocketReact(LogRocket);
}



function MyApp({ Component, pageProps: {session,...pageProps} }: AppProps) {
  return(
    <SessionProvider session={pageProps.session}>
      <SSRProvider>
        <Provider theme={darkTheme} colorScheme="dark">
          <Head>
            <link href="/fonts/fa.min.css" rel="stylesheet" key="font-awesome"/>
          </Head>
          <Component {...pageProps} />
      </Provider>
    </SSRProvider>
    </SessionProvider>
  )
}

export default MyApp
