import "../styles/globals.css";
import Script from 'next/script'
import type { AppProps } from "next/app";
import { AuthWrapper, LocaleWrapper } from "../libs/wordy/contexts";
import { Page } from "@components/layout";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-LMS12Y29HF"></script>
      <script
        dangerouslySetInnerHTML={{ __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-LMS12Y29HF');
        `}}
      >
        
      </script>
      </Head>
      <LocaleWrapper>
        <AuthWrapper>
          <Page>
            <Component {...pageProps} />
          </Page>
        </AuthWrapper>
      </LocaleWrapper>
    </>
  );
}

export default MyApp;
