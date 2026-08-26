import '@/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {
    faAward, faBriefcase, faBuildingColumns, faC, faCalendarDays, faChevronRight, faEnvelope,
    faEnvelopeOpenText, faLocationDot, faNewspaper, faTags, faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import {
    faBuilding, faFile,
} from '@fortawesome/free-regular-svg-icons';
import {
    faApple, faAws, faDocker, faGit, faGithub, faGithubAlt, faGoogle, faJava, faJs,
    faLinkedinIn, faLinux, faMicrosoft, faNode, faPython, faReact, faUbuntu, faWindows,
} from '@fortawesome/free-brands-svg-icons';
import Head from 'next/head';
import data from "@/components/data.json";
import NavBar from '@/components/bar/nav';
import Footer from '@/components/bar/footer';

const { library } = require('@fortawesome/fontawesome-svg-core');

// Only the icons this site actually renders are registered. Importing the whole
// fas / fab / far sets instead pulls in 2728 icons and roughly 600 KB gzipped onto
// EVERY page, so do not go back to library.add(fas, fab, far).
//
// Adding a new icon={"fa-solid fa-whatever"} string anywhere means adding its
// import here too, or it silently renders nothing.
library.add(
    faAward, faBriefcase, faBuildingColumns, faC, faCalendarDays, faChevronRight, faEnvelope,
    faEnvelopeOpenText, faLocationDot, faNewspaper, faTags, faUserGroup, faBuilding, faFile,
    faApple, faAws, faDocker, faGit, faGithub, faGithubAlt, faGoogle, faJava, faJs,
    faLinkedinIn, faLinux, faMicrosoft, faNode, faPython, faReact, faUbuntu, faWindows,
);

export default function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>{data.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <NavBar />
            <Component {...pageProps} />
            <Footer />
        </div>
    );
  }
