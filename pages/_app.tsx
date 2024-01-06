import '@/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
// import { far } from '@fortawesome/free-regular-svg-icons';
import Head from 'next/head';
import data from "@/components/data.json";

const { library, config } = require('@fortawesome/fontawesome-svg-core');
library.add(fas, fab);

export default function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>{data.name}</title>
                <link rel="shortcut icon" href="/static/photo.jpg" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Component {...pageProps} />
        </div>
    );
  }
